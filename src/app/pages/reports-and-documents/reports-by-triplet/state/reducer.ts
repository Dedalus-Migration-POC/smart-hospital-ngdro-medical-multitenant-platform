import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './actions';
import { ReportTriplet } from './model';

export const featureKey = 'tripletReportState';

export interface State {
  report: ReportTriplet[] | null;
  reportLoading: boolean;
  reportError: boolean;

  downloadedReport: any | null;
  downloadedReportLoading: boolean;
  downloadedReportError: boolean;
}

export const initialState: State = {
  report: null,
  reportLoading: false,
  reportError: false,

  downloadedReport: null,
  downloadedReportLoading: false,
  downloadedReportError: false,
};

export const reducer = createReducer(
  initialState,
  on(AuthActions.fetchReport, (state) => ({
    ...state,
    report: null,
    reportLoading: true,
    reportError: false,
  })),
  on(AuthActions.fetchReportSuccess, (state, action) => ({
    ...state,
    report: action.data,
    reportLoading: false,
  })),
  on(AuthActions.fetchReportFailure, (state) => ({
    ...state,
    reportLoading: false,
    reportError: true,
  })),

  on(AuthActions.downloadTripletReport, (state) => ({
    ...state,
    downloadedReport: null,
    downloadedReportLoading: true,
    downloadedReportError: false,
  })),
  on(AuthActions.downloadTripletReportSuccess, (state, action) => ({
    ...state,
    downloadedReport: action.data,
    downloadedReportLoading: false,
  })),
  on(AuthActions.downloadTripletReportFailure, (state) => ({
    ...state,
    downloadedReportLoading: false,
    downloadedReportError: true,
  })),
  on(AuthActions.resetTripletReportState, () => initialState),
);
