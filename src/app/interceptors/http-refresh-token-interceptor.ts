import { Injectable } from '@angular/core';
import { EMPTY, Observable, Subject, throwError } from 'rxjs';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpEvent,
  HttpResponse,
  HttpXsrfTokenExtractor,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SmartHospitalState } from '../store/reducers';
import { sessionExpired, sessionRefreshed } from '../pages/user-profile/state/user-profile.actions';
import { USER_SESSION_KEY } from '../../constants';

const SKIP_REFRESH_ROUTES = ['/auth/mobile', '/idp-redirect'];
const TOKEN_SOURCES = ['/oauth/api/wrapper/login', '/oauth/refresh'];

@Injectable({ providedIn: 'root' })
export class HttpRefreshTokenInterceptor implements HttpInterceptor {
  refreshTokenInProgress = false;

  tokenRefreshedSource = new Subject();

  constructor(
    private router: Router,
    private store: Store<SmartHospitalState>,
    private tokenExtractor: HttpXsrfTokenExtractor,
  ) {}

  shouldSkipReset() {
    const url = window.location.pathname.startsWith('/ui')
      ? window.location.pathname.substring(3, window.location.pathname.length)
      : window.location.pathname;
    return SKIP_REFRESH_ROUTES.some((skipRefreshRoute) => url.startsWith(skipRefreshRoute));
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const skipRefresh = this.shouldSkipReset();
    if (!skipRefresh && this.tokenWillExpireSoon()) {
      if (!this.refreshTokenInProgress) {
        this.refreshTokenInProgress = true;
        next
          .handle(this.getRefreshTokenHttpRequest())
          .pipe(
            tap((event) => {
              this.store.dispatch(sessionRefreshed());
              this.handleStorageTokenExpireTimes(event);
              this.tokenRefreshedSource.next(event);
            }),
            catchError((err) => {
              this.handleExpiredAuthentication(err);
              this.tokenRefreshedSource.next(null);
              return throwError(() => err);
            }),
          )
          .subscribe();
      }

      return new Observable((observer) => {
        let tokenRefreshed$ = this.tokenRefreshedSource.asObservable().subscribe(() => {
          let headers = request.headers;
          const xsrfToken = this.tokenExtractor.getToken();
          if (xsrfToken) headers = headers.set('X-XSRF-TOKEN', xsrfToken);
          next
            .handle(request.clone({ headers }))
            .pipe(
              catchError((error) => {
                this.handleExpiredAuthentication(error);
                this.refreshTokenInProgress = false;
                observer.error(error);
                observer.complete();
                observer.unsubscribe();
                tokenRefreshed$.unsubscribe();
                return EMPTY;
              }),
            )
            .subscribe((event) => {
              if (event instanceof HttpResponse) {
                this.refreshTokenInProgress = false;
                this.handleStorageTokenExpireTimes(event);
                observer.next(event);
                observer.complete();
                observer.unsubscribe();
                tokenRefreshed$.unsubscribe();
              }
            });
        });
      });
    } else {
      return next.handle(request).pipe(
        tap((event) => {
          this.handleStorageTokenExpireTimes(event);
        }),
      );
    }
  }

  private clear() {
    this.store.dispatch(sessionExpired());
  }

  private clearAndReauthenticate() {
    localStorage.removeItem(USER_SESSION_KEY);
    this.clear();
    this.router.navigate(['/auth'], {
      queryParams: { returnUrl: this.router.url },
    });
  }

  private handleExpiredAuthentication(event: HttpEvent<any>) {
    if (event instanceof HttpErrorResponse) {
      if (event && event.status === 401) {
        this.clearAndReauthenticate();
      }
    }
    return event;
  }

  tokenWillExpireSoon() {
    const token = localStorage.getItem(USER_SESSION_KEY);
    if (token) {
      const tokenObj = JSON.parse(token);
      const now = Date.now();
      const remainingAccessToken = Math.round((tokenObj.accessTokenExpiration - now) / 1000);
      const remainingRefreshToken = Math.round((tokenObj.refreshTokenExpiration - now) / 1000);

      if (remainingAccessToken < 100) {
        // se sta per scadere l'accessToken oppure se è scaduto ma non è scaduto il refresh
        if (remainingRefreshToken <= 0) {
          this.clearAndReauthenticate();
          return false;
        }
        return true;
      }
    }
    return false;
  }

  private handleStorageTokenExpireTimes(event: HttpEvent<any>) {
    if (event instanceof HttpResponse) {
      if (
        event.url &&
        TOKEN_SOURCES.find((e) => event.url?.endsWith(e)) &&
        event.body?.expires_in
      ) {
        const data = {
          accessTokenExpiration: Date.now() + event.body.expires_in * 1000,
          refreshTokenExpiration: Date.now() + event.body.expires_in * 2 * 1000,
          access_token: event.body.access_token,
        };
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(data));
        return event;
      }
      if (event.url && event.url.endsWith('/oauth/logout')) {
        localStorage.removeItem(USER_SESSION_KEY);
        return event;
      }
    }
    return;
  }

  getRefreshTokenHttpRequest() {
    let headers = new HttpHeaders();
    const token = this.tokenExtractor.getToken() as string;
    const headerName = 'X-XSRF-TOKEN';
    if (token) {
      headers = headers.set(headerName, token);
    }
    return new HttpRequest('POST', window.location.origin + '/oauth/refresh', null, {
      headers: headers,
      withCredentials: true,
    });
  }
}
