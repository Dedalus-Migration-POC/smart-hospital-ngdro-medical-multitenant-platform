import { createReducer, on } from '@ngrx/store';
import * as InitializeAppActions from './actions';

export const featureKey = 'initializeAppState';

export interface State {
  appConfig: any;
  appConfigLoading: boolean;
  appConfigError: boolean;
}

export const initialState: State = {
  appConfig: null,
  appConfigLoading: false,
  appConfigError: false,
};

export const reducer = createReducer(
  initialState,

  on(InitializeAppActions.setAppConfig, (state, action) => ({
    ...state,
    appConfig: action.data,
    appConfigLoading: false,
    appConfigError: false,
  })),

  on(InitializeAppActions.setAppConfigFailure, (state) => ({
    ...state,
    appConfigLoading: false,
    appConfigError: true,
  })),
);
