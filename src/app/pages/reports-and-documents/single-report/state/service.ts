import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, of, switchMap, timer } from 'rxjs';
import { LAB_DOCUMENT, SESSION_REPORT_RESPONSE, SINGL_REPORT_LINK, SINGLE_REPORT } from './mock';
import { IGetReportRequest, IGetReportSessionResponse, IReport, ReportEndpoint } from './model';

@Injectable({
  providedIn: 'root',
})
export class SingleReportService {
  constructor(private http: HttpClient) {}
  private readonly IS_DEV = true;

  fetchSingleReportSession(payload: {
    cf: string;
    id: string;
    reportEndpoint: ReportEndpoint;
  }): Observable<IGetReportSessionResponse> {
    if (this.IS_DEV) {
      console.log('fetchSingleReportSession payload:', payload);
      return of(SESSION_REPORT_RESPONSE).pipe(delay(500));
    }

    return this.http.post<IGetReportSessionResponse>(`${payload.reportEndpoint}/code`, {
      patientId: payload.cf,
      reportId: payload.id,
    });
  }

  fetchSingleReport(payload: {
    data: IGetReportRequest;
    reportEndpoint?: ReportEndpoint;
  }): Observable<IReport | any> {
    if (this.IS_DEV) {
      console.log('fetchSingleReport payload:', payload);

      return of(SINGLE_REPORT).pipe(delay(500));
    }
    return this.http.post<IReport[] | IReport>(`${payload.reportEndpoint}/get`, payload.data).pipe(
      // BLOCK
      switchMap((response) => {
        if (response === null) {
          return timer(1000).pipe(switchMap(() => this.fetchSingleReport(payload)));
        }
        return of(response);
      }),
    );
  }

  downloadSingleReport(payload: {
    data: {
      requestId: string;
      sessionId: string;
      attachmentId: string;
      reportId: string;
      decodeSignedBinary: boolean;
      responseType: string;
    };
    reportEndpoint?: ReportEndpoint;
  }) {
    if (this.IS_DEV) {
      console.log('Downloading single report:', payload);
      if (payload.data.responseType === 'link') {
        return of(SINGL_REPORT_LINK).pipe(delay(500));
      } else {
        return of(LAB_DOCUMENT).pipe(delay(500));
      }
    }

    return this.http.post(`${payload.reportEndpoint}/download`, payload.data, {
      responseType: 'blob' as 'json',
    });
  }
}
