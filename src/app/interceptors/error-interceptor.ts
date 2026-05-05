import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { SmartHospitalState } from '../store/reducers';
import { Router } from '@angular/router';
import { sessionExpired } from '../pages/user-profile/state/user-profile.actions';
import { USER_SESSION_KEY } from '../../constants';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    protected store: Store<SmartHospitalState>,
    private router: Router,
  ) {}
  private clear() {
    this.store.dispatch(sessionExpired());
  }
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          localStorage.removeItem(USER_SESSION_KEY);
          this.clear();
          this.router.navigate(['/auth'], {
            queryParams: { returnUrl: this.router.url },
          });
        }
        return throwError(() => error);
      }),
    );
  }
}
