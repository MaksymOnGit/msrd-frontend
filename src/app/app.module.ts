import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CoreModule } from "./core/core.module";

import { AppComponent } from './app.component';
import { AppLayoutModule } from "./layout/app.layout.module";
import {NotfoundComponent} from "./notfound/notfound.component";
import {AppConfigService} from "./core/services/app-config.service";

@NgModule({
  declarations: [
    AppComponent,
    NotfoundComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AppLayoutModule,
  ],
  providers: [
    AppConfigService,
    { provide: APP_INITIALIZER, useFactory: initConfig, deps: [AppConfigService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

function initConfig(config: AppConfigService){
  return () => config.init();
}
