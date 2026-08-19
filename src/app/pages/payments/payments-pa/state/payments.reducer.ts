import { createReducer, on } from '@ngrx/store';
import * as PaymentActions from './payments.actions';
import { PaymentSummary } from './payments.model';

export const featureKey = 'paymentsState';

export interface State {
  paymentsLoading: boolean;
  payments: PaymentSummary[];
  paymentsError: boolean;
  paymentSummary: PaymentSummary | null;
  paymentSummaryLoading: boolean;
  paymentSummaryError: boolean;
  downloadingInvoicePdf: boolean;
  downloadInvoicePdfError: boolean;
  pagoPaLink: any;
  pagoPaLinkLoading: boolean;
  pagoPaLinkError: boolean;
}

export const initialState: State = {
  paymentsLoading: false,
  payments: [],
  paymentsError: false,
  paymentSummary: null,
  paymentSummaryLoading: false,
  paymentSummaryError: false,
  downloadingInvoicePdf: false,
  downloadInvoicePdfError: false,
  pagoPaLink: null,
  pagoPaLinkLoading: false,
  pagoPaLinkError: false,
};

export const reducer = createReducer(
  initialState,

  on(PaymentActions.fetchPayments, (state) => ({
    ...state,
    paymentsLoading: true,
    paymentsError: false,
  })),
  on(PaymentActions.fetchPaymentsSuccess, (state, action) => ({
    ...state,
    paymentsLoading: false,
    payments: action.data,
  })),
  on(PaymentActions.fetchPaymentsFailure, (state) => ({
    ...state,
    paymentsLoading: false,
    paymentsError: true,
  })),

  on(PaymentActions.fetchPaymentSummary, (state) => ({
    ...state,
    paymentSummaryLoading: true,
    paymentSummaryError: false,
  })),
  on(PaymentActions.fetchPaymentSummarySuccess, (state, action) => ({
    ...state,
    paymentSummaryLoading: false,
    paymentSummary: action.data,
  })),
  on(PaymentActions.fetchPaymentSummaryFailure, (state) => ({
    ...state,
    paymentSummaryLoading: false,
    paymentSummaryError: true,
  })),

  on(PaymentActions.downloadInvoicePdf, (state) => ({
    ...state,
    downloadingInvoicePdf: true,
    downloadInvoicePdfError: false,
  })),
  on(PaymentActions.downloadInvoicePdfSuccess, (state, action) => ({
    ...state,
    downloadingInvoicePdf: false,
  })),
  on(PaymentActions.downloadInvoicePdfFailure, (state) => ({
    ...state,
    downloadingInvoicePdf: false,
    downloadInvoicePdfError: true,
  })),

  on(PaymentActions.getPagoPaLink, (state) => ({
    ...state,
    pagoPaLinkLoading: true,
    pagoPaLinkError: false,
  })),
  on(PaymentActions.getPagoPaLinkSuccess, (state, action) => ({
    ...state,
    pagoPaLinkLoading: false,
    pagoPaLink: action.data,
  })),
  on(PaymentActions.getPagoPaLinkFailure, (state) => ({
    ...state,
    pagoPaLinkLoading: false,
    pagoPaLinkError: true,
  })),
);
