import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as reducer from './remote-config.reducer';

export const selectRemoteConfigState = createFeatureSelector<reducer.RemoteConfigState>(
  reducer.featureKey,
);

export const selectRemoteConfigByKey = (key: string) =>
  createSelector(selectRemoteConfigState, (state) => state?.[key]);

export const selectFirebaseObject = (key: string) => selectRemoteConfigByKey(key);

//use: 'service_config' è il key in firebase, da cui si vuole leggere la configurazione.
// services = this.store.selectSignal(selectFirebaseObject('service_config'));
