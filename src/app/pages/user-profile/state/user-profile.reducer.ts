import { createReducer, on } from '@ngrx/store';
import * as UserProfileActions from './user-profile.actions';
import { UserConfig, UserConsent, UserProfile } from '../user-profile.model';

export const featureKey = 'userProfileState';

export interface State {
  initialized: boolean;

  userProfile: UserProfile | null;
  userProfileLoading: boolean;
  userProfileError: boolean;
  temporary: boolean;

  userConfig: UserConfig | null;
  userConfigLoading: boolean;
  userConfigError: boolean;

  userConsents: UserConsent[];
  userConsentsLoading: boolean;
  userConsentsError: boolean;

  updateUserProfileLoading: boolean;
  updateUserProfileError: boolean;

  updateUserConsentsLoading: boolean;
  updateUserConsentsError: boolean;

  spidConfirmLoading: boolean;
  spidConfirmError: boolean;
}

export const initialState: State = {
  initialized: false,

  userProfile: null,
  userProfileLoading: false,
  userProfileError: false,
  temporary: false,

  userConfig: null,
  userConfigLoading: false,
  userConfigError: false,

  userConsents: [],
  userConsentsLoading: false,
  userConsentsError: false,

  updateUserProfileLoading: false,
  updateUserProfileError: false,

  updateUserConsentsLoading: false,
  updateUserConsentsError: false,

  spidConfirmLoading: false,
  spidConfirmError: false,
};

export const reducer = createReducer(
  initialState,
  on(UserProfileActions.fetchUserProfile, (state) => ({
    ...state,
    userProfileLoading: true,
    userProfileError: false,
    initialized: false,
  })),
  on(UserProfileActions.fetchUserProfileSuccess, (state, action) => ({
    ...state,
    userProfileLoading: false,
    userProfile: action.data,
    initialized: true,
    temporary: action.temporary || false,
  })),
  on(UserProfileActions.fetchUserProfileFailure, (state) => ({
    ...state,
    userProfileLoading: false,
    userProfileError: true,
    initialized: true,
  })),
  on(UserProfileActions.fetchUserConfig, (state) => ({
    ...state,
    userConfigLoading: true,
    userConfigError: false,
  })),
  on(UserProfileActions.fetchUserConfigSuccess, (state, action) => ({
    ...state,
    userConfigLoading: false,
    userConfig: action.data,
  })),
  on(UserProfileActions.fetchUserConfigFailure, (state) => ({
    ...state,
    userConfigLoading: false,
    userConfigError: true,
  })),
  on(UserProfileActions.fetchUserConsents, (state) => ({
    ...state,
    userConsents: [],
    userConsentsLoading: true,
    userConsentsError: false,
  })),
  on(UserProfileActions.fetchUserConsentsSuccess, (state, action) => ({
    ...state,
    userConsentsLoading: false,
    userConsents: action.data || [],
  })),
  on(UserProfileActions.fetchUserConsentsFailure, (state) => ({
    ...state,
    userConsentsLoading: false,
    userConsentsError: true,
  })),

  on(UserProfileActions.updateUserProfile, (state) => ({
    ...state,
    updateUserProfileLoading: true,
    updateUserProfileError: false,
  })),
  on(UserProfileActions.updateUserProfileSuccess, (state, action) => ({
    ...state,
    userProfile: action.data,
    updateUserProfileLoading: false,
  })),
  on(UserProfileActions.updateUserProfileFailure, (state) => ({
    ...state,
    updateUserProfileLoading: false,
    updateUserProfileError: true,
  })),

  on(UserProfileActions.updateUserConsents, (state) => ({
    ...state,
    updateUserConsentsLoading: true,
    updateUserConsentsError: false,
  })),
  on(UserProfileActions.updateUserConsentsSuccess, (state) => ({
    ...state,
    updateUserConsentsLoading: false,
  })),
  on(UserProfileActions.updateUserConsentsFailure, (state) => ({
    ...state,
    updateUserConsentsLoading: false,
    updateUserConsentsError: true,
  })),
  on(UserProfileActions.sessionExpired, (state) => ({
    ...state,
    userProfile: null,
    updateUserConsentsError: true,
    temporary: false,
  })),

  on(UserProfileActions.spidConfirm, (state) => ({
    ...state,
    spidConfirmLoading: true,
    spidConfirmError: false,
  })),
  on(UserProfileActions.spidConfirmSuccess, (state) => ({
    ...state,
    spidConfirmLoading: false,
  })),
  on(UserProfileActions.spidConfirmFailure, (state) => ({
    ...state,
    spidConfirmLoading: false,
    spidConfirmError: true,
  })),
);
