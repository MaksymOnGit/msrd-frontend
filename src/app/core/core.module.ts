import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';
import { OAuthModule, OAuthStorage} from 'angular-oauth2-oidc';
import {routes} from "./config/route.config";


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    HttpClientModule,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: ["http://localhost"],
        sendAccessToken: true
      }
    })
  ],
  providers: [
    { provide: OAuthStorage, useFactory: () => localStorage },
  ],
  exports: [RouterModule]
})
export class CoreModule { }

