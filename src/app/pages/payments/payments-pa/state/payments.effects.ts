import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as PaymentActions from './payments.actions';
import { PaymentService } from './payments.service';
import { Store } from '@ngrx/store';
import { ItNotificationService, NotificationPosition } from 'design-angular-kit';
import { TranslateService } from '@ngx-translate/core';
import { SmartHospitalState } from 'src/app/store/reducers';
import { DownloadUtils } from 'src/utils/download-utils';

@Injectable()
export class PaymentsEffects {
  private actions$ = inject(Actions);
  private paymentService: PaymentService = inject(PaymentService);
  private store: Store<SmartHospitalState> = inject(Store);
  private readonly notificationService: ItNotificationService = inject(ItNotificationService);
  private translate: TranslateService = inject(TranslateService);

  fetchPayments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentActions.fetchPayments),
      concatMap(() =>
        this.paymentService.fetchPayments().pipe(
          map((data) => {
            return PaymentActions.fetchPaymentsSuccess({ data });
          }),
          catchError((error) => of(PaymentActions.fetchPaymentsFailure({ error }))),
        ),
      ),
    );
  });

  fetchPaymentSummary$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentActions.fetchPaymentSummary),
      concatMap((action) =>
        this.paymentService.fetchPaymentSummary(action.bookingId).pipe(
          map((data) => PaymentActions.fetchPaymentSummarySuccess({ data })),
          catchError((error) =>
            of(
              PaymentActions.fetchPaymentSummaryFailure({
                error,
              }),
            ),
          ),
        ),
      ),
    );
  });

  downloadInvoicePdf$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentActions.downloadInvoicePdf),
      concatMap((action) =>
        this.paymentService.downloadInvoicePdf(action.admissionsId).pipe(
          map((data) => {
            const hasBody =
              typeof data === 'object' &&
              data !== null &&
              'body' in data &&
              typeof data.body === 'object' &&
              data.body !== null;

            const body = hasBody
              ? (data.body as {
                  mimeType?: string;
                  fileName?: string;
                  content?: string | ArrayBuffer;
                })
              : undefined;

            const mimeType = body?.mimeType || 'application/pdf';
            const fileName = body?.fileName || 'payment-' + action.admissionsId;
            const content = body?.content ?? data;

            if (typeof content === 'string' || content instanceof ArrayBuffer) {
              DownloadUtils.download(mimeType, content, fileName);
            }
            return PaymentActions.downloadInvoicePdfSuccess();
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );

            return of(
              PaymentActions.downloadInvoicePdfFailure({
                error,
              }),
            );
          }),
        ),
      ),
    );
  });

  getPagoPaLink$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentActions.getPagoPaLink),
      concatMap((action) =>
        this.paymentService.getPagoPaLink(action.payment).pipe(
          map((data) => {
            window.open(data.redirectUrl, '_blank');
            return PaymentActions.getPagoPaLinkSuccess({ data });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );
            return of(PaymentActions.getPagoPaLinkFailure({ error }));
          }),
        ),
      ),
    );
  });

  constructor() {}
}
