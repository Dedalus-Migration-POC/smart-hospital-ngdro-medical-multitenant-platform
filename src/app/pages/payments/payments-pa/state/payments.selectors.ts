import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPayments from './payments.reducer';

export const selectPaymentState = createFeatureSelector<fromPayments.State>(
  fromPayments.featureKey,
);

export const selectPaymentsData = createSelector(selectPaymentState, (state) => state.payments);
export const selectPaymentsLoading = createSelector(
  selectPaymentState,
  (state) => state.paymentsLoading,
);
export const selectPaymentsError = createSelector(
  selectPaymentState,
  (state) => state.paymentsError,
);
export const selectPayments = createSelector(
  selectPaymentsData,
  selectPaymentsLoading,
  selectPaymentsError,
  (data, loading, error) => ({ data, loading, error }),
);

export const selectPaymentSummaryData = createSelector(
  selectPaymentState,
  (state) => state.paymentSummary,
);
export const selectPaymentSummaryLoading = createSelector(
  selectPaymentState,
  (state) => state.paymentSummaryLoading,
);
export const selectPaymentSummaryError = createSelector(
  selectPaymentState,
  (state) => state.paymentSummaryError,
);
export const selectPaymentSummary = createSelector(
  selectPaymentSummaryData,
  selectPaymentSummaryLoading,
  selectPaymentSummaryError,
  (data, loading, error) => ({ data, loading, error }),
);

export const selectDownloadingInvoicePdf = createSelector(
  selectPaymentState,
  (state) => state.downloadingInvoicePdf,
);

export const selectDownloadingInvoicePdfError = createSelector(
  selectPaymentState,
  (state) => state.downloadInvoicePdfError,
);

// export const selectCardMultiUseConfigPayment = createSelector(
//   selectPaymentState,
//   (state) => state.cardMultiUseConfigPayment,
// )

export const selectPagoPaLinkLoading = createSelector(
  selectPaymentState,
  (state) => state.pagoPaLinkLoading,
);
