import { createAction , props } from "@ngrx/store";

export const loginAction = createAction('[Auth] Login', props<{ user: any }>());

export const loginSuccess = createAction(
    '[Auth] Login Success',
    props<{ token: string; message: string }>()
  );
  

export const loginFailure = createAction(
    '[Auth] Login Failure',
    props<{ error: any }>()
);

export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction(
  '[Auth] Logout Success',
  props<{ message: string }>()
);

export const registerAction = createAction(
  '[Auth] Register',
  props<{ user: any }>()
);  

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ message: string }>()
);          

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: any }>()
);  

// auth.actions.ts
export const checkAuthFromCookie = createAction('[Auth] Check Auth From Cookie');
export const checkAuthSuccess = createAction(
  '[Auth] Check Auth Success',
  props<{ token: string }>()
);