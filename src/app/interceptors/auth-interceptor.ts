import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Store } from '@ngrx/store'
import { SmartHospitalState } from '../store/reducers'
import {
  fetchUserProfile,
  sessionExpired,
} from '../pages/user-profile/state/user-profile.actions'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(protected store: Store<SmartHospitalState>) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event?.url?.endsWith('/oauth/api/wrapper/login')) {
            this.store.dispatch(fetchUserProfile())
          }
          if (event?.url?.endsWith('/oauth/logout') || event?.status === 401) {
            this.store.dispatch(sessionExpired())
          }
        }
        return event
      }),
    )
  }
}
