import { createReducer, on } from '@ngrx/store';
import { UserProfile } from 'src/app/pages/user-profile/user-profile.model';
import * as CredentialsActions from './credentials.actions';
import {
  CredentialsLoginStep,
  CredentialsRegistrationError,
  RegistrationAttribute,
  RegistrationConsent,
} from './credentials.model';

export const featureKey = 'credentialsState';

interface LoginProfileState {
  loginProfileCode: string | null;
  loginProfile: UserProfile | null;
  loginProfileLoading: boolean;
  loginProfileError: unknown | null;
  loginProfileUpdateLoading: boolean;
  loginProfileUpdateError: CredentialsRegistrationError | null;
}

const initialLoginProfileState: LoginProfileState = {
  loginProfileCode: null,
  loginProfile: null,
  loginProfileLoading: false,
  loginProfileError: null,
  loginProfileUpdateLoading: false,
  loginProfileUpdateError: null,
};

export interface State extends LoginProfileState {
  resetPasswordLoading: boolean;
  resetPasswordSuccess: boolean;
  resetPasswordError: unknown | null;

  changePasswordLoading: boolean;
  changePasswordSuccess: boolean;
  changePasswordError: unknown | null;

  registrationAttributes: RegistrationAttribute[];
  registrationAttributesLoading: boolean;
  registrationAttributesError: boolean;

  registrationConsents: RegistrationConsent[];
  registrationConsentsLoading: boolean;
  registrationConsentsError: boolean;

  registrationLoading: boolean;
  registrationSuccess: boolean;
  registrationError: CredentialsRegistrationError | null;

  loginLoading: boolean;
  loginSuccess: boolean;
  loginError: unknown | null;

  confirmLoginLoading: boolean;
  confirmLoginSuccess: boolean;
  confirmLoginError: unknown | null;

  loginStep: CredentialsLoginStep;
  loginOtpCode: string | null;
  loginOtpExpiresOn: number | null;
}

export const initialState: State = {
  ...initialLoginProfileState,
  resetPasswordLoading: false,
  resetPasswordSuccess: false,
  resetPasswordError: null,
  changePasswordLoading: false,
  changePasswordSuccess: false,
  changePasswordError: null,
  registrationAttributes: [],
  registrationAttributesLoading: false,
  registrationAttributesError: false,

  registrationConsents: [],
  registrationConsentsLoading: false,
  registrationConsentsError: false,

  registrationLoading: false,
  registrationSuccess: false,
  registrationError: null,

  loginLoading: false,
  loginSuccess: false,
  loginError: null,

  confirmLoginLoading: false,
  confirmLoginSuccess: false,
  confirmLoginError: null,

  loginStep: 'CREDENTIALS',
  loginOtpCode: null,
  loginOtpExpiresOn: null,
};

