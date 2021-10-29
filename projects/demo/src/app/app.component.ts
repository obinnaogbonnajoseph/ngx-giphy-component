import { Component } from '@angular/core';

export interface SearchVal {
  searchText: string;
  reset: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  gifs: any[] = [];
  loading: boolean = false;
  mode: 'stickers' | 'gifs' = 'gifs';

  searchObj: SearchVal = {
    searchText: '',
    reset: true
  }

  setGifs(gifs: any[]): void {
    this.gifs = gifs;
  }

  getUrl(url: string): string {
    return '';
  }

  selectGif(gif: any, index: number): void { }

  searchGif(target: any) {
    this.searchObj = {
      searchText: target.value,
      reset: true
    };
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  changeMode(mode: 'gifs' | 'stickers'): void {
    this.mode = mode;
  }
}
