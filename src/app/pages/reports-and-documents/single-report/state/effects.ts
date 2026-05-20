import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as SingleReportActions from './actions';
import { SingleReportService } from './service';
import { Store } from '@ngrx/store';
import { fetchSingleReport } from './actions';
import { ItNotificationService, NotificationPosition } from 'design-angular-kit';
import { TranslateService } from '@ngx-translate/core';
import { SmartHospitalState } from '../../../../store/reducers';
import { FileUtils } from '../../../../../utils/download-utils';

@Injectable()
export class SingleReportEffects {
  private actions$ = inject(Actions);
  private singleReportService = inject(SingleReportService);
  private store = inject(Store<SmartHospitalState>);
  private readonly notificationService = inject(ItNotificationService);
  private translate = inject(TranslateService);

  fetchSingleReportSession$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SingleReportActions.fetchSingleReportSession),
      concatMap((action) =>
        this.singleReportService.fetchSingleReportSession(action.payload).pipe(
          map((data) => {
            this.store.dispatch(
              fetchSingleReport({
                payload: {
                  data: { sessionId: data.sessionId, code: data.code },
                  reportEndpoint: action.payload.reportEndpoint,
                },
              }),
            );
            return SingleReportActions.fetchSingleReportSessionSuccess({
              data,
            });
          }),
          catchError((error) => {
            return of(SingleReportActions.fetchSingleReportSessionFailure({ error }));
          }),
        ),
      ),
    );
  });

  fetchSingleReport$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SingleReportActions.fetchSingleReport),
      concatMap((action) =>
        this.singleReportService.fetchSingleReport(action.payload).pipe(
          map((data) => {
            const reports = Array.isArray(data) ? data : [data];
            return SingleReportActions.fetchSingleReportSuccess({
              data: reports,
            });
          }),
          catchError((error) => {
            return of(SingleReportActions.fetchSingleReportFailure({ error }));
          }),
        ),
      ),
    );
  });
  downloadSingleReport$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SingleReportActions.downloadSingleReport),
      concatMap((action) =>
        this.singleReportService.downloadSingleReport(action.payload).pipe(
          map((data: any) => {
            if (action.payload.data.isDownload && data) {
              if (action.payload.data.responseType === 'link') {
                let formatType = 'text/html';
                new Blob([data], { type: formatType }).text().then((x) => {
                  window.open(atob(x), '_blank')?.focus();
                });
              }
              if (action.payload.data.responseType === 'pdf' && data.body) {
                FileUtils.download(
                  data!.body?.mimeType || 'application/pdf',
                  data!.body?.content,
                  data!.body?.fileName || 'report',
                );
              }
              if (action.payload.data.responseType === 'pdf' && !data.body) {
                let fileName = 'allegato'.concat('.pdf');
                const downloadURL = window.URL.createObjectURL(data);
                const link = document.createElement('a');
                link.href = downloadURL;
                link.download = fileName;
                link.click();
              }
            }
            if (action.payload.data.isDownload === false && data) {
              if (action.payload.data.responseType === 'pdf' && data.body?.content) {
                FileUtils.openPdf(data.body.content, data.body?.mimeType || 'application/pdf');
              }

              if (action.payload.data.responseType === 'pdf' && !data.body) {
                FileUtils.openPdf(data);
              }
            }
            return SingleReportActions.downloadSingleReportSuccess({
              data: data,
            });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              8000,
              NotificationPosition.Top,
            );
            return of(
              SingleReportActions.downloadSingleReportFailure({
                error,
              }),
            );
          }),
        ),
      ),
    );
  });
}