export const reducer = createReducer(
  initialState,
  on(CredentialsActions.resetPassword, (state) => ({
    ...state,
    resetPasswordLoading: true,
    resetPasswordSuccess: false,
    resetPasswordError: null,
  })),
  on(CredentialsActions.resetPasswordSuccess, (state) => ({
    ...state,
    resetPasswordLoading: false,
    resetPasswordSuccess: true,
    resetPasswordError: null,
  })),
  on(CredentialsActions.resetPasswordFailure, (state, { error }) => ({
    ...state,
    resetPasswordLoading: false,
    resetPasswordSuccess: false,
    resetPasswordError: error,
  })),
  on(CredentialsActions.clearResetPassword, (state) => ({
    ...state,
    resetPasswordLoading: false,
    resetPasswordSuccess: false,
    resetPasswordError: null,
  })),
  on(CredentialsActions.changePassword, (state) => ({
    ...state,
    changePasswordLoading: true,
    changePasswordSuccess: false,
    changePasswordError: null,
  })),
  on(CredentialsActions.changePasswordSuccess, (state) => ({
    ...state,
    changePasswordLoading: false,
    changePasswordSuccess: true,
    changePasswordError: null,
  })),
  on(CredentialsActions.changePasswordFailure, (state, { error }) => ({
    ...state,
    changePasswordLoading: false,
    changePasswordSuccess: false,
    changePasswordError: error,
  })),
  on(CredentialsActions.clearChangePassword, (state) => ({
    ...state,
    changePasswordLoading: false,
    changePasswordSuccess: false,
    changePasswordError: null,
  })),
  on(CredentialsActions.login, (state) => ({
    ...state,
    ...initialLoginProfileState,
    loginLoading: true,
    loginSuccess: false,
    loginError: null,
    confirmLoginLoading: false,
    confirmLoginSuccess: false,
    confirmLoginError: null,
    loginStep: 'CREDENTIALS' as const,
    loginOtpCode: null,
    loginOtpExpiresOn: null,
  })),
  on(CredentialsActions.loginOtpRequired, (state, action) => ({
    ...state,
    ...initialLoginProfileState,
    loginLoading: false,
    loginSuccess: false,
    loginError: null,
    confirmLoginLoading: false,
    confirmLoginSuccess: false,
    confirmLoginError: null,
    loginStep: 'OTP' as const,
    loginOtpCode: action.code,
    loginOtpExpiresOn: action.expiresOn ?? null,
  })),
  on(CredentialsActions.confirmLogin, (state) => ({
    ...state,
    confirmLoginLoading: true,
    confirmLoginSuccess: false,
    confirmLoginError: null,
  })),
  on(CredentialsActions.confirmLoginFailure, (state, action) => ({
    ...state,
    confirmLoginLoading: false,
    confirmLoginSuccess: false,
    confirmLoginError: action.error,
  })),
  on(CredentialsActions.loginSuccess, (state) => ({
    ...state,
    loginLoading: false,
    loginSuccess: true,
    loginError: null,
    loginStep:
      state.loginStep === 'OTP' || state.loginStep === 'REQUIRE_PROFILE_DOWNLOAD'
        ? state.loginStep
        : ('AUTHENTICATED' as const),
    loginOtpCode: state.loginStep === 'OTP' ? state.loginOtpCode : null,
    loginOtpExpiresOn: state.loginStep === 'OTP' ? state.loginOtpExpiresOn : null,
  })),
  on(CredentialsActions.confirmLoginSuccess, (state) => ({
    ...state,
    ...initialLoginProfileState,
    confirmLoginLoading: false,
    confirmLoginSuccess: true,
    confirmLoginError: null,
    loginStep: 'AUTHENTICATED' as const,
    loginOtpCode: null,
    loginOtpExpiresOn: null,
  })),
  on(CredentialsActions.loginFailure, (state, action) => ({
    ...state,
    ...initialLoginProfileState,
    loginLoading: false,
    loginSuccess: false,
    loginError: action.error,
    confirmLoginLoading: false,
    confirmLoginSuccess: false,
    confirmLoginError: null,
    loginStep: 'CREDENTIALS' as const,
    loginOtpCode: null,
    loginOtpExpiresOn: null,
  })),
  on(CredentialsActions.loginOtpInvalid, (state, action) => ({
    ...state,
    ...initialLoginProfileState,
    loginLoading: false,
    loginSuccess: false,
    loginError: null,
    confirmLoginLoading: false,
    confirmLoginSuccess: false,
    confirmLoginError: action.error,
    loginStep: 'CREDENTIALS' as const,
    loginOtpCode: null,
    loginOtpExpiresOn: null,
  })),
  on(CredentialsActions.resetLogin, (state) => ({
    ...state,
    ...initialLoginProfileState,
    loginLoading: false,
    loginSuccess: false,
    loginError: null,
    confirmLoginLoading: false,
    confirmLoginSuccess: false,
    confirmLoginError: null,
    loginStep: 'CREDENTIALS' as const,
    loginOtpCode: null,
    loginOtpExpiresOn: null,
  })),
  on(CredentialsActions.loginProfileRequired, (state, { code }) => ({
    ...state,
    ...initialLoginProfileState,
    loginStep: 'REQUIRE_PROFILE_DOWNLOAD' as const,
    loginLoading: false,
    loginSuccess: false,
    loginError: null,
    loginOtpCode: null,
    loginOtpExpiresOn: null,
    confirmLoginLoading: false,
    confirmLoginSuccess: false,
    confirmLoginError: null,
    loginProfileCode: code,
    loginProfileLoading: true,
  })),
  on(CredentialsActions.fetchLoginProfileSuccess, (state, { data }) => ({
    ...state,
    loginProfile: data,
    loginProfileCode: data.code ?? null,
    loginProfileLoading: false,
    loginProfileError: null,
  })),
  on(CredentialsActions.fetchLoginProfileFailure, (state, { error }) => ({
    ...state,
    loginProfileLoading: false,
    loginProfileError: error,
  })),
  on(CredentialsActions.updateLoginProfile, (state) => ({
    ...state,
    loginProfileUpdateLoading: true,
    loginProfileUpdateError: null,
    confirmLoginError: null,
  })),
  on(CredentialsActions.updateLoginProfileSuccess, (state, { data }) => ({
    ...state,
    loginProfile: data,
    loginProfileCode: data.code ?? null,
    loginProfileUpdateLoading: false,
    loginProfileUpdateError: null,
  })),
  on(CredentialsActions.updateLoginProfileFailure, (state, { error }) => ({
    ...state,
    loginProfileUpdateLoading: false,
    loginProfileUpdateError: error,
  })),
  on(CredentialsActions.fetchRegistrationAttributes, (state) => ({
    ...state,
    registrationAttributes: [],
    registrationAttributesLoading: true,
    registrationAttributesError: false,
  })),
  on(CredentialsActions.fetchRegistrationAttributesSuccess, (state, action) => ({
    ...state,
    registrationAttributes: action.data,
    registrationAttributesLoading: false,
    registrationAttributesError: false,
  })),
  on(CredentialsActions.fetchRegistrationAttributesFailure, (state) => ({
    ...state,
    registrationAttributesLoading: false,
    registrationAttributesError: true,
  })),

  on(CredentialsActions.fetchRegistrationConsents, (state) => ({
    ...state,
    registrationConsents: [],
    registrationConsentsLoading: true,
    registrationConsentsError: false,
  })),
  on(CredentialsActions.fetchRegistrationConsentsSuccess, (state, action) => ({
    ...state,
    registrationConsents: action.data,
    registrationConsentsLoading: false,
    registrationConsentsError: false,
  })),
  on(CredentialsActions.fetchRegistrationConsentsFailure, (state) => ({
    ...state,
    registrationConsentsLoading: false,
    registrationConsentsError: true,
  })),

  on(CredentialsActions.register, (state) => ({
    ...state,
    registrationLoading: true,
    registrationSuccess: false,
    registrationError: null,
  })),
  on(CredentialsActions.registerSuccess, (state) => ({
    ...state,
    registrationLoading: false,
    registrationSuccess: true,
    registrationError: null,
  })),
  on(CredentialsActions.registerFailure, (state, action) => ({
    ...state,
    registrationLoading: false,
    registrationSuccess: false,
    registrationError: action.error,
  })),
  on(CredentialsActions.resetRegistration, (state) => ({
    ...state,
    registrationLoading: false,
    registrationSuccess: false,
    registrationError: null,
  })),
);
