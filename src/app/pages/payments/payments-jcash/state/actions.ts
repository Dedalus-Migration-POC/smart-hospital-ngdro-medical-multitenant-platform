import { createAction, props } from '@ngrx/store';
import { LinkPagoPaRequest } from './model';

// import { CardMultiUseConfig } from 'src/app/components/card/card.model'

// export const fetchCardMultiUseConfigPayment = createAction(
//   '[Payment jc] Fetch CardMultiUseConfigPayment',
// )
// export const fetchCardMultiUseConfigPaymentSuccess = createAction(
//   '[Payment jc] Fetch fetchCardMultiUseConfigPayment Success',
//   props<{ data: CardMultiUseConfig }>(),
// )
// export const fetchCardMultiUseConfigPaymentFailure = createAction(
//   '[Payment jc] Fetch fetchCardMultiUseConfigPayment Failure',
//   props<{ error: any }>(),
// )

export const fetchPayments = createAction('[Payment jc] Fetch Payments');
export const fetchPaymentsSuccess = createAction(
  '[Payment jc] Fetch Payments Success',
  props<{ data: any[] }>(),
);
export const fetchPaymentsFailure = createAction(
  '[Payment jc] Fetch Payments Failure',
  props<{ error: any }>(),
);

export const getLinkPagoPa = createAction(
  '[Payment] Get LinkPagoPa',
  props<{
    payment: LinkPagoPaRequest;
  }>(),
);
export const getLinkPagoPaSuccess = createAction('[Payment] Get LinkPagoPa Success');
export const getLinkPagoPaFailure = createAction(
  '[Payment] Get LinkPagoPa Failure',
  props<{ error: any }>(),
);

export const downloadInvoicePdf = createAction(
  '[Payment jc] Download Invoice Pdf',
  props<{ iuv: string }>(),
);
export const downloadInvoicePdfSuccess = createAction('[Payment jc] Download Invoice Pdf Success');
export const downloadInvoicePdfFailure = createAction(
  '[Payment jc] Download Invoice PdfTicket Failure',
  props<{ error: any }>(),
);
