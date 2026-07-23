import { Payment } from './model';
import * as PaymentActions from './actions';
import { createReducer, on } from '@ngrx/store';

// import { CardMultiUseConfig } from 'src/app/components/card/card.model'

export const featureKey = 'paymentsJcState';

export interface State {
  // cardMultiUseConfigPayment: CardMultiUseConfig | null
  paymentsLoading: boolean;
  payments: Payment[];
  paymentsError: boolean;
  downloadingInvoicePdf: boolean;
  downloadInvoicePdfError: boolean;
  // pagoPaLinkLoading: boolean
  pagoPaLinkError: boolean;
}

export const initialState: State = {
  // cardMultiUseConfigPayment: null,
  paymentsLoading: false,
  payments: [],
  paymentsError: false,
  downloadingInvoicePdf: false,
  downloadInvoicePdfError: false,
  // pagoPaLinkLoading: false,
  pagoPaLinkError: false,
};

export const reducer = createReducer(
  initialState,

  // on(PaymentActions.fetchCardMultiUseConfigPayment, (state) => ({
  //   ...state,
  // })),
  // on(PaymentActions.fetchCardMultiUseConfigPaymentSuccess, (state, action) => ({
  //   ...state,
  //   cardMultiUseConfigPayment: action.data,
  // })),
  // on(PaymentActions.fetchCardMultiUseConfigPaymentFailure, (state) => ({
  //   ...state,
  //   cardMultiUseConfigPayment: null,
  // })),

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

  on(PaymentActions.getLinkPagoPa, (state) => ({
    ...state,
    //pagoPaLinkLoading: true,
    pagoPaLinkError: false,
  })),
  on(PaymentActions.getLinkPagoPaFailure, (state) => ({
    ...state,
    // pagoPaLinkLoading: false,
    pagoPaLinkError: true,
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
);
