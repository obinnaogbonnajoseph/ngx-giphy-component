import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxGiphyGridModule } from '@ngx-giphy-grid';

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
      token: 'Hello World'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
