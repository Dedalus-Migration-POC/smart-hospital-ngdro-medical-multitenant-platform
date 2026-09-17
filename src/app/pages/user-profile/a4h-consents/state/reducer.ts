import { createReducer, on } from '@ngrx/store';
import { ConsentsA4H, ResponseUserA4HPrivacyConsent } from './model';
import * as ConsentsA4HActions from './actions';

export const featureKey = 'consentsA4HState';

export interface State {
  userA4hPrivacyConsent: ResponseUserA4HPrivacyConsent | null;
  userA4hPrivacyConsentLoading: boolean;
  userA4hPrivacyConsentError: boolean;

  updateUserA4hPrivacyConsent: ResponseUserA4HPrivacyConsent | null;
  updateUserA4hPrivacyConsentLoading: boolean;
  updateUserA4hPrivacyConsentError: boolean;

  consentsA4h: ConsentsA4H[] | null;
  consentsA4hLoading: boolean;
  consentsA4hError: boolean;

  updateConsentsA4hLoading: boolean;
  updateConsentsA4hError: boolean;
}

export const initialState: State = {
  userA4hPrivacyConsent: null,
  userA4hPrivacyConsentLoading: false,
  userA4hPrivacyConsentError: false,

  updateUserA4hPrivacyConsent: null,
  updateUserA4hPrivacyConsentLoading: false,
  updateUserA4hPrivacyConsentError: false,

  consentsA4h: null,
  consentsA4hLoading: false,
  consentsA4hError: false,
  updateConsentsA4hLoading: false,
  updateConsentsA4hError: false,
};

export const reducer = createReducer(
  initialState,

  //-----------consents A4H-----------------------
  on(ConsentsA4HActions.fetchUserA4hPrivacyConsent, (state) => ({
    ...state,
    userA4hPrivacyConsent: null,
    userA4hPrivacyConsentLoading: true,
    userA4hPrivacyConsentError: false,
  })),
  on(ConsentsA4HActions.fetchUserA4hPrivacyConsentSuccess, (state, action) => ({
    ...state,
    userA4hPrivacyConsentLoading: false,
    userA4hPrivacyConsent: action.data,
  })),
  on(ConsentsA4HActions.fetchUserA4hPrivacyConsentFailure, (state) => ({
    ...state,
    userA4hPrivacyConsentLoading: false,
    userA4hPrivacyConsentError: true,
  })),

  on(ConsentsA4HActions.updateUserA4hPrivacyConsent, (state) => ({
    ...state,
    updateUserA4hPrivacyConsent: null,
    updateUserA4hPrivacyConsentLoading: true,
    updateUserA4hPrivacyConsentError: false,
  })),
  on(ConsentsA4HActions.updateUserA4hPrivacyConsentSuccess, (state, action) => ({
    ...state,
    updateUserA4hPrivacyConsentLoading: false,
    updateUserA4hPrivacyConsent: action.data,
  })),
  on(ConsentsA4HActions.updateUserA4hPrivacyConsentFailure, (state) => ({
    ...state,
    updateUserA4hPrivacyConsentLoading: false,
    updateUserA4hPrivacyConsentError: true,
  })),
  //-----------fine consents A4H-----------------------
  on(ConsentsA4HActions.fetchConsentsA4h, (state) => ({
    ...state,
    consentsA4h: null,
    consentsA4hLoading: true,
    consentsA4hError: false,
  })),
  on(ConsentsA4HActions.fetchConsentsA4hSuccess, (state, action) => ({
    ...state,
    consentsA4hLoading: false,
    consentsA4h: action.data,
  })),
  on(ConsentsA4HActions.fetchConsentsA4hFailure, (state) => ({
    ...state,
    consentsA4hLoading: false,
    consentsA4hError: true,
  })),

  on(ConsentsA4HActions.updateConsentA4h, (state) => ({
    ...state,
    updateConsentsA4hLoading: true,
    updateConsentsA4hError: false,
  })),
  on(ConsentsA4HActions.updateConsentA4hSuccess, (state, action) => ({
    ...state,
    updateConsentsA4hLoading: false,
    updateConsentsA4hError: false,
  })),
  on(ConsentsA4HActions.updateConsentA4hFailure, (state) => ({
    ...state,
    updateConsentsA4hLoading: false,
    updateConsentsA4hError: true,
  })),
);
