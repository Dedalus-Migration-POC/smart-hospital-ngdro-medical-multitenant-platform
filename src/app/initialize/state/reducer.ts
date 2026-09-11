import { createReducer, on } from '@ngrx/store';
import * as InitializeAppActions from './actions';
import { AppConfig } from './app-config.model';

export const featureKey = 'initializeAppState';

// sono settati qui e non in un service perche' theme/header/footer/cookieConsent ecc. sono letti da
// componenti condivisi usati su ogni pagina (card, breadcrumb, link, modal...): un'unica
// fetch all'avvio (APP_INITIALIZER) evita a ciascuno di gestire da se' loading/null/errore.
export interface State {
  appConfig: AppConfig | null;
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
