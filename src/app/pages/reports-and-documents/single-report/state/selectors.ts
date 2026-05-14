import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSingleReport from './reducer';

export const selectSingleReportState = createFeatureSelector<fromSingleReport.State>(
  fromSingleReport.featureKey,
);

export const selectSingleReport = createSelector(
  selectSingleReportState,
  (state) => state.singleReport,
);
export const selectSingleReportLoading = createSelector(
  selectSingleReportState,
  (state) => state.singleReportLoading,
);
export const selectSingleReportError = createSelector(
  selectSingleReportState,
  (state) => state.singleReportError,
);

export const selectSingleReportSession = createSelector(
  selectSingleReportState,
  (state) => state.singleReportSession,
);
export const selectSingleReportSessionLoading = createSelector(
  selectSingleReportState,
  (state) => state.singleReportSessionLoading,
);
export const selectSingleReportSessionError = createSelector(
  selectSingleReportState,
  (state) => state.singleReportSessionError,
);

export const selectDownloadedReport = createSelector(
  selectSingleReportState,
  (state) => state.downloadedReport,
);
export const selectDownloadedReportLoading = createSelector(
  selectSingleReportState,
  (state) => state.downloadedReportLoading,
);
export const selectDownloadedReportError = createSelector(
  selectSingleReportState,
  (state) => state.downloadedReportError,
);
