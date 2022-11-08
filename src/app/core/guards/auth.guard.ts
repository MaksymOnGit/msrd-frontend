import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {filter, Observable, switchMap, tap} from 'rxjs';
import {AuthService} from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.isDoneLoading.pipe(
      filter(isDone => isDone),
      switchMap(_ => this.authService.isAuthenticated),
      tap(isAuthenticated => isAuthenticated || this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }})),
    );
  }

}
