import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromReportsAndDocuments from './reducer';

export const selectReportsAndDocumentsState = createFeatureSelector<fromReportsAndDocuments.State>(
  fromReportsAndDocuments.featureKey,
);

export const selectReportsAndDocumentsList = createSelector(
  selectReportsAndDocumentsState,
  (state) => state.reportsAndDocumentsList,
);
export const selectReportsAndDocumentsListLoading = createSelector(
  selectReportsAndDocumentsState,
  (state) => state.loading,
);
export const selectReportsAndDocumentsListError = createSelector(
  selectReportsAndDocumentsState,
  (state) => state.error,
);

export const selectdocumentsTypes = createSelector(
  selectReportsAndDocumentsState,
  (state) => state.documentsTypes,
);
export const selectdocumentsTypesLoading = createSelector(
  selectReportsAndDocumentsState,
  (state) => state.documentsTypesLoading,
);
export const selectdocumentsTypesError = createSelector(
  selectReportsAndDocumentsState,
  (state) => state.documentsTypesError,
);

export const selectReportsAndDocumentsDetails = createSelector(
  selectReportsAndDocumentsState,
  (state) => state.reportsAndDocumentDetails,
);
export const selectReportsAndDocumentsDetailsLoading = createSelector(
  selectReportsAndDocumentsState,
  (state) => state.documentDetailsLoading,
);
export const selectReportsAndDocumentsDetailsError = createSelector(
  selectReportsAndDocumentsState,
  (state) => state.documentDetailsError,
);
