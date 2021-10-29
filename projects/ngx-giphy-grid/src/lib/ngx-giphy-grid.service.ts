import { Inject, Injectable } from '@angular/core';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';
import { GiphyConfig, GIPHY_CONFIG } from './constants';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class NgxGiphyGridService {

  giphy!: GiphyFetch;

  constructor(@Inject(GIPHY_CONFIG) private config: GiphyConfig) { }

  init(): void {
    if (!this.giphy) {
      this.giphy = new GiphyFetch(this.config.token);
    }
  }

  getTrending(limit: number, type: 'stickers' | 'gifs', offset = 0): Observable<IGif[]> {
    return from(
      this.giphy.trending({
        limit,
        type,
        rating: 'pg',
        offset
      })
    ).pipe(map(({ data }) => data));
  }

  getSearchGifs(data: { search: string; limit: number; type: 'stickers' | 'gifs'; offset?: number }): Observable<IGif[]> {
    data = {
      ...data,
      offset: data?.offset ?? 0
    }
    return from(
      this.giphy.search(data.search, {
        sort: 'relevant',
        rating: 'pg',
        type: data.type,
        limit: data.limit,
        offset: data.offset
      })
    ).pipe(map(({ data }) => data));
  }
}
