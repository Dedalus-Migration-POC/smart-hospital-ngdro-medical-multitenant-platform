import { createAction, props } from '@ngrx/store';
import { DownloadTripletReportRequest, ReportTriplet, TripletReportRequest } from './model';

export const fetchReport = createAction(
  '[TripletReport] Fetch Report',
  props<{ payload: TripletReportRequest }>(),
);

export const fetchReportSuccess = createAction(
  '[TripletReport] Fetch Report Success',
  props<{ data: ReportTriplet[] | null }>(),
);

export const fetchReportFailure = createAction(
  '[TripletReport] Fetch Report Failure',
  props<{ error: any }>(),
);

export const downloadTripletReport = createAction(
  '[TripletReport] Download TripletReport Attachment',
  props<{ payload: { data: DownloadTripletReportRequest; isDownload: boolean } }>(),
);

export const downloadTripletReportSuccess = createAction(
  '[TripletReport]  Download TripletReport Success',
  props<{ data: any }>(),
);

export const downloadTripletReportFailure = createAction(
  '[TripletReport]  Download TripletReport Failure',
  props<{ error: any }>(),
);

export const resetTripletReportState = createAction('[TripletReport] Reset State');
