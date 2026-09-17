import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, shareReplay, switchMap, throwError } from 'rxjs';
import { PageConfig } from './page.model';

const COMMON_PAGES_ASSETS_PATH = 'assets/json-config/default/pages';
const CMS_PAGES_ASSETS_PATH = 'assets/json-config/cms/pages';

// a differenza di AppConfig (nello store, letto ovunque), ogni pagina serve a un solo
// componente: qui basta una cache locale per-id, non serve passare dallo store globale.
@Injectable({ providedIn: 'root' })
export class PageConfigService {
  private http = inject(HttpClient);

  // cache in-memory: una pagina già richiesta non viene rifetchata finché dura la sessione
  private cache = new Map<string, Observable<PageConfig>>();

  get(id: string): Observable<PageConfig> {
    if (!this.cache.has(id)) {
      // '/' -> 'home', '/user-profile' -> 'user-profile', '/departments/units' -> 'departments-units'
      const path = id === '/' ? 'home' : id.replace(/^\//, '').replace(/\//g, '-');

      const commonPage$ = this.http.get<PageConfig>(
        `${COMMON_PAGES_ASSETS_PATH}/${path}.json`,
      );
      const cmsPage$ = this.http
        .get<PageConfig>(`${CMS_PAGES_ASSETS_PATH}/${path}.json`)
        .pipe(
          catchError((error) =>
            error.status === 404 ? of(undefined) : throwError(() => error),
          ),
        );

      this.cache.set(
        id,
        cmsPage$.pipe(
          // Un file CMS sostituisce interamente la configurazione comune della pagina.
          // Se manca, la pagina comune resta il fallback.
          switchMap((cmsPage) => (cmsPage ? of(cmsPage) : commonPage$)),
          shareReplay(1),
        ),
      );
    }
    return this.cache.get(id)!;
  }

  // per url di route non noti a priori (es. l'url corrente osservato in app.ts): un 404
  // o altro errore non deve interrompere il flusso, va trattato come "nessuna pagina qui"
  // o meglio quando non trova il .json della pagina
  getSafe(id: string): Observable<PageConfig | undefined> {
    return this.get(id).pipe(catchError(() => of(undefined)));
  }
}
