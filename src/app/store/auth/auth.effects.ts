import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { HttpClient } from "@angular/common/http";
import { catchError, map, mergeMap,of } from "rxjs";
import * as AuthActions from './auth.actions';
import { AUTH_ENDPOINTS } from "../../constants/api-endpoint";
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private cookieService: CookieService
      ) {}
      
      loginAction$ = createEffect(() =>
        this.actions$.pipe(
          ofType(AuthActions.loginAction),
          mergeMap(({ user }) =>
            this.http.post<any>(AUTH_ENDPOINTS.LOGIN, user).pipe(
              map((response) => {
                this.cookieService.set('authToken', response.token); // Store token in cookie
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
      
}