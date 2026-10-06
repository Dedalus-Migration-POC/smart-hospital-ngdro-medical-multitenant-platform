import { createAction, props } from '@ngrx/store';
import {
  CredentialsRegistrationError,
  CredentialsRegistrationRequest,
  RegistrationAttribute,
  RegistrationConsent,
} from './credentials.model';

export const fetchRegistrationAttributes = createAction(
  '[Credentials] Fetch RegistrationAttributes',
);

export const fetchRegistrationAttributesSuccess = createAction(
  '[Credentials] Fetch RegistrationAttributes Success',
  props<{ data: RegistrationAttribute[] }>(),
);

export const fetchRegistrationAttributesFailure = createAction(
  '[Credentials] Fetch RegistrationAttributes Failure',
  props<{ error: unknown }>(),
);

export const fetchRegistrationConsents = createAction('[Credentials] Fetch RegistrationConsents');

export const fetchRegistrationConsentsSuccess = createAction(
  '[Credentials] Fetch RegistrationConsents Success',
  props<{ data: RegistrationConsent[] }>(),
);

export const fetchRegistrationConsentsFailure = createAction(
  '[Credentials] Fetch RegistrationConsents Failure',
  props<{ error: unknown }>(),
);

export const register = createAction(
  '[Credentials] Register',
  props<{ data: CredentialsRegistrationRequest }>(),
);

export const registerSuccess = createAction('[Credentials] Register Success');

export const registerFailure = createAction(
  '[Credentials] Register Failure',
  props<{ error: CredentialsRegistrationError }>(),
);

export const resetRegistration = createAction('[Credentials] Reset Registration');
