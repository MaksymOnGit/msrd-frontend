import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {filter, Observable, of, switchMap, tap} from 'rxjs';
import {AuthService} from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isAuthenticated.pipe(
      filter(isAuthenticated => isAuthenticated),
      switchMap(x => of(this.authService.roles.includes('Admin'))),
      tap(isAuthorized => isAuthorized || this.router.navigate(['/auth/access'], { queryParams: { returnUrl: state.url }})),
    );
  }

}
