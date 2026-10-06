import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, exhaustMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ItNotificationService, NotificationPosition } from 'design-angular-kit';
import * as CredentialsActions from './credentials.actions';
import { CredentialsService } from './credentials.service';
import { CredentialsRegistrationError } from './credentials.model';

@Injectable()
export class CredentialsEffects {
  private actions$ = inject(Actions);
  private credentialsService = inject(CredentialsService);
  private readonly notificationService = inject(ItNotificationService);
  private readonly translate = inject(TranslateService);

  fetchRegistrationAttributes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CredentialsActions.fetchRegistrationAttributes),
      concatMap(() =>
        this.credentialsService.fetchRegistrationAttributes().pipe(
          map((data) => CredentialsActions.fetchRegistrationAttributesSuccess({ data })),
          catchError((error: unknown) =>
            of(CredentialsActions.fetchRegistrationAttributesFailure({ error })),
          ),
        ),
      ),
    );
  });

  fetchRegistrationConsents$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CredentialsActions.fetchRegistrationConsents),
      concatMap(() =>
        this.credentialsService.fetchRegistrationConsents().pipe(
          map((data) => CredentialsActions.fetchRegistrationConsentsSuccess({ data })),
          catchError((error: unknown) =>
            of(CredentialsActions.fetchRegistrationConsentsFailure({ error })),
          ),
        ),
      ),
    );
  });

  register$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CredentialsActions.register),
      exhaustMap((action) =>
        this.credentialsService.register(action.data).pipe(
          map(() => CredentialsActions.registerSuccess()),
          catchError((error: unknown) => {
            const registrationError = this.registrationError(error);
            this.notifyRegistrationError(registrationError);
            return of(CredentialsActions.registerFailure({ error: registrationError }));
          }),
        ),
      ),
    );
  });

  private notifyRegistrationError(error: CredentialsRegistrationError): void {
    let messageKey = 'generic';
    switch (error.errorCode) {
      case '409':
        messageKey = 'conflict';
        break;
      case '403':
        messageKey = 'verificationEmail';
        break;
      case '400':
        if (error.errorMessage === 'All required fields have to be filled in') {
          messageKey = 'requiredFields';
        } else if (error.errorMessage === 'Not all required consents are signed') {
          messageKey = 'requiredConsents';
        } else if (error.errorMessage === 'Attribute is not valid') {
          messageKey = 'invalidAttribute';
        }
        break;
    }

    const message = this.translate.instant(`credentials-registration.errors.${messageKey}`);
    this.notificationService.error(
      this.translate.instant('commons.error'),
      message + (error.description ? ` (${error.description})` : ''),
      true,
      8000,
      NotificationPosition.Top,
    );
  }

  private registrationError(error: unknown): CredentialsRegistrationError {
    const status = error instanceof HttpErrorResponse ? error.status : 0;
    const body: unknown = error instanceof HttpErrorResponse ? error.error : null;
    const details: Record<string, unknown> =
      body !== null && typeof body === 'object' ? (body as Record<string, unknown>) : {};

    return {
      status,
      errorCode: typeof details['errorCode'] === 'string' ? details['errorCode'] : String(status),
      errorMessage:
        typeof details['errorMessage'] === 'string'
          ? details['errorMessage']
          : error instanceof Error
            ? error.message
            : 'Registration failed',
      correlationId:
        typeof details['correlationId'] === 'string' ? details['correlationId'] : undefined,
      datetime: typeof details['datetime'] === 'string' ? details['datetime'] : undefined,
      description: typeof details['description'] === 'string' ? details['description'] : undefined,
    };
  }
}
