import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './actions';
import { IGetReportSessionResponse, IReport } from './model';

export const featureKey = 'singleReportState';

export interface State {
  singleReport: IReport[] | null;
  singleReportLoading: boolean;
  singleReportError: boolean;

  singleReportSession: IGetReportSessionResponse | null;
  singleReportSessionLoading: boolean;
  singleReportSessionError: boolean;

  downloadedReport: any | null;
  downloadedReportLoading: boolean;
  downloadedReportError: boolean;
}

export const initialState: State = {
  singleReport: null,
  singleReportLoading: false,
  singleReportError: false,

  singleReportSession: null,
  singleReportSessionLoading: false,
  singleReportSessionError: false,

  downloadedReport: null,
  downloadedReportLoading: false,
  downloadedReportError: false,
};

export const reducer = createReducer(
  initialState,
  on(AuthActions.fetchSingleReport, (state) => ({
    ...state,
    singleReport: null,
    singleReportLoading: true,
    singleReportError: false,
  })),
  on(AuthActions.fetchSingleReportSuccess, (state, action) => ({
    ...state,
    singleReport: action.data,
    singleReportLoading: false,
  })),
  on(AuthActions.fetchSingleReportFailure, (state) => ({
    ...state,
    singleReportLoading: false,
    singleReportError: true,
  })),

  //------------------fetchSingleReportSession
  on(AuthActions.fetchSingleReportSession, (state) => ({
    ...state,
    singleReport: null,
    singleReportSessionLoading: true,
    singleReportSessionError: false,
  })),
  on(AuthActions.fetchSingleReportSessionSuccess, (state, action) => ({
    ...state,
    singleReportSession: action.data,
    singleReportSessionLoading: false,
  })),
  on(AuthActions.fetchSingleReportSessionFailure, (state) => ({
    ...state,
    singleReportSessionLoading: false,
    singleReportSessionError: true,
  })),
  //------------------
  on(AuthActions.downloadSingleReport, (state) => ({
    ...state,
    downloadedReport: null,
    downloadedReportLoading: true,
    downloadedReportError: false,
  })),
  on(AuthActions.downloadSingleReportSuccess, (state, action) => ({
    ...state,
    downloadedReport: action.data,
    downloadedReportLoading: false,
  })),
  on(AuthActions.downloadSingleReportFailure, (state) => ({
    ...state,
    downloadedReportLoading: false,
    downloadedReportError: true,
  })),
  on(AuthActions.resetSingleReportState, () => initialState),
);
