import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromConsentsA4HState from './reducer';

export const selectConsentsA4HState = createFeatureSelector<fromConsentsA4HState.State>(
  fromConsentsA4HState.featureKey,
);

//------- consents A4H-------------
export const selectUserA4hPrivacyConsentData = createSelector(
  selectConsentsA4HState,
  (state) => state.userA4hPrivacyConsent,
);
export const selectUserA4hPrivacyConsentLoading = createSelector(
  selectConsentsA4HState,
  (state) => state.userA4hPrivacyConsentLoading,
);
export const selectUserA4hPrivacyConsentError = createSelector(
  selectConsentsA4HState,
  (state) => state.userA4hPrivacyConsentError,
);
export const selectUserA4hPrivacyConsent = createSelector(
  selectUserA4hPrivacyConsentData,
  selectUserA4hPrivacyConsentLoading,
  selectUserA4hPrivacyConsentError,
  (data, loading, error) => ({ data, loading, error }),
);

export const selectUpdateUserA4hPrivacyConsentData = createSelector(
  selectConsentsA4HState,
  (state) => state.updateUserA4hPrivacyConsent,
);

export const selectUpdateUserA4hPrivacyConsentLoading = createSelector(
  selectConsentsA4HState,
  (state) => state.updateUserA4hPrivacyConsentLoading,
);

export const selectUpdateUserA4hPrivacyConsentError = createSelector(
  selectConsentsA4HState,
  (state) => state.updateUserA4hPrivacyConsentError,
);

export const selectUpdateUserA4hPrivacyConsent = createSelector(
  selectUpdateUserA4hPrivacyConsentData,
  selectUpdateUserA4hPrivacyConsentLoading,
  selectUpdateUserA4hPrivacyConsentError,
  (data, loading, error) => ({ data, loading, error }),
);

export const selectConsentsA4hData = createSelector(
  selectConsentsA4HState,
  (state) => state.consentsA4h,
);

export const selectConsentsA4hLoading = createSelector(
  selectConsentsA4HState,
  (state) => state.consentsA4hLoading,
);

export const selectConsentsA4hError = createSelector(
  selectConsentsA4HState,
  (state) => state.consentsA4hError,
);

export const selectConsentsA4h = createSelector(
  selectConsentsA4hData,
  selectConsentsA4hLoading,
  selectConsentsA4hError,
  (data, loading, error) => ({ data, loading, error }),
);

export const selectUpdateConsentA4hLoading = createSelector(
  selectConsentsA4HState,
  (state) => state.updateConsentsA4hLoading,
);

export const selectUpdateConsentA4hError = createSelector(
  selectConsentsA4HState,
  (state) => state.updateConsentsA4hError,
);
