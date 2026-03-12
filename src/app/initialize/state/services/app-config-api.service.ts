import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AppConfig } from '../app-config.model';
import { APP_CONFIG } from '../mock';

@Injectable({ providedIn: 'root' })
export class AppConfigApiService {
  private http = inject(HttpClient);

  private readonly IS_DEV = true;

  loadAppConfig(): Observable<AppConfig> {
    const path = 'fetch/app-config';

    if (this.IS_DEV) {
      return of(APP_CONFIG as AppConfig).pipe(delay(300));
    }

    return this.http.get<AppConfig>(path);
  }
}
