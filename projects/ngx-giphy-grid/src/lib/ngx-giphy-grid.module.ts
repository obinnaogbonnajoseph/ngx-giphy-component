import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgxGiphyGridComponent } from './ngx-giphy-grid.component';
import { NgxIntersectObserverModule } from 'ngx-intersect-observer';
import { NgxGiphyGridService } from './ngx-giphy-grid.service';
import { GIPHY_CONFIG, GiphyConfig } from './constants';

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
