import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCredentials from './credentials.reducer';

export const selectCredentialsState = createFeatureSelector<fromCredentials.State>(
  fromCredentials.featureKey,
);

export const selectResetPassword = createSelector(selectCredentialsState, (state) => ({
  loading: state.resetPasswordLoading,
  success: state.resetPasswordSuccess,
  error: state.resetPasswordError,
}));

export const selectChangePassword = createSelector(selectCredentialsState, (state) => ({
  loading: state.changePasswordLoading,
  success: state.changePasswordSuccess,
  error: state.changePasswordError,
}));

export const selectLoginLoading = createSelector(
  selectCredentialsState,
  (state) => state.loginLoading,
);

export const selectLoginSuccess = createSelector(
  selectCredentialsState,
  (state) => state.loginSuccess,
);

export const selectLoginError = createSelector(selectCredentialsState, (state) => state.loginError);

export const selectLoginStep = createSelector(selectCredentialsState, (state) => state.loginStep);

export const selectLoginOtpCode = createSelector(
  selectCredentialsState,
  (state) => state.loginOtpCode,
);

export const selectLoginOtpExpiresOn = createSelector(
  selectCredentialsState,
  (state) => state.loginOtpExpiresOn,
);

export const selectLoginOtpRequired = createSelector(selectLoginStep, (step) => step === 'OTP');

export const selectLogin = createSelector(
  selectLoginLoading,
  selectLoginSuccess,
  selectLoginError,
  (loading, success, error) => ({ loading, success, error }),
);

export const selectConfirmLoginLoading = createSelector(
  selectCredentialsState,
  (state) => state.confirmLoginLoading,
);

export const selectConfirmLoginSuccess = createSelector(
  selectCredentialsState,
  (state) => state.confirmLoginSuccess,
);

export const selectConfirmLoginError = createSelector(
  selectCredentialsState,
  (state) => state.confirmLoginError,
);

export const selectConfirmLogin = createSelector(
  selectConfirmLoginLoading,
  selectConfirmLoginSuccess,
  selectConfirmLoginError,
  (loading, success, error) => ({ loading, success, error }),
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

export const selectLoginProfile = createSelector(selectCredentialsState, (state) => ({
  data: state.loginProfile,
  code: state.loginProfileCode,
  loading: state.loginProfileLoading,
  error: state.loginProfileError,
  updateLoading: state.loginProfileUpdateLoading,
  updateError: state.loginProfileUpdateError,
}));
