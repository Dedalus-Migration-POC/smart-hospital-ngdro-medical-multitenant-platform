import { createAction, props } from '@ngrx/store';
import { Payment, PaymentPending, PayRequest } from './model';

export const fetchPaymentList = createAction('[Payment A4H] Fetch Payment List');
export const fetchPaymentListSuccess = createAction(
  '[Payment A4H] Fetch Payment List Success',
  props<{ payments: Payment[] }>(),
);
export const fetchPaymentListFailure = createAction(
  '[Payment A4H] Fetch Payment List Failure',
  props<{ error: any }>(),
);

export const fetchPendingPaymentList = createAction('[Payment A4H] Fetch Pending Payment List');
export const fetchPendingPaymentListSuccess = createAction(
  '[Payment A4H] Fetch Pending Payment List Success',
  props<{ payments: PaymentPending }>(),
);
export const fetchPendingPaymentListFailure = createAction(
  '[Payment A4H] Fetch Pending Payment List Failure',
  props<{ error: any }>(),
);

export const downloadInvoicePdf = createAction(
  '[Payment A4H] Download Invoice Pdf',
  props<{ invoiceId: string }>(),
);
export const downloadInvoicePdfSuccess = createAction('[Payment A4H] Download Invoice Pdf Success');
export const downloadInvoicePdfFailure = createAction(
  '[Payment A4H] Download Invoice Pdf Failure',
  props<{ error: any }>(),
);

export const payNexi = createAction('[Payment A4H] Pay Nexi', props<{ payRequest: PayRequest }>());
export const payNexiSuccess = createAction('[Payment A4H] Pay Nexi Success');
export const payNexiFailure = createAction(
  '[Payment A4H] Pay Nexi Failure',
  props<{ error: any }>(),
);

export const payNexiConfirmOK = createAction(
  '[Payment A4H] Pay Nexi Confirm OK',
  props<{ codTrans: string }>(),
);
export const payNexiConfirmOKSuccess = createAction(
  '[Payment A4H] Pay Nexi OK Success',
  props<{ invoiceId: string }>(),
);
export const payNexiConfirmOKFailure = createAction(
  '[Payment A4H] Pay Nexi OK Failure',
  props<{ error: any }>(),
);

export const payNexiConfirmKO = createAction(
  '[Payment A4H] Pay Nexi Confirm KO',
  props<{ codTrans: string }>(),
);
export const payNexiConfirmKOSuccess = createAction('[Payment A4H] Pay Nexi KO Success');
export const payNexiConfirmKOFailure = createAction(
  '[Payment A4H] Pay Nexi KO Failure',
  props<{ error: any }>(),
);
