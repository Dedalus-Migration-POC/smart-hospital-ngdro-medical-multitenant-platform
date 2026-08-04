import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { DOCS_TYPE, LAB_DOCUMENT, LAB_DOCUMENT_TWO, MOCK_DOCS } from './mock';
import { IDocumentsResponse, IDocumentsType } from './model';

@Injectable({
  providedIn: 'root',
})
export class ReportsAndDocumentsService {
  private readonly IS_DEV = true;

  constructor(private httpClient: HttpClient) {}

  getReportsAndDocumentsList(filter?: string): Observable<IDocumentsResponse> {
    if (this.IS_DEV) {
      return of(MOCK_DOCS).pipe(delay(500));
    }
    const path = `health-repository/api/archive/find-documents`; //Arianna
    return this.httpClient.post<IDocumentsResponse>(
      path,
      filter
        ? {
            filter: {
              typeCode: filter,
            },
          }
        : {},
    );
  }

  getReportsAndDocumentsDetails(payload: {
    documentId: string;
    repositoryId: string;
  }): Observable<any> {
    if (this.IS_DEV) {
      if (payload.documentId === '5918521') {
        return of(LAB_DOCUMENT).pipe(delay(500));
      } else {
        return of(LAB_DOCUMENT_TWO).pipe(delay(500));
      }
    }
    return this.httpClient.post<any>(`health-repository/api/archive/retrieve-document`, payload);
  }

  getDocumentsTypes(): Observable<IDocumentsType[]> {
    if (this.IS_DEV) {
      return of(DOCS_TYPE).pipe(delay(500));
    }
    return this.httpClient.get<IDocumentsType[]>(`health-repository/api/archive/documents-type`);
  }
}
