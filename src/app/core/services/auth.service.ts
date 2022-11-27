import { Injectable } from '@angular/core';
import {OAuthErrorEvent, OAuthService} from "angular-oauth2-oidc";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, combineLatest, filter, map, Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {Router} from "@angular/router";
import {AppConfigService} from "./app-config.service";
import {passwordFlowConfig} from "../config/auth.config";


export interface RegistrationRequest {
  InvitationToken: string,
  Email: string,
  Password: string,
  PasswordRepeat: string
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private urlBase?: string;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  private isDoneLoadingSubject = new BehaviorSubject<boolean>(false);
  public isDoneLoading = this.isDoneLoadingSubject.asObservable();

  public roles: string[] = [];
  public sub: string = "";

  constructor(private oAuthService: OAuthService, private httpClient: HttpClient, private router: Router, private config: AppConfigService)
  {
    if(!environment.production) {
      this.oAuthService.events.subscribe(event => {
        if (event instanceof OAuthErrorEvent) {
          console.error('OAuthErrorEvent Object:', event);
        } else {
          console.warn('OAuthEvent Object:', event);
        }
      });
    }

    this.urlBase = config.appSettings.apiRoot;
    if(!config.appSettings.withoutProxy)
      this.urlBase = this.urlBase + '/identity';
    this.oAuthService.configure({...passwordFlowConfig, requireHttps: false/*environment.production*/, issuer: config.appSettings.jwtIssuer})
    this.oAuthService.loadDiscoveryDocument().then(_ => this.isDoneLoadingSubject.next(true));

    this.oAuthService.events.subscribe(x => {
      if(x.type == "token_expires"){
        this.oAuthService.refreshToken().then(null, _ => this.isAuthenticatedSubject.next(false));
      }
    });

    window.addEventListener('storage', (event) => {
      if (event.key !== 'access_token' && event.key !== null) {
        return;
      }

      this.isAuthenticatedSubject.next(this.oAuthService.hasValidAccessToken());
      if (!this.oAuthService.hasValidAccessToken()) {
        this.navigateToLoginPage();
      }
    });

    this.oAuthService.events
      .pipe(filter(e => ['logout'].includes(e.type)))
      .subscribe(_ => {
        this.isAuthenticatedSubject.next(this.oAuthService.hasValidAccessToken());

        if (!this.oAuthService.hasValidAccessToken()) {
          this.navigateToLoginPage();
        }
      });

    this.oAuthService.events
      .pipe(filter(e => ['token_received'].includes(e.type)))
      .subscribe(_ => this.parseAccessToken());

    this.oAuthService.events
      .subscribe(_ => this.isAuthenticatedSubject.next(this.oAuthService.hasValidAccessToken()));

    this.parseAccessToken()
    this.isAuthenticatedSubject.next(this.oAuthService.hasValidAccessToken());

    //this.isAuthenticated.subscribe(x => {if(!x) this.navigateToLoginPage();});
  }

  public login(email: string, password: string) {
    return this.oAuthService.fetchTokenUsingPasswordFlow(email, password);
  }

  public registration(registrationRequest: RegistrationRequest): Observable<void> {
    return this.httpClient.post<void>(`${this.urlBase}/Account/Registration`, registrationRequest)
  }

  public logout(): void{
    this.oAuthService.logOut();
  }

  public canActivateProtectedRoutes: Observable<boolean> = combineLatest([
    this.isAuthenticated,
    this.isDoneLoading
  ]).pipe(map(values => values.every(x => x)));

  private navigateToLoginPage() {
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url }})
  }

  private parseAccessToken(): void {
    this.roles = [];
    this.sub = "";
    const accessToken = this.oAuthService.getAccessToken();
    if(!accessToken)
      return;

    const accessTokenParts: string[] = accessToken.split('.');
    if(accessTokenParts.length != 3)
      return;

    const body = JSON.parse(this.b64DecodeUnicode(accessTokenParts[1]));
    if(!body)
      return;

    if(!body.role) {
      return;
    }

    this.roles = [].concat(body.role);

    if(!body.sub) {
      return;
    }

    this.sub = body.sub;
  }

  public getAccessToken(): string {
    return this.oAuthService.getAccessToken();
  }

  private b64DecodeUnicode(str: string) {
    const base64 = str.replace(/\-/g, '+').replace(/\_/g, '/');

    return decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  }
}

export interface ErrorResponse{
  code: string,
  message: string
}

//Acknowledgements:
//Authorization guarding functionality done using the examples from the following repository:
//https://github.com/jeroenheijmans/sample-angular-oauth2-oidc-with-auth-guards
