import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUserProfile from './user-profile.reducer';

export const selectUserProfileState = createFeatureSelector<fromUserProfile.State>(
  fromUserProfile.featureKey,
);

export const selectInitialized = createSelector(
  selectUserProfileState,
  (state) => state.initialized,
);
export const selectUserProfileData = createSelector(
  selectUserProfileState,
  (state) => state.userProfile,
);
export const selectUserProfileLoading = createSelector(
  selectUserProfileState,
  (state) => state.userProfileLoading,
);
export const selectUserProfileError = createSelector(
  selectUserProfileState,
  (state) => state.userProfileError,
);
export const selectAdditionalAttributes = createSelector(
  selectUserProfileData,
  (p) => p?.additionalAttributes ?? [],
);
export const selectUserPhoneNumber = createSelector(
  selectAdditionalAttributes,
  (attrs) => attrs.find((a) => a.key === 'phone_number')?.value ?? null,
);
export const selectTemporary = createSelector(selectUserProfileState, (state) => state.temporary);
export const selectUserProfile = createSelector(
  selectUserProfileData,
  selectUserProfileLoading,
  selectUserProfileError,
  selectTemporary,
  (data, loading, error, temporary) => ({ data, loading, error, temporary }),
);

export const selectUserConsentsData = createSelector(
  selectUserProfileState,
  (state) => state.userConsents,
);
export const selectUserConsentsLoading = createSelector(
  selectUserProfileState,
  (state) => state.userConsentsLoading,
);
export const selectUserConsentsError = createSelector(
  selectUserProfileState,
  (state) => state.userConsentsError,
);
export const selectUserConsents = createSelector(
  selectUserConsentsData,
  selectUserConsentsLoading,
  selectUserConsentsError,
  (data, loading, error) => ({ data, loading, error }),
);

export const selectUpdateUserProfileLoading = createSelector(
  selectUserProfileState,
  (state) => state.updateUserProfileLoading,
);
export const selectUpdateUserProfileError = createSelector(
  selectUserProfileState,
  (state) => state.updateUserProfileError,
);

export const selectUpdateUserConsentsLoading = createSelector(
  selectUserProfileState,
  (state) => state.updateUserConsentsLoading,
);

export const selectUpdateUserConsentsError = createSelector(
  selectUserProfileState,
  (state) => state.updateUserConsentsError,
);

export const selectspidConfirmLoading = createSelector(
  selectUserProfileState,
  (state) => state.spidConfirmLoading,
);
export const selectspidConfirmError = createSelector(
  selectUserProfileState,
  (state) => state.spidConfirmError,
);

//------- consents A4H-------------
export const selectUserA4hPrivacyConsentData = createSelector(
  selectUserProfileState,
  (state) => state.userA4hPrivacyConsent,
);
export const selectUserA4hPrivacyConsentLoading = createSelector(
  selectUserProfileState,
  (state) => state.userA4hPrivacyConsentLoading,
);
export const selectUserA4hPrivacyConsentError = createSelector(
  selectUserProfileState,
  (state) => state.userA4hPrivacyConsentError,
);
export const selectUserA4hPrivacyConsent = createSelector(
  selectUserA4hPrivacyConsentData,
  selectUserA4hPrivacyConsentLoading,
  selectUserA4hPrivacyConsentError,
  (data, loading, error) => ({ data, loading, error }),
);

export const selectUpdateUserA4hPrivacyConsentData = createSelector(
  selectUserProfileState,
  (state) => state.updateUserA4hPrivacyConsent,
);

export const selectUpdateUserA4hPrivacyConsentLoading = createSelector(
  selectUserProfileState,
  (state) => state.updateUserA4hPrivacyConsentLoading,
);

export const selectUpdateUserA4hPrivacyConsentError = createSelector(
  selectUserProfileState,
  (state) => state.updateUserA4hPrivacyConsentError,
);

export const selectUpdateUserA4hPrivacyConsent = createSelector(
  selectUpdateUserA4hPrivacyConsentData,
  selectUpdateUserA4hPrivacyConsentLoading,
  selectUpdateUserA4hPrivacyConsentError,
  (data, loading, error) => ({ data, loading, error }),
);
//--------fine consents A4H-------------
