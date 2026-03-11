import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './admin.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { metaReducers, reducers } from './store/reducers';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideHttpClient } from '@angular/common/http';
import { provideDesignAngularKit } from 'design-angular-kit';

export const appAdminConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore(reducers, { metaReducers }),
    provideEffects([]),
    provideStoreDevtools({
      maxAge: 25,
    }),
    provideDesignAngularKit(),
    provideHttpClient(),
  ],
};
