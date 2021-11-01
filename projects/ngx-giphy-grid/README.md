# Angular library that returns Giphy's GIF or stickers when you search for them

## Description

You can get loads of gifs or stickers from the Giphy API when you search for them using this angular component.

## Demo

@see [DEMO HERRE](https://obinnaogbonnajoseph.github.io/ngx-giphy-component/)

## Getting started

```bash

  npm install --save ngx-giphy-grid

```

## Setup

```TypeScript

import { NgxGiphyGridModule } from 'ngx-giphy-grid';
@NgModule({
  ...
  imports: [
    ...
    NgxGiphyGridModule.forRoot({
      token: environment.NG_APP_GIPHY_TOKEN
    })
  ]
})
export class AppModule {}

```

## Using the component

```html
<ngx-giphy-grid
  class="w-full flex-1 overflow-y-scroll"
  (gifs)="setGifs($event)"
  [searchObj]="searchObj"
  (loading)="setLoading($event)"
  [mode]="mode"
  [className]="'flex-1 mb-8 flex flex-row flex-wrap gap-1 justify-around w-full'"
>
  <picture
    class="cursor-pointer"
    (click)="selectGif(gif, i)"
    *ngFor="let gif of gifs; index as i"
  >
    <source type="image/webp" [srcset]="gif.webp" />
    <img
      style="border: 1px solid #7c7c7c; width: 100px !important; height: 100px !important;"
      [alt]="gif.altText"
      class="rounded-8"
      [src]="getUrl(gif.url)"
    />
  </picture>
</ngx-giphy-grid>
```

| @Input           | Type                                 | Default value    | Description                                                                                                                          |
| ---------------- | ------------------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **mode**         | 'stickers' or 'gifs'                 | 'gifs'           | search results to be stickers or gifs                                                                                                |
| **className**    | string                               | ''               | Style the parent element of list of gifs or stickers                                                                                 |
| **searchObject** | {searchText: string; reset: boolean} | {threshold: 0.5} | contains the search string and an extra property to determine if search results should be cleared and populated by new search or not |

## Issues and Pull Requests

Please file issues and open pull requests [here](https://github.com/obinnaogbonnajoseph/ngx-giphy-component/issues). Thank you.

## Licence

MIT
