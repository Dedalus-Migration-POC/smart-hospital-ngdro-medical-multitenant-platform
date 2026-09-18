import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPayments from './reducer';

export const selectPaymentsA4hState = createFeatureSelector<fromPayments.State>(
  fromPayments.featureKey,
);

export const selectPaymentList = createSelector(selectPaymentsA4hState, (state) => state.payments);
export const selectPaymentListLoading = createSelector(
  selectPaymentsA4hState,
  (state) => state.paymentsLoading,
);
export const selectPaymentListError = createSelector(
  selectPaymentsA4hState,
  (state) => state.paymentsError,
);
export const selectPayments = createSelector(
  selectPaymentList,
  selectPaymentListLoading,
  selectPaymentListError,
  (payments, loading, error) => ({ payments, loading, error }),
);

export const selectPendingPaymentList = createSelector(
  selectPaymentsA4hState,
  (state) => state.paymentsPending,
);
export const selectPendingPaymentListLoading = createSelector(
  selectPaymentsA4hState,
  (state) => state.paymentsPendingLoading,
);
export const selectPendingPaymentListError = createSelector(
  selectPaymentsA4hState,
  (state) => state.paymentsPendingError,
);
export const selectPendingPayments = createSelector(
  selectPendingPaymentList,
  selectPendingPaymentListLoading,
  selectPendingPaymentListError,
  (payments, loading, error) => ({ payments, loading, error }),
);

export const selectDownloadingInvoicePdf = createSelector(
  selectPaymentsA4hState,
  (state) => state.downloadingInvoicePdf,
);

export const selectPayNexiLoading = createSelector(
  selectPaymentsA4hState,
  (state) => state.payNexiLoading,
);
export const selectPayNexiError = createSelector(
  selectPaymentsA4hState,
  (state) => state.payNexiError,
);
export const selectPayNexi = createSelector(
  selectPayNexiLoading,
  selectPayNexiError,
  (loading, error) => ({ loading, error }),
);

export const selectPayNexiConfirmOKLoading = createSelector(
  selectPaymentsA4hState,
  (state) => state.confirmPayNexiOKLoading,
);
export const selectPayNexiConfirmOKInvoiceId = createSelector(
  selectPaymentsA4hState,
  (state) => state.confirmPayNexiOKInvoiceId,
);
export const selectPayNexiConfirmOKError = createSelector(
  selectPaymentsA4hState,
  (state) => state.confirmPayNexiOKError,
);
export const selectPayNexiConfirmOK = createSelector(
  selectPayNexiConfirmOKLoading,
  selectPayNexiConfirmOKInvoiceId,
  selectPayNexiConfirmOKError,
  (loading, invoiceId, error) => ({ loading, invoiceId, error }),
);

export const selectPayNexiConfirmKOLoading = createSelector(
  selectPaymentsA4hState,
  (state) => state.confirmPayNexiKOLoading,
);
export const selectPayNexiConfirmKOError = createSelector(
  selectPaymentsA4hState,
  (state) => state.confirmPayNexiKOError,
);
export const selectPayNexiConfirmKO = createSelector(
  selectPayNexiConfirmKOLoading,
  selectPayNexiConfirmKOError,
  (loading, error) => ({ loading, error }),
);
