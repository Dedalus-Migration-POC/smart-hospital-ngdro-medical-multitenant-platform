import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import {
  DownloadTripletReportRequest,
  LaboratoryReportTripletResponse,
  TripletReportRequest,
} from './model';
import { LAB_DOCUMENT, TRIPLET_REPORT, TRIPLET_REPORT_NOT_PAID } from './mock';

@Injectable({
  providedIn: 'root',
})
export class TripletReportService {
  constructor(private http: HttpClient) {}
  private readonly IS_DEV = true;

  fetchTripletReport(
    payload: TripletReportRequest,
  ): Observable<LaboratoryReportTripletResponse | any> {
    if (this.IS_DEV) {
      console.log('fetchTripletReport', payload);
      if (payload.patientId === '0000') {
        // mock per referto non pagato
        return of(TRIPLET_REPORT_NOT_PAID).pipe(delay(500));
      }
      return of(TRIPLET_REPORT).pipe(delay(500));
    } else if (payload.patientId === '0000') {
      // mock per referto non pagato
      return of(TRIPLET_REPORT_NOT_PAID).pipe(delay(500));
    }
    return this.http.post<LaboratoryReportTripletResponse>(
      `health-repository/api/archive/find-document-by-credential`,
      payload,
    );
  }

  downloadSingleReport(payload: DownloadTripletReportRequest) {
    if (this.IS_DEV) {
      console.log('downloadSingleReport', payload);
      return of(LAB_DOCUMENT).pipe(delay(500));
    }

    return this.http.post(`health-repository/api/archive/retrieve-document-by-credential`, payload);
  }
}
