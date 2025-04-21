import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as AuthActions from './auth.actions';
import { AUTH_ENDPOINTS } from '../../constants/api-endpoint';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  // Handle login action
  loginAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginAction),
      mergeMap(({ user }) =>
        this.http.post<any>(AUTH_ENDPOINTS.LOGIN, user).pipe(
          map((response) => {
            this.cookieService.set('authToken', response.token);
            return AuthActions.loginSuccess({
              token: response.token,
              message: response.message,
            });
          }),
          catchError((error) => of(AuthActions.loginFailure({ error })))
        )
      )
    )
  );

  // Handle registration action
  registerAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerAction),
      mergeMap(({ user }) =>
        this.http.post<any>(AUTH_ENDPOINTS.REGISTER, user).pipe(
          map((response) => {
            this.cookieService.set('authToken', response.token);
            return AuthActions.registerSuccess({
              message: response.message,
            });
          }),
          catchError((error) => of(AuthActions.registerFailure({ error })))
        )
      )
    )
  );

  // Check auth on app refresh (get token from cookies)
  checkAuthFromCookie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkAuthFromCookie),
      map(() => {
        const token = this.cookieService.get('authToken');
        if (token) {
          return AuthActions.checkAuthSuccess({ token });
        }
        return AuthActions.logout(); // If no token, log out
      })
    )
  );
}
