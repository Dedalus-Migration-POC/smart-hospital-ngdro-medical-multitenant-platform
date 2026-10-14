import { createAction, props } from '@ngrx/store';
import { UserProfile } from 'src/app/pages/user-profile/user-profile.model';
import {
  CredentialsChangePasswordRequest,
  CredentialsLoginConfirmRequest,
  CredentialsLoginRequest,
  CredentialsRegistrationError,
  CredentialsRegistrationRequest,
  CredentialsResetPasswordRequest,
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

export const resetPassword = createAction(
  '[Credentials] Reset Password',
  props<{ data: CredentialsResetPasswordRequest }>(),
);

export const resetPasswordSuccess = createAction('[Credentials] Reset Password Success');

export const resetPasswordFailure = createAction(
  '[Credentials] Reset Password Failure',
  props<{ error: unknown }>(),
);

export const clearResetPassword = createAction('[Credentials] Clear Reset Password');

export const changePassword = createAction(
  '[Credentials] Change Password',
  props<{ data: CredentialsChangePasswordRequest }>(),
);

export const changePasswordSuccess = createAction('[Credentials] Change Password Success');

export const changePasswordFailure = createAction(
  '[Credentials] Change Password Failure',
  props<{ error: unknown }>(),
);

export const clearChangePassword = createAction('[Credentials] Clear Change Password');

export const login = createAction(
  '[Credentials] Login',
  props<{ data: CredentialsLoginRequest }>(),
);

export const loginSuccess = createAction('[Credentials] Login Success');

export const loginOtpRequired = createAction(
  '[Credentials] Login OTP Required',
  props<{ code: string; expiresOn?: number }>(),
);

export const loginFailure = createAction(
  '[Credentials] Login Failure',
  props<{ error: unknown }>(),
);

export const resetLogin = createAction('[Credentials] Reset Login');

export const confirmLogin = createAction(
  '[Credentials] Confirm Login',
  props<{ data: CredentialsLoginConfirmRequest }>(),
);

export const resendOtp = createAction('[Credentials] Resend OTP', props<{ code: string }>());

export const resendOtpSuccess = createAction(
  '[Credentials] Resend OTP Success',
  props<{ code: string; expiresOn?: number }>(),
);

export const resendOtpFailure = createAction(
  '[Credentials] Resend OTP Failure',
  props<{ error: unknown }>(),
);

export const confirmLoginSuccess = createAction('[Credentials] Confirm Login Success');

export const confirmLoginFailure = createAction(
  '[Credentials] Confirm Login Failure',
  props<{ error: unknown }>(),
);

export const loginOtpInvalid = createAction(
  '[Credentials] Login OTP Invalid',
  props<{ error: unknown }>(),
);

export const loginProfileRequired = createAction(
  '[Credentials] Login Profile Required',
  props<{ code: string }>(),
);

export const fetchLoginProfileSuccess = createAction(
  '[Credentials] Fetch Login Profile Success',
  props<{ data: UserProfile }>(),
);

export const fetchLoginProfileFailure = createAction(
  '[Credentials] Fetch Login Profile Failure',
  props<{ error: unknown }>(),
);

export const updateLoginProfile = createAction(
  '[Credentials] Update Login Profile',
  props<{ data: UserProfile }>(),
);

export const updateLoginProfileSuccess = createAction(
  '[Credentials] Update Login Profile Success',
  props<{ data: UserProfile }>(),
);

export const updateLoginProfileFailure = createAction(
  '[Credentials] Update Login Profile Failure',
  props<{ error: CredentialsRegistrationError }>(),
);
