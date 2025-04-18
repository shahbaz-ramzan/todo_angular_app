// auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
  token: string | null;
  message: string | null;
  error: any;
}

export const initialState: AuthState = {
  token: null,
  message: null,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state, { token, message }:any) => ({
    ...state,
    token,
    message,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    token: null,
    message: null,
  }))
);
