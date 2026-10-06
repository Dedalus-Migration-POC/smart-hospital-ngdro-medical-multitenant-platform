import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCredentials from './credentials.reducer';

export const selectCredentialsState = createFeatureSelector<fromCredentials.State>(
  fromCredentials.featureKey,
);

export const selectRegistrationAttributesData = createSelector(
  selectCredentialsState,
  (state) => state.registrationAttributes,
);

export const selectRegistrationAttributesLoading = createSelector(
  selectCredentialsState,
  (state) => state.registrationAttributesLoading,
);

export const selectRegistrationAttributesError = createSelector(
  selectCredentialsState,
  (state) => state.registrationAttributesError,
);

export const selectRequiredRegistrationAttributes = createSelector(
  selectRegistrationAttributesData,
  (attributes) => attributes.filter((attribute) => attribute.required),
);

export const selectRegistrationAttributes = createSelector(
  selectRegistrationAttributesData,
  selectRegistrationAttributesLoading,
  selectRegistrationAttributesError,
  (data, loading, error) => ({ data, loading, error }),
);

export const selectRegistrationConsentsData = createSelector(
  selectCredentialsState,
  (state) => state.registrationConsents,
);

export const selectRegistrationConsentsLoading = createSelector(
  selectCredentialsState,
  (state) => state.registrationConsentsLoading,
);

export const selectRegistrationConsentsError = createSelector(
  selectCredentialsState,
  (state) => state.registrationConsentsError,
);

export const selectRequiredRegistrationConsents = createSelector(
  selectRegistrationConsentsData,
  (consents) => consents.filter((consent) => consent.required),
);

export const selectRegistrationConsents = createSelector(
  selectRegistrationConsentsData,
  selectRegistrationConsentsLoading,
  selectRegistrationConsentsError,
  (data, loading, error) => ({ data, loading, error }),
);

export const selectRegistrationLoading = createSelector(
  selectCredentialsState,
  (state) => state.registrationLoading,
);

export const selectRegistrationSuccess = createSelector(
  selectCredentialsState,
  (state) => state.registrationSuccess,
);

export const selectRegistrationError = createSelector(
  selectCredentialsState,
  (state) => state.registrationError,
);

export const selectRegistration = createSelector(
  selectRegistrationLoading,
  selectRegistrationSuccess,
  selectRegistrationError,
  (loading, success, error) => ({ loading, success, error }),
);
