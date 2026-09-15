import { createAction, props } from '@ngrx/store';
import {
  RequestUserA4HPrivacyConsentPayload,
  ResponseUserA4HPrivacyConsent,
  UserConsent,
  UserProfile,
} from '../user-profile.model';

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

//-----------consents A4H-----------
export const fetchUserA4hPrivacyConsent = createAction(
  '[UserProfile] Fetch User A4H Privacy Consent',
  props<{ payload: RequestUserA4HPrivacyConsentPayload }>(),
);

export const fetchUserA4hPrivacyConsentSuccess = createAction(
  '[UserProfile] Fetch User A4H Privacy Consent Success',
  props<{ data: ResponseUserA4HPrivacyConsent }>(),
);

export const fetchUserA4hPrivacyConsentFailure = createAction(
  '[UserProfile] Fetch User A4H Privacy Consent Failure',
  props<{ error: any }>(),
);

export const updateUserA4hPrivacyConsent = createAction(
  '[UserProfile] Update User A4H Privacy Consent',
  props<{ payload: RequestUserA4HPrivacyConsentPayload }>(),
);

export const updateUserA4hPrivacyConsentSuccess = createAction(
  '[UserProfile] Update User A4H Privacy Consent Success',
  props<{ data: ResponseUserA4HPrivacyConsent }>(),
);

export const updateUserA4hPrivacyConsentFailure = createAction(
  '[UserProfile] Update User A4H Privacy Consent Failure',
  props<{ error: any }>(),
);
//-----------fine consents A4H-----------------------
