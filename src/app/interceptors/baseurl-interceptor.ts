import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_HREF } from '../../constants';

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  constructor(@Inject(API_BASE_HREF) private baseUrl: string) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = [
      request.url.startsWith('http') ? '' : this.baseUrl,
      request.url.startsWith('http') || request.url.startsWith('/') ? '' : '/',
      request.url,
    ].join('');
    return next.handle(request.clone({ url }));
  }
}
