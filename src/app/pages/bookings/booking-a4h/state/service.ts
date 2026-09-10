import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable, of, switchMap, timer } from 'rxjs';
import type {
  MedicalService,
  CreateSessionResponse,
  FindPayload,
  CheckAvailableDays,
  LockAppointmentPayload,
  LockAppointmentResponse,
  BookAppointmentResponse,
  CheckAvailabilityPayload,
  CheckAvailabilityResponse,
  HealthcareUnit,
  IDoctor,
  ScanResult,
  FindByNrePayload,
  PrescriptionSession,
} from './model';
import { BOOK_APPOINTMENT_RESP } from './mock';

@Injectable({ providedIn: 'root' })
export class BookingUnifiedService {
  private readonly httpClient = inject(HttpClient);
  private readonly IS_DEV = true;

  private checkAvailableDaysCounter = 0;

  getServicesList(bookingFlow: string): Observable<MedicalService[]> {
    return this.httpClient.get<MedicalService[]>(
      `/medical-booking/api/service?filter=${bookingFlow}`,
    );
  }

  createSession(payload: { serviceIds: string[] }): Observable<CreateSessionResponse> {
    return this.httpClient.post<CreateSessionResponse>(
      '/medical-booking/api/find-by-selection/create-session?loginMandatory=false',
      payload,
    );
  }

  find(payload: FindPayload): Observable<CreateSessionResponse> {
    return this.httpClient.post<CreateSessionResponse>('/medical-booking/api/find', payload);
  }

  checkAvailableDays(
    sessionId: string,
    nre?: string,
    taxCode?: string,
  ): Observable<HttpResponse<CheckAvailableDays>> {
    const payload = nre && taxCode ? { sessionId, nre, taxCode } : { sessionId };
    return this.httpClient
      .post<CheckAvailableDays>('/medical-booking/api/find/check-available-days', payload, {
        observe: 'response',
      })
      .pipe(
        switchMap((response) => {
          if (response.body?.status === 'PENDING' && this.checkAvailableDaysCounter <= 5) {
            this.checkAvailableDaysCounter++;
            return timer(3000).pipe(
              switchMap(() => this.checkAvailableDays(sessionId, nre, taxCode)),
            );
          }

          this.checkAvailableDaysCounter = 0;
          return of(response);
        }),
      );
  }

  lock(payload: LockAppointmentPayload): Observable<LockAppointmentResponse> {
    return this.httpClient.post<LockAppointmentResponse>('/medical-booking/api/lock', payload);
  }

  book(payload: LockAppointmentPayload): Observable<BookAppointmentResponse> {
    if (this.IS_DEV) {
      return of(BOOK_APPOINTMENT_RESP).pipe(delay(500));
    }
    return this.httpClient.post<BookAppointmentResponse>('/medical-booking/api/book', payload);
  }

  checkAvailability(payload: CheckAvailabilityPayload): Observable<CheckAvailabilityResponse> {
    return this.httpClient.post<CheckAvailabilityResponse>(
      '/medical-booking/api/find/check-availability',
      payload,
    );
  }

  getHealthCareUnit(): Observable<{ healthcareUnits: HealthcareUnit[] }> {
    return this.httpClient.get<{ healthcareUnits: HealthcareUnit[] }>(
      '/medical-booking/api/health-care-unit/find-all',
    );
  }

  getDoctorsList(serviceIds?: string[]): Observable<IDoctor[]> {
    const query = serviceIds?.length ? `?query=${serviceIds.join(',')}` : '';
    return this.httpClient.get<IDoctor[]>(`/medical-booking/api/physician${query}`);
  }

  scanNreFromImage(request: { mimeType: string; content: string }): Observable<ScanResult> {
    return this.httpClient.post<ScanResult>('/medical-booking/api/prescription/scan', request);
  }

  findPrescriptionByNre(payload: FindByNrePayload): Observable<PrescriptionSession> {
    return this.httpClient.post<PrescriptionSession>(
      '/medical-booking/api/find-prescription',
      payload,
    );
  }

  mergePdfByUrls(payload: { filename: string; urlList: string[] }): Observable<HttpResponse<Blob>> {
    return this.httpClient.post<Blob>('/medical-booking/api/pdf/merge/', payload, {
      observe: 'response',
      responseType: 'blob' as 'json',
    });
  }

  releaseLockBookingSession(payload: LockAppointmentPayload): Observable<unknown> {
    return this.httpClient.post('/medical-booking/api/lock/restart-lp/', payload);
  }
}
