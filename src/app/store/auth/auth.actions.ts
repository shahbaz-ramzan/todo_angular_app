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