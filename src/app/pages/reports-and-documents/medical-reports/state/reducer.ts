import { createReducer, on } from '@ngrx/store';
import * as ReportsAndDocumentsActions from './actions';
import { IDocuments, IDocumentsType } from './model';
// import { CardMultiUseConfig } from 'src/app/components/card/card.model';

export const featureKey = 'reportsAndDocuments';

export interface State {
  reportsAndDocumentsList: IDocuments[];
  loading: boolean;
  error: boolean;
  reportsAndDocumentDetails: any;
  documentDetailsLoading: boolean;
  documentDetailsError: boolean;
  documentsTypes: IDocumentsType[];
  documentsTypesLoading: boolean;
  documentsTypesError: boolean;
}

export const initialState: State = {
  reportsAndDocumentsList: [],
  loading: false,
  error: false,
  reportsAndDocumentDetails: null,
  documentDetailsLoading: false,
  documentDetailsError: false,
  documentsTypes: [],
  documentsTypesLoading: false,
  documentsTypesError: false,
};

export const reducer = createReducer(
  initialState,

  on(ReportsAndDocumentsActions.fetchReportsAndDocuments, (state) => ({
    ...state,
    error: false,
    loading: true,
  })),
  on(ReportsAndDocumentsActions.fetchReportsAndDocumentsSuccess, (state, action) => ({
    ...state,
    reportsAndDocumentsList: action.data,
    error: false,
    loading: false,
  })),
  on(ReportsAndDocumentsActions.fetchReportsAndDocumentsFailure, (state, action) => ({
    ...state,
    error: true,
    loading: false,
  })),

  on(ReportsAndDocumentsActions.fetchDocumentsTypes, (state) => ({
    ...state,
    documentsTypesError: false,
    documentsTypesLoading: true,
  })),
  on(ReportsAndDocumentsActions.fetchDocumentsTypesSuccess, (state, action) => ({
    ...state,
    documentsTypes: action.data,
    documentsTypesError: false,
    documentsTypesLoading: false,
  })),
  on(ReportsAndDocumentsActions.fetchDocumentsTypesFailure, (state) => ({
    ...state,
    documentsTypesError: true,
    documentsTypesLoading: false,
  })),

  on(ReportsAndDocumentsActions.fetchReportsAndDocumentDetails, (state) => ({
    ...state,
    documentDetailsError: false,
    documentDetailsLoading: true,
  })),
  on(ReportsAndDocumentsActions.fetchReportsAndDocumentDetailsSuccess, (state, action) => ({
    ...state,
    reportsAndDocumentDetails: action.data,
    documentDetailsError: false,
    documentDetailsLoading: false,
  })),
  on(ReportsAndDocumentsActions.fetchReportsAndDocumentDetailsFailure, (state, action) => ({
    ...state,
    documentDetailsError: true,
    documentDetailsLoading: false,
  })),
);
