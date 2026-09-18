import { createReducer, on } from '@ngrx/store';
import * as PaymentsActions from './actions';
import { Appointment, Payment } from './model';

export const featureKey = 'paymentsA4hState';

export interface State {
  payments: Payment[];
  paymentsLoading: boolean;
  paymentsError: boolean;
  paymentsPending: Appointment[] | null;
  paymentsPendingLoading: boolean;
  paymentsPendingError: boolean;
  downloadingInvoicePdf: boolean;
  downloadInvoicePdfError: boolean;
  payNexiLoading: boolean;
  payNexiError: boolean;
  confirmPayNexiOKLoading: boolean;
  confirmPayNexiOKInvoiceId: string;
  confirmPayNexiOKError: boolean;
  confirmPayNexiKOLoading: boolean;
  confirmPayNexiKOError: boolean;
}

export const initialState: State = {
  payments: [],
  paymentsLoading: false,
  paymentsError: false,
  paymentsPending: [],
  paymentsPendingLoading: false,
  paymentsPendingError: false,
  downloadingInvoicePdf: false,
  downloadInvoicePdfError: false,
  payNexiLoading: false,
  payNexiError: false,
  confirmPayNexiOKLoading: false,
  confirmPayNexiOKInvoiceId: '',
  confirmPayNexiOKError: false,
  confirmPayNexiKOLoading: false,
  confirmPayNexiKOError: false,
};

export const reducer = createReducer(
  initialState,

  on(PaymentsActions.fetchPaymentList, (state) => ({
    ...state,
    paymentsError: false,
    paymentsLoading: true,
  })),
  on(PaymentsActions.fetchPaymentListSuccess, (state, action) => ({
    ...state,
    paymentsError: false,
    paymentsLoading: false,
    payments: action.payments,
  })),
  on(PaymentsActions.fetchPaymentListFailure, (state) => ({
    ...state,
    paymentsError: true,
    paymentsLoading: false,
  })),

  on(PaymentsActions.fetchPendingPaymentList, (state) => ({
    ...state,
    paymentsPendingError: false,
    paymentsPendingLoading: true,
  })),
  on(PaymentsActions.fetchPendingPaymentListSuccess, (state, action) => ({
    ...state,
    paymentsPendingError: false,
    paymentsPendingLoading: false,
    paymentsPending: action.payments?.groupedAppointments ?? null,
  })),
  on(PaymentsActions.fetchPendingPaymentListFailure, (state) => ({
    ...state,
    paymentsPendingError: true,
    paymentsPendingLoading: false,
  })),

  on(PaymentsActions.downloadInvoicePdf, (state) => ({
    ...state,
    downloadingInvoicePdf: true,
    downloadInvoicePdfError: false,
  })),
  on(PaymentsActions.downloadInvoicePdfSuccess, (state) => ({
    ...state,
    downloadingInvoicePdf: false,
  })),
  on(PaymentsActions.downloadInvoicePdfFailure, (state) => ({
    ...state,
    downloadingInvoicePdf: false,
    downloadInvoicePdfError: true,
  })),

  on(PaymentsActions.payNexi, (state) => ({
    ...state,
    payNexiLoading: true,
    payNexiError: false,
  })),
  on(PaymentsActions.payNexiSuccess, (state) => ({
    ...state,
    payNexiLoading: false,
  })),
  on(PaymentsActions.payNexiFailure, (state) => ({
    ...state,
    payNexiLoading: false,
    payNexiError: true,
  })),

  on(PaymentsActions.payNexiConfirmOK, (state) => ({
    ...state,
    confirmPayNexiOKLoading: true,
    confirmPayNexiOKError: false,
  })),
  on(PaymentsActions.payNexiConfirmOKSuccess, (state, { invoiceId }) => ({
    ...state,
    confirmPayNexiOKLoading: false,
    confirmPayNexiOKInvoiceId: invoiceId,
  })),
  on(PaymentsActions.payNexiConfirmOKFailure, (state) => ({
    ...state,
    confirmPayNexiOKLoading: false,
    confirmPayNexiOKError: true,
  })),

  on(PaymentsActions.payNexiConfirmKO, (state) => ({
    ...state,
    confirmPayNexiKOLoading: true,
    confirmPayNexiKOError: false,
  })),
  on(PaymentsActions.payNexiConfirmKOSuccess, (state) => ({
    ...state,
    confirmPayNexiKOLoading: false,
  })),
  on(PaymentsActions.payNexiConfirmKOFailure, (state) => ({
    ...state,
    confirmPayNexiKOLoading: false,
    confirmPayNexiKOError: true,
  })),
);
