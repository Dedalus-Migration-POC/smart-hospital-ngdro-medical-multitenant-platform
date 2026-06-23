import { createAction, props } from '@ngrx/store';
import { PagoPaLinkRequest, PaymentSummary } from './payments.service';

// export const fetchCardMultiUseConfigPayment = createAction(
//   '[Payment] Fetch CardMultiUseConfigPayment',
// )

// export const fetchCardMultiUseConfigPaymentSuccess = createAction(
//   '[Payment] Fetch fetchCardMultiUseConfigPayment Success',
//   props<{ data: CardMultiUseConfig }>(),
// )

// export const fetchCardMultiUseConfigPaymentFailure = createAction(
//   '[Payment] Fetch fetchCardMultiUseConfigPayment Failure',
//   props<{ error: any }>(),
// )

export const fetchPayments = createAction('[Payment] Fetch Payments');

export const fetchPaymentsSuccess = createAction(
  '[Payment] Fetch Payments Success',
  props<{ data: PaymentSummary[] }>(),
);

export const fetchPaymentsFailure = createAction(
  '[Payment] Fetch Payments Failure',
  props<{ error: any }>(),
);

export const fetchPaymentSummary = createAction(
  '[Payment] Fetch PaymentSummary',
  props<{ bookingId: string }>(),
);

export const fetchPaymentSummarySuccess = createAction(
  '[Payment] Fetch PaymentSummary Success',
  props<{ data: PaymentSummary }>(),
);

export const fetchPaymentSummaryFailure = createAction(
  '[Payment] Fetch PaymentSummaryTicket Failure',
  props<{ error: any }>(),
);

export const downloadInvoicePdf = createAction(
  '[Payment] Download Invoice Pdf',
  props<{ admissionsId: string }>(),
);

export const downloadInvoicePdfSuccess = createAction('[Payment] Download Invoice Pdf Success');

export const downloadInvoicePdfFailure = createAction(
  '[Payment] Download Invoice PdfTicket Failure',
  props<{ error: any }>(),
);

export const getPagoPaLink = createAction(
  '[Payment] Get PagoPaLink',
  props<{
    payment: PagoPaLinkRequest;
  }>(),
);

export const getPagoPaLinkSuccess = createAction(
  '[Payment] Get PagoPaLink Success',
  props<{ data: any }>(),
);

export const getPagoPaLinkFailure = createAction(
  '[Payment] Get PagoPaLink Failure',
  props<{ error: any }>(),
);
