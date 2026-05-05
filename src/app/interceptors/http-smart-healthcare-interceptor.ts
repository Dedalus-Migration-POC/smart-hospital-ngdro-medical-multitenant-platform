import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders,
  HttpXsrfTokenExtractor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { USER_SESSION_KEY } from '../../constants';

// BOOKING API AGRIGENTO
@Injectable()
export class HttpSmartHealthcareInterceptor implements HttpInterceptor {
  constructor(private xsrf: HttpXsrfTokenExtractor) {}

  private matchesSmartHealthcare(url: string): boolean {
    try {
      const u = new URL(url, window.location.origin);
      return u.pathname.includes('/smart-healthcare/healthcare/api/public/');
    } catch {
      return url.includes('/smart-healthcare/healthcare/api/public/');
    }
  }

  private getAccessToken(): string | null {
    const raw = localStorage.getItem(USER_SESSION_KEY);
    if (!raw) return null;
    try {
      const obj = JSON.parse(raw);
      return obj?.access_token ?? null;
    } catch {
      return null;
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.matchesSmartHealthcare(req.url)) {
      return next.handle(req);
    }

    let headers: HttpHeaders = req.headers;

    // Authorization
    const token = this.getAccessToken();
    if (token && !headers.has('Authorization')) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    // XSRF only on mutant methods (consistent with Angular default)
    const isMutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
    if (isMutating && !headers.has('X-XSRF-TOKEN')) {
      const xsrfToken = this.xsrf.getToken();
      if (xsrfToken) {
        headers = headers.set('X-XSRF-TOKEN', xsrfToken);
      }
    }

    const cloned = req.clone({
      headers,
      withCredentials: true,
    });

    return next.handle(cloned);
  }
}
