import { HttpClient, HttpParams } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { delay, Observable, of } from 'rxjs'
import { APP_CONFIG } from './mock'


@Injectable({ providedIn: 'root' })
export class InitializeAppService {
    private readonly IS_DEV = true
    private http = inject(HttpClient);

    constructor() { }

    fetchAppConfig(): Observable<any> {
        const path = `fetch/app-config`

        if (this.IS_DEV) {
            console.log(path, 'get')
            return of(APP_CONFIG).pipe(delay(500))
        }
        return this.http.get<any>(path)
    }

}
