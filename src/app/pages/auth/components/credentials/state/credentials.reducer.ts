import { createReducer, on } from '@ngrx/store';
import * as CredentialsActions from './credentials.actions';
import {
  CredentialsRegistrationError,
  RegistrationAttribute,
  RegistrationConsent,
} from './credentials.model';

export const featureKey = 'credentialsState';

export interface State {
  registrationAttributes: RegistrationAttribute[];
  registrationAttributesLoading: boolean;
  registrationAttributesError: boolean;

  registrationConsents: RegistrationConsent[];
  registrationConsentsLoading: boolean;
  registrationConsentsError: boolean;

  registrationLoading: boolean;
  registrationSuccess: boolean;
  registrationError: CredentialsRegistrationError | null;
}

export const initialState: State = {
  registrationAttributes: [],
  registrationAttributesLoading: false,
  registrationAttributesError: false,

  registrationConsents: [],
  registrationConsentsLoading: false,
  registrationConsentsError: false,

  registrationLoading: false,
  registrationSuccess: false,
  registrationError: null,
};

export const reducer = createReducer(
  initialState,
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
