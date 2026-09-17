import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { ItNotificationService, NotificationPosition } from 'design-angular-kit';
import { ConsentsA4HService } from './service';
import { SmartHospitalState } from 'src/app/store/reducers';
import * as ConsentsA4HActions from './actions';

@Injectable()
export class ConsentsA4HEffects {
  private actions$ = inject(Actions);
  private consentsA4HService = inject(ConsentsA4HService);
  private store = inject(Store<SmartHospitalState>);
  private readonly notificationService = inject(ItNotificationService);
  private readonly translate = inject(TranslateService);

  //------- consents A4H-------------
  fetchUserA4hPrivacyConsents$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ConsentsA4HActions.fetchUserA4hPrivacyConsent),
      concatMap((action) =>
        this.consentsA4HService.fetchUserA4hPrivacyConsent(action.payload).pipe(
          map((response) => {
            return ConsentsA4HActions.fetchUserA4hPrivacyConsentSuccess({ data: response });
          }),
          catchError((error) =>
            of(ConsentsA4HActions.fetchUserA4hPrivacyConsentFailure({ error })),
          ),
        ),
      ),
    );
  });

  updateUserA4hPrivacyConsent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ConsentsA4HActions.updateUserA4hPrivacyConsent),
      concatMap((action) =>
        this.consentsA4HService.updateUserA4hPrivacyConsent(action.payload).pipe(
          map((response) => {
            return ConsentsA4HActions.updateUserA4hPrivacyConsentSuccess({ data: response });
          }),
          catchError((error) =>
            of(ConsentsA4HActions.updateUserA4hPrivacyConsentFailure({ error })),
          ),
        ),
      ),
    );
  });

  fetchConsentsA4H$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ConsentsA4HActions.fetchConsentsA4h),
      concatMap(() =>
        this.consentsA4HService.fetchConsentsA4H().pipe(
          map((response) => {
            return ConsentsA4HActions.fetchConsentsA4hSuccess({ data: response });
          }),
          catchError((error) => of(ConsentsA4HActions.fetchConsentsA4hFailure({ error }))),
        ),
      ),
    );
  });

  updateConsentA4h$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ConsentsA4HActions.updateConsentA4h),
      concatMap((action) =>
        this.consentsA4HService.updateConsentsA4h(action.payload).pipe(
          map((data) => {
            this.notificationService.success(
              this.translate.instant(`consents-a4h.update-consent-success-title`),
              this.translate.instant(`consents-a4h.update-consent-success-text`),
              true,
              4000,
              NotificationPosition.Top,
            );

            return ConsentsA4HActions.updateConsentA4hSuccess({ data });
          }),
          catchError((err) => {
            this.notificationService.error(
              this.translate.instant(`consents-a4h.update-consent-error-title`),
              this.translate.instant(`consents-a4h.update-consent-error-text`),
              true,
              4000,
              NotificationPosition.Top,
            );

            return of(ConsentsA4HActions.updateConsentA4hFailure({ error: err }));
          }),
        ),
      ),
    );
  });
}
