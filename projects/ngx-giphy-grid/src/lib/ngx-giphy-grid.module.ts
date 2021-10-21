import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { NgxGiphyGridComponent } from './ngx-giphy-grid.component';
import { NgxIntersectObserverModule } from 'ngx-intersect-observer';
import { NgxGiphyGridService } from 'projects/ngx-giphy-grid/src/public-api';

export interface GiphyConfig {
  token: string;
}

export const GIPHY_CONFIG = new InjectionToken<GiphyConfig>('GIPHY_CONFIG');



@NgModule({
  declarations: [
    NgxGiphyGridComponent
  ],
  imports: [
    NgxIntersectObserverModule
  ],
  providers: [
    NgxGiphyGridService
  ],
  exports: [
    NgxGiphyGridComponent
  ]
})
export class NgxGiphyGridModule {
  static forRoot(config: GiphyConfig): ModuleWithProviders<NgxGiphyGridModule> {
    return {
      ngModule: NgxGiphyGridModule,
      providers: [
        { provide: GIPHY_CONFIG, useValue: config }
      ]
    }
  }
}
