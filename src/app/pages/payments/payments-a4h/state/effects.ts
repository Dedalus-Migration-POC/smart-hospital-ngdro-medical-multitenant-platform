import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ItNotificationService, NotificationPosition } from 'design-angular-kit';
import * as PaymentsActions from './actions';
import { PaymentsA4hService } from './service';

@Injectable()
export class PaymentsA4hEffects {
  private actions$ = inject(Actions);
  private paymentsService = inject(PaymentsA4hService);
  private translate = inject(TranslateService);
  private notificationService = inject(ItNotificationService);

  private notifyError(messageKey: string): void {
    this.notificationService.error(
      this.translate.instant('commons.error'),
      this.translate.instant(messageKey),
      true,
      4000,
      NotificationPosition.Top,
    );
  }

  fetchPayments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentsActions.fetchPaymentList),
      concatMap(() =>
        this.paymentsService.fetchPaymentList().pipe(
          map((payments) => PaymentsActions.fetchPaymentListSuccess({ payments })),
          catchError((error) => {
            this.notifyError('payments-a4h.error.list-payment');
            return of(PaymentsActions.fetchPaymentListFailure({ error }));
          }),
        ),
      ),
    );
  });

  fetchPendingPayments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentsActions.fetchPendingPaymentList),
      concatMap(() =>
        this.paymentsService.fetchPendingPaymentList().pipe(
          map((payments) => PaymentsActions.fetchPendingPaymentListSuccess({ payments })),
          catchError((error) => {
            this.notifyError('payments-a4h.error.list-pending-payment');
            return of(PaymentsActions.fetchPendingPaymentListFailure({ error }));
          }),
        ),
      ),
    );
  });

  downloadInvoicePdf$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentsActions.downloadInvoicePdf),
      concatMap((action) =>
        this.paymentsService.downloadInvoicePdf(action.invoiceId).pipe(
          map((data: ArrayBuffer) => {
            if (!data || data.byteLength === 0) {
              throw new Error('204');
            }

            const blob = new Blob([data], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(blob);
            window.open(pdfUrl, '_blank');

            return PaymentsActions.downloadInvoicePdfSuccess();
          }),
          catchError((error) => {
            const messageKey =
              error instanceof Error && error.message === '204'
                ? 'payments-a4h.error.invoice-not-found'
                : 'payments-a4h.error.invoice';
            this.notifyError(messageKey);
            return of(PaymentsActions.downloadInvoicePdfFailure({ error }));
          }),
        ),
      ),
    );
  });

  payNexi$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentsActions.payNexi),
      concatMap((action) =>
        this.paymentsService.payNexi(action.payRequest).pipe(
          map((response) => {
            if (response && response.params && response.params.url) {
              const newWindow = window.open(response.params.url, '_self');
              if (newWindow) {
                newWindow.focus();
              } else {
                return PaymentsActions.payNexiFailure({ error: 'Cannot open window' });
              }
              return PaymentsActions.payNexiSuccess();
            }
            return PaymentsActions.payNexiFailure({ error: 'Invalid payment response' });
          }),
          catchError((error) => {
            this.notifyError('payments-a4h.error.not-pay');
            return of(PaymentsActions.payNexiFailure({ error }));
          }),
        ),
      ),
    );
  });

  payNexiConfirmOK$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentsActions.payNexiConfirmOK),
      concatMap((action) =>
        this.paymentsService.confirmOKNexiPayment(action.codTrans).pipe(
          map((response) => {
            if (response && response.length > 0) {
              return PaymentsActions.payNexiConfirmOKSuccess({ invoiceId: response[0].invoiceId });
            }
            return PaymentsActions.payNexiConfirmOKFailure({ error: 'Missing invoice id' });
          }),
          catchError((error) => of(PaymentsActions.payNexiConfirmOKFailure({ error }))),
        ),
      ),
    );
  });

  payNexiConfirmKO$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentsActions.payNexiConfirmKO),
      concatMap((action) =>
        this.paymentsService.confirmKONexiPayment(action.codTrans).pipe(
          map(() => PaymentsActions.payNexiConfirmKOSuccess()),
          catchError((error) => of(PaymentsActions.payNexiConfirmKOFailure({ error }))),
        ),
      ),
    );
  });
}
