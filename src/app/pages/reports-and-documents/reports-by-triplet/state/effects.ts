import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as TripletReportActions from './actions';
import { Store } from '@ngrx/store';
import { ItNotificationService, NotificationPosition } from 'design-angular-kit';
import { TranslateService } from '@ngx-translate/core';
import { SmartHospitalState } from '../../../../store/reducers';
import { FileUtils } from '../../../../../utils/download-utils';
import { TripletReportService } from './service';

@Injectable()
export class TripletReportEffects {
  private actions$ = inject(Actions);
  private tripletReportService = inject(TripletReportService);
  private store = inject(Store<SmartHospitalState>);
  private readonly notificationService = inject(ItNotificationService);
  private translate = inject(TranslateService);

  fetchReport$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TripletReportActions.fetchReport),
      concatMap((action) =>
        this.tripletReportService.fetchTripletReport(action.payload).pipe(
          map((data) => {
            return TripletReportActions.fetchReportSuccess({
              data: data.documents,
            });
          }),
          catchError((error) => {
            return of(TripletReportActions.fetchReportFailure({ error }));
          }),
        ),
      ),
    );
  });
  downloadTripletReport$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TripletReportActions.downloadTripletReport),
      concatMap((action) =>
        this.tripletReportService.downloadSingleReport(action.payload.data).pipe(
          map((data: any) => {
            if (action.payload.isDownload && data) {
              FileUtils.download(
                data!.body.mimeType || 'application/pdf',
                data!.body.content,
                data!.body.fileName || 'report',
              );
              return TripletReportActions.downloadTripletReportSuccess({
                data: null,
              });
            }
            if (action.payload.isDownload === false && data) {
              if (data.body?.content) {
                FileUtils.openPdf(data.body.content, data.body?.mimeType || 'application/pdf');
              }

              if (!data.body) {
                FileUtils.openPdf(data);
              }
            }
            return TripletReportActions.downloadTripletReportSuccess({ data: data });
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
              TripletReportActions.downloadTripletReportFailure({
                error,
              }),
            );
          }),
        ),
      ),
    );
  });
}
