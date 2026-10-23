import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { catchError, Observable, of, shareReplay } from 'rxjs';
import { PageConfig } from './page.model';

export const COMMON_PAGES_ASSETS_PATH = 'assets/json-config/default/pages';
export const CMS_PAGES_ASSETS_PATH = 'assets/json-config/cms/pages';

// Le route presenti qui vengono caricate da cms/pages; tutte le altre usano default/pages.
const CMS_PAGE_IDS = new Set(['/']);

// Sceglie l'ID della configurazione da caricare per la route attiva.
// Scende lungo il ramo principale delle route e conserva l'ultimo pageConfigId trovato:
// le route figlie senza un ID proprio usano quello del genitore, mentre possono
// specificarne uno più preciso. Se nessuna route lo dichiara, usa fallbackId (l'URL).
// Per esempio, gli step di booking-a4h riusano la config del genitore; appointments
// dichiara un ID proprio perché è una pagina indipendente.
export function resolvePageConfigId(route: ActivatedRouteSnapshot, fallbackId: string): string {
  let current: ActivatedRouteSnapshot | undefined = route;
  let pageConfigId: string | undefined;

  while (current) {
    const configuredId = current.routeConfig?.data?.['pageConfigId'];
    if (typeof configuredId === 'string') {
      pageConfigId = configuredId;
    }

    current = current.children.find((child) => child.outlet === 'primary');
  }

  return pageConfigId ?? fallbackId;
}

// a differenza di AppConfig (nello store, letto ovunque), ogni pagina serve a un solo
// componente: qui basta una cache locale per-id, non serve passare dallo store globale.
@Injectable({ providedIn: 'root' })
export class PageConfigService {
  private http = inject(HttpClient);

  // cache in-memory: una pagina già richiesta non viene rifetchata finché dura la sessione
  private cache = new Map<string, Observable<PageConfig>>();

  get(id: string): Observable<PageConfig> {
    const basePath = CMS_PAGE_IDS.has(id) ? CMS_PAGES_ASSETS_PATH : COMMON_PAGES_ASSETS_PATH;
    const cacheKey = `${basePath}:${id}`;

    if (!this.cache.has(cacheKey)) {
      // '/' -> 'home', '/user-profile' -> 'user-profile', '/departments/units' -> 'departments-units'
      const path = id === '/' ? 'home' : id.replace(/^\//, '').replace(/\//g, '-');

      this.cache.set(
        cacheKey,
        this.http.get<PageConfig>(`${basePath}/${path}.json`).pipe(shareReplay(1)),
      );
    }
    return this.cache.get(cacheKey)!;
  }

  // per url di route non noti a priori (es. l'url corrente osservato in app.ts): un 404
  // o altro errore non deve interrompere il flusso, va trattato come "nessuna pagina qui"
  // o meglio quando non trova il .json della pagina
  getSafe(id: string): Observable<PageConfig | undefined> {
    return this.get(id).pipe(catchError(() => of(undefined)));
  }
}
