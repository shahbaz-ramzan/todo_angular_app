import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideAnimations,
  provideNoopAnimations,
} from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideStore } from '@ngrx/store';
import { TasksEffects } from './store/tasks/tasks.effects';
import { tasksReducer } from './store/tasks/tasks.reducer'; // ✅ import reducer
import { AuthEffects } from './store/auth/auth.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideEffects([TasksEffects,AuthEffects]),
    provideStoreDevtools(),
    provideStore({ tasks: tasksReducer }), // ✅ add reducer
    provideHttpClient(),
  ],
};
