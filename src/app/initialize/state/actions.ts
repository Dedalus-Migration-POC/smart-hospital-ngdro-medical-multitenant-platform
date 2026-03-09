import { createAction, props } from '@ngrx/store';
import { AppConfig } from './model';

export const setAppConfig = createAction(
  '[InitializeApp] Set AppConfig',
  props<{ data: AppConfig }>(),
);

export const setAppConfigFailure = createAction(
  '[InitializeApp] Set AppConfig Failure',
  props<{ error: unknown }>(),
);
