import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PaymentActions from './actions';
import { catchError, concatMap, map, of } from 'rxjs';
import { PaymentJcashService } from './service';
import { DownloadUtils } from 'src/utils/download-utils';
import { TranslateService } from '@ngx-translate/core';
import { ItNotificationService, NotificationPosition } from 'design-angular-kit';

// import { CardMultiUseConfig } from 'src/app/components/card/card.model'

@Injectable()
export class PaymentsJcEffects {
  private actions$ = inject(Actions);
  private paymentJcashService = inject(PaymentJcashService);
  private translate = inject(TranslateService);
  private readonly notificationService = inject(ItNotificationService);
  // fetchCardMultiUseConfigReport$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(PaymentActions.fetchCardMultiUseConfigPayment),
  //     concatMap(() =>
  //       this.paymentJcashService.fetchCardMultiUseConfigPayment().pipe(
  //         map((data: CardMultiUseConfig) =>
  //           PaymentActions.fetchCardMultiUseConfigPaymentSuccess({
  //             data,
  //           }),
  //         ),
  //         catchError((error) =>
  //           of(
  //             PaymentActions.fetchCardMultiUseConfigPaymentFailure({
  //               error,
  //             }),
  //           ),
  //         ),
  //       ),
  //     ),
  //   )
  // })

  fetchPayments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentActions.fetchPayments),
      concatMap(() =>
        this.paymentJcashService.fetchPayments().pipe(
          map((data) => {
            return PaymentActions.fetchPaymentsSuccess({ data });
          }),
          catchError((error) => of(PaymentActions.fetchPaymentsFailure({ error }))),
        ),
      ),
    );
  });

  downloadInvoicePdf$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentActions.downloadInvoicePdf),
      concatMap((action) =>
        this.paymentJcashService.downloadInvoicePdf(action.iuv).pipe(
          map((data) => {
            DownloadUtils.download('application/pdf', data, action.iuv);
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
      ofType(PaymentActions.getLinkPagoPa),
      concatMap((action) =>
        this.paymentJcashService.getPagoPaLink(action.payment).pipe(
          map((data) => {
            window.open(data.redirectUrl, '_blank', 'noopener,noreferrer');
            return PaymentActions.getLinkPagoPaSuccess();
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );
            return of(PaymentActions.getLinkPagoPaFailure({ error }));
          }),
        ),
      ),
    );
  });

  constructor() {}
}
