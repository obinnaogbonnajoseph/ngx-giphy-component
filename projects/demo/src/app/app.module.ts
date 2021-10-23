import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxGiphyGridModule } from '@ngx-giphy-grid';
import { environment } from 'projects/demo/src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxGiphyGridModule.forRoot({
      token: environment.NG_GIPHY_TOKEN
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
