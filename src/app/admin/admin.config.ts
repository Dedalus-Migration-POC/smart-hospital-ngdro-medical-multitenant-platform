import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './admin.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { metaReducers, reducers } from './store/reducers';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideHttpClient } from '@angular/common/http';
import { provideDesignAngularKit } from 'design-angular-kit';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { normalizeAssetUrl } from '../shared/utility/asset-url.utils';

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
    provideTranslateService({
      fallbackLang: 'it',
      loader: provideTranslateHttpLoader({
        prefix: normalizeAssetUrl('assets/i18n/'),
        suffix: '.json',
      }),
    }),
  ],
};
