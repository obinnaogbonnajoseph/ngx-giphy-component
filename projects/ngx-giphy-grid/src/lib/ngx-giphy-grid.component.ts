import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IGif, IImages, ImageAllTypes } from '@giphy/js-types';
import { NgxGiphyGridService } from './ngx-giphy-grid.service';
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

  /**
   * Emits an array of fetched gifs
   */
  @Output()
  gifs = new EventEmitter<(ImageAllTypes & { altText: string })[]>();

  private oldGifs: (ImageAllTypes & { altText: string })[] = [];

  private length!: number;

  private offset = 0;

  private search = '';

  /**
   * possible values: 'stickers' | 'gifs'
   */
  @Input()
  mode: 'stickers' | 'gifs' = 'gifs';

  /**
   * css class to style parent container for fetched gifs
   */
  @Input()
  className: string = '';

  /**
   * search object.
   * searchText: search string
   * reset: reset previously fetched images or not.
   */
  @Input()
  searchObj: {
    searchText: string;
    reset: boolean;
  } = {
      searchText: '',
      reset: true
    }

  /**
   * emits boolean to show if fetching is ongoing or not
   */
  @Output()
  loading = new EventEmitter<boolean>(false);

  private isLoading = false;

  /**
   * intersect observer initial value
   */
  intersectionObserver: IntersectionObserverInit = {
    threshold: 0.5,
  };

  constructor(private giphyService: NgxGiphyGridService, private elementRef: ElementRef<HTMLElement>) { }

  ngOnChanges(changes: SimpleChanges): void {
    const modeChange = changes.mode;
    const searchChange = changes.searchObj;
    const classNameChange = changes.className;
    if (modeChange) {
      if (modeChange.isFirstChange()) {
        this.giphyService.init();
        this.setIntersectionObserver();
      }
      this.searchGif('')
    } else if (searchChange) {
      this.searchGif(this.searchObj.searchText, this.searchObj.reset);
    }
    if (classNameChange) {
      this.setClassName();
    }
  }

  ngOnInit() { }

  get defaultLength(): number {
    return isMobileWidth() ? 15 : 25;
  }

  get intersectionCondition(): boolean {
    return !this.isLoading;
  }

  private setIntersectionObserver(): void {
    const root = this.elementRef.nativeElement.querySelector('#scroll-parent');
    this.intersectionObserver = {
      ...this.intersectionObserver,
      root,
    };
  }

  private setLengthAndOffset(length: number): void {
    const newOffset = Math.floor(length / 50);
    this.length = (newOffset - this.offset) === 1 ? this.defaultLength :
      length + this.defaultLength;
    this.offset = newOffset;
  }

  private setClassName(): void {
    const rootParent = this.elementRef.nativeElement.querySelector('#scroll-parent');
    if (rootParent) rootParent.className = this.className;
  }

  private getTrendingGifs(): void {
    this.isLoading = true;
    this.loading.emit(this.isLoading);
    this.giphyService
      .getTrending(this.length, this.mode, this.offset)
      .pipe(debounceTime(1000), take(1), timeout(5000))
      .subscribe({
        next: (data) => {
          this.setLengthAndOffset(data.length);
          this.processImages(data);
        },
        complete: () => {
          this.isLoading = false;
          this.loading.emit(this.isLoading);
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
    this.oldGifs = [...this.oldGifs, ...newImages];
    this.gifs.emit(this.oldGifs);
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
    this.offset = 0;
    this.oldGifs = [];
    this.gifs.emit(this.oldGifs);
  }

  /**
   * searches for gifs or stickers
   * @param search search string
   * @param reset reset previously fetched gifs or not
   */
  searchGif(search: string, reset = true): void {
    this.isLoading = true;
    this.loading.emit(this.isLoading);
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
            this.setLengthAndOffset(data.length);
            this.processImages(data);
          },
          complete: () => {
            this.isLoading = false;
            this.loading.emit(this.isLoading);
          },
        });
    } else {
      this.getTrendingGifs();
    }
  }

  /**
   * loads more gifs.
   * this function is called when intersection observer condition if fulfilled
   */
  loadMore = () => {
    this.length = !this.length ? this.defaultLength : this.length;
    this.searchGif(this.search, false);
  };
}
