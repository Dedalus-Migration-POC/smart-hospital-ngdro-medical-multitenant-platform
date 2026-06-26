import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTripletReport from './reducer';

export const selectTripletReportState = createFeatureSelector<fromTripletReport.State>(
  fromTripletReport.featureKey,
);

export const selectTripletReport = createSelector(
  selectTripletReportState,
  (state) => state.report,
);
export const selectTripletReportLoading = createSelector(
  selectTripletReportState,
  (state) => state.reportLoading,
);
export const selectTripletReportError = createSelector(
  selectTripletReportState,
  (state) => state.reportError,
);

export const selectDownloadedReport = createSelector(
  selectTripletReportState,
  (state) => state.downloadedReport,
);
export const selectDownloadedReportLoading = createSelector(
  selectTripletReportState,
  (state) => state.downloadedReportLoading,
);
export const selectDownloadedReportError = createSelector(
  selectTripletReportState,
  (state) => state.downloadedReportError,
);
