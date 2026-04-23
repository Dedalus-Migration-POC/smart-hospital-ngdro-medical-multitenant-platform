import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as fromUserProfile from './user-profile.reducer'

export const selectUserProfileState =
  createFeatureSelector<fromUserProfile.State>(fromUserProfile.featureKey)

export const selectInitialized = createSelector(
  selectUserProfileState,
  (state) => state.initialized,
)
export const selectUserProfileData = createSelector(
  selectUserProfileState,
  (state) => state.userProfile,
)
export const selectUserProfileLoading = createSelector(
  selectUserProfileState,
  (state) => state.userProfileLoading,
)
export const selectUserProfileError = createSelector(
  selectUserProfileState,
  (state) => state.userProfileError,
)
export const selectAdditionalAttributes = createSelector(
  selectUserProfileData,
  (p) => p?.additionalAttributes ?? [],
)
export const selectUserPhoneNumber = createSelector(
  selectAdditionalAttributes,
  (attrs) => attrs.find((a) => a.key === 'phone_number')?.value ?? null,
)
export const selectTemporary = createSelector(
  selectUserProfileState,
  (state) => state.temporary,
)
export const selectUserProfile = createSelector(
  selectUserProfileData,
  selectUserProfileLoading,
  selectUserProfileError,
  selectTemporary,
  (data, loading, error, temporary) => ({ data, loading, error, temporary }),
)

export const selectUserConfigData = createSelector(
  selectUserProfileState,
  (state) => state.userConfig,
)
export const selectUserConfigLoading = createSelector(
  selectUserProfileState,
  (state) => state.userConfigLoading,
)
export const selectUserConfigError = createSelector(
  selectUserProfileState,
  (state) => state.userConfigError,
)
export const selectUserConfig = createSelector(
  selectUserConfigData,
  selectUserConfigLoading,
  selectUserConfigError,
  (data, loading, error) => ({ data, loading, error }),
)

export const selectUserConsentsData = createSelector(
  selectUserProfileState,
  (state) => state.userConsents,
)
export const selectUserConsentsLoading = createSelector(
  selectUserProfileState,
  (state) => state.userConsentsLoading,
)
export const selectUserConsentsError = createSelector(
  selectUserProfileState,
  (state) => state.userConsentsError,
)
export const selectUserConsents = createSelector(
  selectUserConsentsData,
  selectUserConsentsLoading,
  selectUserConsentsError,
  (data, loading, error) => ({ data, loading, error }),
)

export const selectUpdateUserProfileLoading = createSelector(
  selectUserProfileState,
  (state) => state.updateUserProfileLoading,
)
export const selectUpdateUserProfileError = createSelector(
  selectUserProfileState,
  (state) => state.updateUserProfileError,
)

export const selectUpdateUserConsentsLoading = createSelector(
  selectUserProfileState,
  (state) => state.updateUserConsentsLoading,
)

export const selectUpdateUserConsentsError = createSelector(
  selectUserProfileState,
  (state) => state.updateUserConsentsError,
)

export const selectspidConfirmLoading = createSelector(
  selectUserProfileState,
  (state) => state.spidConfirmLoading,
)
export const selectspidConfirmError = createSelector(
  selectUserProfileState,
  (state) => state.spidConfirmError,
)
