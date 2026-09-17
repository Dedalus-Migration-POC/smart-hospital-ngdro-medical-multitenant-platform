import { createAction, props } from '@ngrx/store';
import {
  ConsentsA4H,
  ConsentsA4hAddPayload,
  ConsentsA4hRevokePayload,
  ConsentsA4hAddRevokeResponse,
  RequestUserA4HPrivacyConsentPayload,
  ResponseUserA4HPrivacyConsent,
} from './model';

export const fetchUserA4hPrivacyConsent = createAction(
  '[ConsentsA4H] Fetch User A4H Privacy Consent',
  props<{ payload: RequestUserA4HPrivacyConsentPayload }>(),
);

export const fetchUserA4hPrivacyConsentSuccess = createAction(
  '[ConsentsA4H] Fetch User A4H Privacy Consent Success',
  props<{ data: ResponseUserA4HPrivacyConsent }>(),
);

export const fetchUserA4hPrivacyConsentFailure = createAction(
  '[ConsentsA4H] Fetch User A4H Privacy Consent Failure',
  props<{ error: any }>(),
);

export const updateUserA4hPrivacyConsent = createAction(
  '[ConsentsA4H] Update User A4H Privacy Consent',
  props<{ payload: RequestUserA4HPrivacyConsentPayload }>(),
);

export const updateUserA4hPrivacyConsentSuccess = createAction(
  '[ConsentsA4H] Update User A4H Privacy Consent Success',
  props<{ data: ResponseUserA4HPrivacyConsent }>(),
);

export const updateUserA4hPrivacyConsentFailure = createAction(
  '[ConsentsA4H] Update User A4H Privacy Consent Failure',
  props<{ error: any }>(),
);

export const fetchConsentsA4h = createAction('[ConsentsA4H] Fetch Consents A4H');

export const fetchConsentsA4hSuccess = createAction(
  '[ConsentsA4H] Fetch Consents A4H Success',
  props<{ data: ConsentsA4H[] }>(),
);

export const fetchConsentsA4hFailure = createAction(
  '[ConsentsA4H] Fetch Consents A4H Failure',
  props<{ error: any }>(),
);

export const updateConsentA4h = createAction(
  '[ConsentsA4H] Update Consent A4H',
  props<{ payload: ConsentsA4hAddPayload | ConsentsA4hRevokePayload }>(),
);

export const updateConsentA4hSuccess = createAction(
  '[ConsentsA4H] Update Consent A4H Success',
  props<{ data: ConsentsA4hAddRevokeResponse }>(),
);

export const updateConsentA4hFailure = createAction(
  '[ConsentsA4H] Update Consent A4H Failure',
  props<{ error: any }>(),
);
