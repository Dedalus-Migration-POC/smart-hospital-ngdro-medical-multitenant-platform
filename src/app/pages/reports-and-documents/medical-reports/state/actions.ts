import { createAction, props } from '@ngrx/store';
import { IDocuments, IDocumentsType } from './model';
// import { CardMultiUseConfig } from 'src/app/components/card/card.model'

// export const fetchCardMultiUseConfigReport = createAction(
//   '[ReportsAndDocuments] Fetch CardMultiUseConfigReport',
// )

// export const fetchCardMultiUseConfigReportSuccess = createAction(
//   '[ReportsAndDocuments] Fetch CardMultiUseConfigReport Success',
//   props<{ data: CardMultiUseConfig }>(),
// )

// export const CardMultiUseConfigReportFailure = createAction(
//   '[ReportsAndDocuments] Fetch CardMultiUseConfigReport Failure',
//   props<{ error: any }>(),
// )

export const fetchDocumentsTypes = createAction('[ReportsAndDocuments] Fetch DocumentsTypes');

export const fetchDocumentsTypesSuccess = createAction(
  '[ReportsAndDocuments] Fetch DocumentsTypes Success',
  props<{ data: IDocumentsType[] }>(),
);

export const fetchDocumentsTypesFailure = createAction(
  '[ReportsAndDocuments] Fetch DocumentsTypes Failure',
  props<{ error: any }>(),
);

export const fetchReportsAndDocuments = createAction(
  '[ReportsAndDocuments] Fetch ReportsAndDocuments',
  props<{ filter?: string }>(),
);

export const fetchReportsAndDocumentsSuccess = createAction(
  '[ReportsAndDocuments] Fetch ReportsAndDocuments Success',
  props<{ data: IDocuments[] }>(),
);

export const fetchReportsAndDocumentsFailure = createAction(
  '[ReportsAndDocuments] Fetch ReportsAndDocuments Failure',
  props<{ error: any }>(),
);

export const fetchReportsAndDocumentDetails = createAction(
  '[ReportsAndDocuments] Fetch ReportsAndDocumentDetails',
  props<{
    payload: { documentId: string; repositoryId: string; isDownload?: boolean };
  }>(),
);

export const fetchReportsAndDocumentDetailsSuccess = createAction(
  '[ReportsAndDocuments] Fetch ReportsAndDocumentDetails Success',
  props<{ data: any }>(),
);

export const fetchReportsAndDocumentDetailsFailure = createAction(
  '[ReportsAndDocuments] Fetch ReportsAndDocumentDetails Failure',
  props<{ error: any }>(),
);
