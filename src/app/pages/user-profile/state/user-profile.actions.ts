import { createAction, props } from '@ngrx/store';
import { UserConfig, UserConsent, UserProfile } from '../user-profile.model';

export const sessionRefreshed = createAction('[UserProfile] Session Refreshed');

export const sessionExpired = createAction('[UserProfile] Session Expired');

export const logout = createAction('[UserProfile] Logout');

export const login = createAction('[UserProfile] Login');

export const fetchUserProfile = createAction(
  '[UserProfile] Fetch UserProfile',
  (payload: { profileCode?: string } = {}) => payload,
);

export const fetchUserProfileSuccess = createAction(
  '[UserProfile] Fetch UserProfile Success',
  props<{ data: UserProfile; temporary?: boolean }>(),
);

export const fetchUserProfileFailure = createAction(
  '[UserProfile] Fetch UserProfile Failure',
  props<{ error: any }>(),
);

export const fetchUserConfig = createAction('[UserProfile] Fetch UserConfig');

export const fetchUserConfigSuccess = createAction(
  '[UserConfig] Fetch UserConfig Success',
  props<{ data: UserConfig }>(),
);

export const fetchUserConfigFailure = createAction(
  '[UserConfig] Fetch UserConfig Failure',
  props<{ error: any }>(),
);

export const fetchUserConsents = createAction('[UserProfile] Fetch UserConsents');

export const fetchUserConsentsSuccess = createAction(
  '[UserProfile] Fetch UserConsents Success',
  props<{ data: UserConsent[] }>(),
);

export const fetchUserConsentsFailure = createAction(
  '[UserProfile] Fetch UserConsents Failure',
  props<{ error: any }>(),
);

export const updateUserProfile = createAction(
  '[UserProfile] Update UserProfile',
  props<{ data: any }>(),
);

export const updateUserProfileSuccess = createAction(
  '[UserProfile] Update UserProfile Success',
  props<{ data: UserProfile }>(),
);

export const updateUserProfileFailure = createAction(
  '[UserProfile] Update UserProfile Failure',
  props<{ error: any }>(),
);

export const updateUserConsents = createAction(
  '[UserProfile] Update UserConsents',
  props<{ data: any }>(),
);

export const updateUserConsentsSuccess = createAction('[UserProfile] Update UserConsents Success');

export const updateUserConsentsFailure = createAction(
  '[UserProfile] Update UserConsents Failure',
  props<{ error: any }>(),
);

export const spidConfirm = createAction('[UserProfile] Spid Confirm', props<{ code: string }>());

export const spidConfirmSuccess = createAction('[UserProfile] Spid Confirm Success');

export const spidConfirmFailure = createAction(
  '[UserProfile] Spid Confirm Failure',
  props<{ error: any }>(),
);
