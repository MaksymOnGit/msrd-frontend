import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map, Observable, of, switchMap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  appSettings: AppSettings = {}

  constructor(private httpClient: HttpClient) {
  }

  public init(): Observable<void> {
    return new Observable<void>((subscriber) => {
      this.httpClient.get<AppSettings>('../../../assets/appSettings.json').pipe(
        switchMap((appSettings: AppSettings) => {
          if (!environment.production) {
            return this.httpClient.get<AppSettings>('../../../assets/appSettings.development.json').pipe(
              map(appSettingsDev => {
                return {...appSettings, ...appSettingsDev};
              })
            );
          }
          return of(appSettings);
        }))
        .subscribe({
          next: appSettings => {
            this.appSettings = appSettings;
            subscriber.complete();
          },
          error: (err: HttpErrorResponse) => {
            console.error(`Unable to load configuration. Error code: ${err.status}`);
          }
        });
    });
  }
}

export interface AppSettings {
  apiRoot?: string,
  jwtIssuer?: string,
  withoutProxy?: boolean
}
