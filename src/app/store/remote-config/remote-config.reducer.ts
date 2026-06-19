import { createReducer, on } from '@ngrx/store';
import * as Actions from './remote-config.actions';

export const featureKey = 'remoteConfig';

export type RemoteConfigState = Record<string, any>;

export const remoteConfigInitialState: RemoteConfigState = {};

export const reducer = createReducer<RemoteConfigState>(
  remoteConfigInitialState,
  on(
    Actions.update,
    (state, action): RemoteConfigState => ({
      ...state,
      [action.path]: action.value,
    }),
  ),
);
