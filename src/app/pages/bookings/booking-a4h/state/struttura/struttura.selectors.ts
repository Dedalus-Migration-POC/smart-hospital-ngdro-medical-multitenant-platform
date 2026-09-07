import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureKey, StrutturaState } from './struttura.reducer';

const selectStrutturaState = createFeatureSelector<StrutturaState>(featureKey);

export const selectAllStrutture = createSelector(selectStrutturaState, (state) => state.units);
export const selectStruttureLoading = createSelector(
  selectStrutturaState,
  (state) => state.loading,
);
export const selectStruttureError = createSelector(selectStrutturaState, (state) => state.error);
export const selectSelectedStruttura = createSelector(
  selectStrutturaState,
  (state) => state.selectedUnit,
);
