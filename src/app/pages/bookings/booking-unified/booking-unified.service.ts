import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, switchMap, timer } from 'rxjs';

export interface MedicalService {
  id: string;
  name: string;
  description?: string;
  enabled?: boolean;
  isChecked?: boolean;
}

export interface HealthcareUnit {
  id: string;
  name: string;
  description?: string;
  state?: string;
  country?: string;
  city?: string;
  postCode?: string;
  address?: string;
  province?: string;
  region?: string;
  phone?: string[];
  fax?: string;
  email?: string;
  operationUnits?: OperationUnit[];
  image?: string;
}

export interface OperationUnit {
  name: string;
  description?: string;
  phone?: string[];
  email?: string;
  timeSlots?: string;
  location?: string;
}

export interface CreateSessionResponse {
  sessionId: string;
  expireOn: number;
}

export interface FindPayload {
  sessionId: string;
  from: unknown;
  to: unknown;
  serviceIds: string[];
  unitId?: string[];
  physicianId?: string;
  contractId?: string;
  appointmentToMove?: { id: string };
}

export interface CheckAvailableDays {
  appointments: Appointment[];
  availableDays: AvailableDay[];
  status: string;
}

export interface Appointment {
  id: string;
  dateTime: string | number;
  location: Location;
  descriptionList?: string[];
  status: string;
  physician?: Physician;
  billingInfo?: BillingInfo[];
  additionalProperties?: AdditionalProperties;
  serviceDescriptionList?: ServiceDescription[];
}

export interface AvailableDay {
  date: string;
  hospitalId: string;
  hospitalName: string;
}

export interface ServiceDescription {
  id: string;
  description: string;
}

export interface AdditionalProperties {
  contractId?: string;
  time?: string;
  token?: string;
  preparation?: { link?: string }[];
  flowType?: string;
  idReserve?: string;
  a4hAppointmentId?: string;
}

export interface BillingInfo {
  status: string;
  contractName: string;
  finalPrice: number;
}

export interface Physician {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  postCode: string;
}

export interface LockAppointmentPayload {
  sessionId: string;
  appointmentId?: string;
}

export interface LockAppointmentResponse {
  expireOn: number;
  appointment: Appointment;
}

export interface BookAppointmentResponse {
  additionalProperties?: AdditionalProperties;
  appointment: Appointment;
}

export interface CheckAvailabilityPayload {
  bookingFlow: string;
  serviceIds: string[];
  unitId?: string;
  physician?: unknown[];
  nre?: string;
  taxCode?: string;
}

export interface CheckAvailabilityResponse {
  services: AvailabilityService[];
}

export interface AvailabilityService {
  service: string;
  available: boolean;
  name?: string;
}

export interface IDoctor {
  id: string;
  firstName: string;
  lastName: string;
  fiscalCode?: string;
  description?: string;
  type?: string;
}

export interface ScanResult {
  prescriptionPrimaryCode: string;
  prescriptionSecondaryCode: string;
  fiscalCode: string;
}

export interface PrescriptionSession {
  sessionId: string;
  expireOn: number;
  prescription: Prescription;
}

export interface Prescription {
  id: string;
  number: string;
  format: string;
  serviceRequestList: PrescriptionServiceRequest[];
}

export interface NreInfo {
  fiscalCode: string;
  prescriptionId: string;
}

export interface PrescriptionServiceRequest {
  id: number | string;
  service: PrescriptionService;
  selected?: boolean;
}

export interface PrescriptionService {
  id: string;
  name: string;
  subServices: PrescriptionSubService[];
  description?: string;
  enabled?: boolean;
}

export interface PrescriptionSubService {
  id: string;
  name: string;
  enabled?: boolean;
}

export interface FindByNrePayload {
  fiscalCode: string;
  prescriptionId: string;
}

@Injectable({ providedIn: 'root' })
export class BookingUnifiedService {
  private readonly httpClient = inject(HttpClient);
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
