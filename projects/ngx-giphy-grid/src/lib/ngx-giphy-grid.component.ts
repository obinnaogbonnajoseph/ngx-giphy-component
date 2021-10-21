import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { IGif, IImages, ImageAllTypes } from '@giphy/js-types';
import { NgxGiphyGridService } from 'projects/ngx-giphy-grid/src/public-api';
import { debounceTime, take, timeout } from 'rxjs/operators';

export function isMobileWidth() {
  return window.innerWidth <= 768;
}

@Component({
  selector: 'ngx-giphy-grid',
  templateUrl: './ngx-giphy-grid.component.html',
  styleUrls: ['./ngx-giphy-grid.component.scss']
})
export class NgxGiphyGridComponent implements OnInit, OnChanges {

  @Output()
  gifs = new EventEmitter<(ImageAllTypes & { altText: string })[]>();

  oldGifs: (ImageAllTypes & { altText: string })[] = [];

  altTexts: string[] = [];

  length!: number;

  giphyFetch!: GiphyFetch;

  search!: string;

  @Input()
  mode: 'stickers' | 'gifs' = 'gifs';

  @Input()
  searchObj: {
    searchText: string;
    reset: boolean;
  } = {
      searchText: '',
      reset: true
    }

  @Output()
  loading = new EventEmitter<boolean>(false);

  finishTime = 0;

  intersectionObserver: IntersectionObserverInit = {
    threshold: 0.5,
  };

  constructor(private giphyService: NgxGiphyGridService, private elementRef: ElementRef<HTMLElement>) { }

  ngOnChanges(changes: SimpleChanges): void {
    const modeChange = changes.mode;
    const searchChange = changes.searchObj;
    if (modeChange) {
      this.searchGif('')
    } else if (searchChange) {
      this.searchGif(this.searchObj.searchText, this.searchObj.reset);
    }
  }

  ngOnInit() {
    this.giphyService.init();
    this.giphyFetch = this.giphyService.giphy;
    this.setIntersectionObserver();
  }

  get defaultLength(): number {
    return isMobileWidth() ? 15 : 25;
  }

  get intersectionCondition(): boolean {
    const timeDiff = this.finishTime ? new Date().getMilliseconds() - this.finishTime : 100;
    return !this.loading && Math.abs(timeDiff) >= 100;
  }

  private setIntersectionObserver(): void {
    const root = this.elementRef.nativeElement.querySelector('#scroll-parent');
    this.intersectionObserver = {
      ...this.intersectionObserver,
      root,
    };
  }

  private getTrendingGifs(): void {
    this.loading.emit(true);
    this.giphyService
      .getTrending(this.length, this.mode)
      .pipe(debounceTime(1000), take(1), timeout(5000))
      .subscribe({
        next: (data) => {
          this.length = data.length + this.defaultLength;
          this.processImages(data);
        },
        complete: () => {
          this.finishTime = new Date().getMilliseconds();
          this.loading.emit(false);
        },
      });
  }

  private processImages(data: IGif[]): void {
    const lastData = data[data.length - 1];
    if (this.isNewSetOfData(lastData)) {
      this.processGifImages(data);
    }
  }

  private isNewSetOfData(data: IGif): boolean {
    const rendition = this.getRendition(data.images);
    const lastData = [...this.oldGifs].pop();
    return lastData?.url !== rendition.url;
  }

  private processGifImages(data: IGif[]): void {
    const newImages: (ImageAllTypes & { altText: string })[] = data.slice(-this.defaultLength).map((igif) => {
      const images = igif.images;
      const altText = this.getAltText(igif)
      return {
        ...this.getRendition(images),
        altText
      };
    });
    const gifs = [...this.oldGifs];
    gifs.push(...newImages);
    this.gifs.emit(gifs);
  }

  private getAltText(igif: IGif): string {
    if (igif.title) {
      return igif.title;
    }
    const username = igif?.username ?? '';
    return igif.is_sticker ? `${username} Sticker` : `${username} GIF`;
  }

  private getRendition(images: IImages): ImageAllTypes {
    return isMobileWidth() ? images.fixed_height_small : images.fixed_height;
  }

  private reset(): void {
    this.length = this.defaultLength;
    this.gifs.emit([]);
    this.altTexts = [];
  }

  searchGif(search: string, reset = true): void {
    this.loading.emit(true);
    if (reset) {
      this.reset();
    }
    if (search.trim()) {
      this.search = search.trim();
      this.giphyService
        .getSearchGifs({
          search: this.search,
          limit: this.length,
          type: this.mode,
        })
        .pipe(debounceTime(1000), take(1), timeout(5000))
        .subscribe({
          next: (data) => {
            this.length = data.length + this.defaultLength;
            this.processImages(data);
          },
          complete: () => {
            this.finishTime = new Date().getMilliseconds();
            this.loading.emit(false);
          },
        });
    } else {
      this.getTrendingGifs();
    }
  }

  loadMore = () => {
    this.length = !this.length ? this.defaultLength : this.length;
    this.searchGif(this.search, false);
  };
}
