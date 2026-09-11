import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, shareReplay } from 'rxjs';
import { PageConfig } from './page.model';

const PAGES_ASSETS_PATH = 'assets/json-config/pages';

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
      this.cache.set(
        id,
        this.http.get<PageConfig>(`${PAGES_ASSETS_PATH}/${path}.json`).pipe(shareReplay(1)),
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
