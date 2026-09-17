import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, Observable, of, shareReplay, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { HeaderConfig } from '../../../layout/header/header.model';
import { FooterConfig } from '../../../layout/footer/footer.model';
import { AppConfig, CookieConsentConfig, FirebaseConfig } from '../app-config.model';

const COMMON_CONFIG_ASSETS_PATH = 'assets/json-config/default/config';
const CMS_CONFIG_ASSETS_PATH = 'assets/json-config/cms/config';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private http = inject(HttpClient);

  // cache: chiamate ripetute a loadAppConfig() non rifanno le 8 fetch, riusano lo stesso risultato
  private appConfig$?: Observable<AppConfig>;

  // ogni sezione dell'AppConfig arriva da un json separato, caricabile/gestibile in modo indipendente
  // theme, header e footer sono esempi di sezioni caricate da json separati per altri temi
  // per far caricare dal percorso comune (assets/json-config/default/config)
  // bisogna togliere il secondo parametro (CMS_CONFIG_ASSETS_PATH)
  private load<T>(name: string, basePath = COMMON_CONFIG_ASSETS_PATH): Observable<T> {
    return this.http.get<T>(`${basePath}/${name}.json`);
  }

  // Un json opzionale mancante (404) indica che la feature non è configurata.
  private loadOptional<T>(
    name: string,
    basePath = COMMON_CONFIG_ASSETS_PATH,
  ): Observable<T | undefined> {
    return this.load<T>(name, basePath).pipe(
      catchError((err) => (err.status === 404 ? of(undefined) : throwError(() => err))),
    );
  }

  loadAppConfig(): Observable<AppConfig> {
    if (!this.appConfig$) {
      this.appConfig$ = forkJoin({
        appMeta: this.load<Pick<AppConfig, 'name' | 'favicon'>>('app-meta'),
        theme: this.load<AppConfig['theme']>('theme', CMS_CONFIG_ASSETS_PATH),
        translate: this.load<AppConfig['translate']>('i18n-config'),
        header: this.load<HeaderConfig>('header', CMS_CONFIG_ASSETS_PATH),
        footer: this.load<FooterConfig>('footer', CMS_CONFIG_ASSETS_PATH),
        firebaseConfig: this.loadOptional<FirebaseConfig>('firebase'),
        chatbot: this.loadOptional<AppConfig['chatbot']>('chatbot', CMS_CONFIG_ASSETS_PATH),
        cookieConsentConfig: this.loadOptional<CookieConsentConfig>(
          'cookie-consent',
          CMS_CONFIG_ASSETS_PATH,
        ),
      }).pipe(
        map(({ appMeta, cookieConsentConfig, ...rest }) => ({
          ...appMeta,
          ...rest,
          cookieConsentConfig: cookieConsentConfig && {
            ...cookieConsentConfig,
            cookie: { ...cookieConsentConfig.cookie, domain: window.location.hostname },
          },
        })),
        shareReplay(1),
      );
    }
    return this.appConfig$;
  }
}
