import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as ReportsAndDocumentsActions from './actions';
import { ReportsAndDocumentsService } from './service';
// import { CardMultiUseConfig } from 'src/app/components/card/card.model'
import { DownloadUtils } from '../../../../../utils/download-utils';

@Injectable()
export class ReportsAndDocumentsEffects {
  private actions$ = inject(Actions);
  private service = inject(ReportsAndDocumentsService);

  fetchReportsAndDocuments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportsAndDocumentsActions.fetchReportsAndDocuments),
      concatMap((action) =>
        this.service.getReportsAndDocumentsList(action.filter).pipe(
          map((data) => {
            return ReportsAndDocumentsActions.fetchReportsAndDocumentsSuccess({
              data: data.documents,
            });
          }),
          catchError((error) =>
            of(
              ReportsAndDocumentsActions.fetchReportsAndDocumentsFailure({
                error,
              }),
            ),
          ),
        ),
      ),
    );
  });

  fetchDocumentsTypes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportsAndDocumentsActions.fetchDocumentsTypes),
      concatMap(() =>
        this.service.getDocumentsTypes().pipe(
          map((data) => {
            return ReportsAndDocumentsActions.fetchDocumentsTypesSuccess({
              data: data,
            });
          }),
          catchError((error) =>
            of(
              ReportsAndDocumentsActions.fetchDocumentsTypesFailure({
                error,
              }),
            ),
          ),
        ),
      ),
    );
  });

  fetchReportsAndDocumentDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportsAndDocumentsActions.fetchReportsAndDocumentDetails),
      concatMap((action) =>
        this.service.getReportsAndDocumentsDetails(action.payload).pipe(
          map((data: any) => {
            if (action.payload.isDownload && data) {
              DownloadUtils.download(
                data!.body.mimeType || 'application/pdf',
                data!.body.content,
                data!.body.fileName || 'report',
              );
              return ReportsAndDocumentsActions.fetchReportsAndDocumentDetailsSuccess({
                data: null,
              });
            }
            if (action.payload.isDownload === false && data) {
              if (data.body?.content) {
                DownloadUtils.openPdf(data.body.content, data.body?.mimeType || 'application/pdf');
              }

              if (!data.body) {
                DownloadUtils.openPdf(data);
              }
            }
            return ReportsAndDocumentsActions.fetchReportsAndDocumentDetailsSuccess({ data: data });
          }),
          catchError((error) => {
            return of(
              ReportsAndDocumentsActions.fetchReportsAndDocumentDetailsFailure({
                error,
              }),
            );
          }),
        ),
      ),
    );
  });

  constructor() {}
}
