import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, of } from 'rxjs';
import {
  ConsentsA4H,
  ConsentsA4hAddPayload,
  ConsentsA4hAddRevokeResponse,
  ConsentsA4hRevokePayload,
  RequestUserA4HPrivacyConsentPayload,
  ResponseUserA4HPrivacyConsent,
} from './model';
import { MOCK_A4H_CONSENTS, MOCK_OTHER_CONSENTS } from './mock';

import { Store } from '@ngrx/store';
import { SmartHospitalState } from 'src/app/store/reducers';

@Injectable({ providedIn: 'root' })
export class ConsentsA4HService {
  constructor(
    private http: HttpClient,
    private store: Store<SmartHospitalState>,
  ) {}
  private readonly IS_DEV = true;

  fetchUserA4hPrivacyConsent(payload: RequestUserA4HPrivacyConsentPayload) {
    if (this.IS_DEV) {
      return of(MOCK_A4H_CONSENTS).pipe(delay(500));
    }
    return this.http.post<ResponseUserA4HPrivacyConsent>('checkin/api/consent/find', payload);
  }

  updateUserA4hPrivacyConsent(payload: RequestUserA4HPrivacyConsentPayload) {
    if (this.IS_DEV) {
      return of(MOCK_A4H_CONSENTS).pipe(delay(500));
    }
    return this.http.post<ResponseUserA4HPrivacyConsent>('checkin/api/consent/update', payload);
  }

  fetchConsentsA4H() {
    if (this.IS_DEV) {
      return of(MOCK_OTHER_CONSENTS).pipe(delay(500));
    }
    return this.http.get<ConsentsA4H[]>('/checkin/api/consent/list');
  }

  updateConsentsA4h(payload: ConsentsA4hAddPayload | ConsentsA4hRevokePayload) {
    if ('IsAgree' in payload) {
      return this.http.post<ConsentsA4hAddRevokeResponse>('/checkin/api/consent/add', payload);
    }
    return this.http.post<ConsentsA4hAddRevokeResponse>('/checkin/api/consent/revoke', payload);
  }
}
