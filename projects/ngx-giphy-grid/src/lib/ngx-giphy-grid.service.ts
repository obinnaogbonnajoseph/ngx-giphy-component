import { Inject, Injectable } from '@angular/core';
import { GiphyConfig, GIPHY_CONFIG } from 'projects/ngx-giphy-grid/src/public-api';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NgxGiphyGridService {

  giphy!: GiphyFetch;

  constructor(@Inject(GIPHY_CONFIG) private config: GiphyConfig) { }

  init(): void {
    if (!this.giphy) {
      this.giphy = new GiphyFetch(this.config.token);
    }
  }

  getTrending(limit: number, type: 'stickers' | 'gifs'): Observable<IGif[]> {
    return from(
      this.giphy.trending({
        limit,
        type,
        rating: 'pg',
      })
    ).pipe(map(({ data }) => data));
  }

  getSearchGifs(data: { search: string; limit: number; type: 'stickers' | 'gifs' }): Observable<IGif[]> {
    return from(
      this.giphy.search(data.search, {
        sort: 'relevant',
        rating: 'pg',
        type: data.type,
        limit: data.limit,
      })
    ).pipe(map(({ data }) => data));
  }
}
