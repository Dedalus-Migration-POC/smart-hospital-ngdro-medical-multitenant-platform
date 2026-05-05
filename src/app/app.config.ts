import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { metaReducers, reducers } from './store/reducers';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideDesignAngularKit } from 'design-angular-kit';
import { provideInitializeApp } from './initialize/providers/initialize-app.provider';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { effects } from './store/effects';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { BaseUrlInterceptor } from './interceptors/baseurl-interceptor';
import { ErrorInterceptor } from './interceptors/error-interceptor';
import { HttpHeadersInterceptor } from './interceptors/http-headers-interceptor';
import { HttpRefreshTokenInterceptor } from './interceptors/http-refresh-token-interceptor';
import { HttpSmartHealthcareInterceptor } from './interceptors/http-smart-healthcare-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore(reducers, { metaReducers }),
    provideEffects(effects),
    provideStoreDevtools({
      maxAge: 25,
    }),
    provideDesignAngularKit(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpRefreshTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpHeadersInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpSmartHealthcareInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    provideInitializeApp(),
    provideTranslateService({
      fallbackLang: 'it',
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
      }),
    }),
  ],
};
