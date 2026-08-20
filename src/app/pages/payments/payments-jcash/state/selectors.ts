import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPayments from './reducer';

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

export const selectDownloadingInvoicePdf = createSelector(
  selectPaymentState,
  (state) => state.downloadingInvoicePdf,
);

export const selectGetPayLoading = createSelector(
  selectPaymentState,
  (state) => state.pagoPaLinkLoading,
);
