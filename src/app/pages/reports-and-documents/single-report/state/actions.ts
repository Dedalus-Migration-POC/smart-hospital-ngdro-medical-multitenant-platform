import { createAction, props } from '@ngrx/store';
import { IGetReportRequest, IGetReportSessionResponse, IReport, ReportEndpoint } from './model';

//---------fetchSingleReportSession-----
export const fetchSingleReportSession = createAction(
  '[SingleReport] Fetch SingleReport Session',
  props<{ payload: { cf: string; id: string; reportEndpoint: ReportEndpoint } }>(),
);

export const fetchSingleReportSessionSuccess = createAction(
  '[SingleReport] Fetch SingleReport Session Success',
  props<{ data: IGetReportSessionResponse | null }>(),
);

export const fetchSingleReportSessionFailure = createAction(
  '[SingleReport] Fetch SingleReport Session Failure',
  props<{ error: any }>(),
);
//----------------------------------------
export const fetchSingleReport = createAction(
  '[SingleReport] Fetch SingleReport',
  props<{
    payload: {
      data: IGetReportRequest;
      reportEndpoint?: ReportEndpoint;
    };
  }>(),
);

export const fetchSingleReportSuccess = createAction(
  '[SingleReport] Fetch SingleReport Success',
  props<{ data: IReport[] | null }>(),
);

export const fetchSingleReportFailure = createAction(
  '[SingleReport] Fetch SingleReport Failure',
  props<{ error: any }>(),
);

export const downloadSingleReport = createAction(
  '[SingleReport] Download SingleReport Attachment',
  props<{
    payload: {
      data: {
        requestId: string;
        sessionId: string;
        attachmentId: string;
        reportId: string;
        decodeSignedBinary: boolean;
        responseType: 'link' | 'pdf';
        isDownload: boolean;
      };
      reportEndpoint?: ReportEndpoint;
    };
  }>(),
);

export const downloadSingleReportSuccess = createAction(
  '[SingleReport]  Download SingleReport Success',
  props<{ data: any }>(),
);

export const downloadSingleReportFailure = createAction(
  '[SingleReport]  Download SingleReport Failure',
  props<{ error: any }>(),
);
