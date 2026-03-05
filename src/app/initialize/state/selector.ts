import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as initializeAppState from './reducer'


export const selectInitializeAppState =
    createFeatureSelector<initializeAppState.State>(initializeAppState.featureKey)

export const selectAppConfig = createSelector(
    selectInitializeAppState,
    (state) => state.appConfig,
)