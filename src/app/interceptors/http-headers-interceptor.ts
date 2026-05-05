import { Injectable } from '@angular/core';
import { delay, Observable, of, switchMap, timer } from 'rxjs';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpEvent,
  HttpXsrfTokenExtractor,
} from '@angular/common/http';
import { USER_SESSION_KEY } from '../../constants';
import { LanguageService } from '../initialize/state/services/language.service';

@Injectable()
export class HttpHeadersInterceptor implements HttpInterceptor {
  constructor(
    private tokenExtractor: HttpXsrfTokenExtractor,
    private languageService: LanguageService,
  ) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headerName = 'X-XSRF-TOKEN';
    const token = this.tokenExtractor.getToken() as string;

    req = req.clone({
      headers: req.headers.set('Accept-Language', this.languageService.currentLanguage.localeId),
    });

    if (token !== null && !req.headers.has(headerName)) {
      req = req.clone({
        headers: req.headers.set(headerName, token),
      });
    }

    if (
      req.url.includes('checkin') ||
      req.url.includes('vaccine-booking') ||
      req.url.includes('health-repository') ||
      req.url.includes('smart-healthcare') ||
      req.url.includes('sh-jcash-integration') ||
      req.url.includes('simple-pagopa')
    ) {
      //delay di chiamate per avere il tempo per prendere token da localStorage
      setTimeout(() => {
        const get_token = localStorage.getItem(USER_SESSION_KEY);
        if (get_token !== null) {
          const tokenObj = JSON.parse(get_token);
          req = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${tokenObj.access_token}`),
          });
        }
      }, 300);

      return timer(500).pipe(switchMap(() => next.handle(req)));
    }

    return next.handle(req);
  }
}
