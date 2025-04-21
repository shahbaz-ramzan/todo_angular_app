// auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
  token: string | null;
  message: string | null;
  error: any;
  isAuthenticated: boolean;
}

export const initialState: AuthState = {
  token: null,
  message: null,
  error: null,
  isAuthenticated: false,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state, { token, message }) => ({
    ...state,
    token,
    message,
    error: null,
    isAuthenticated: true,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    token: null,
    message: null,
    isAuthenticated: false,
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    token: null,
    message: null,
    error: null,
    isAuthenticated: false,
  }))
);
