import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, EMPTY, map, Observable, of, switchMap, tap, throwError, timer } from 'rxjs';
import {
  AVAILABLE_DAYS_RESPONSE,
  CITIES,
  CONSENTS,
  HEALTHCARE_UNIT_LIST,
  NATIONS,
  PHISICIAN_LIST,
  PROVINCES,
  SERVICE_LIST,
  SERVICE_REQUEST_LIST,
  TYPO_DELEGA_LIST,
} from './mock';
import {
  AvailableDaysPayload,
  AvailableDaysResponse,
  BookResponse,
  CallState,
  CreateSessionResponse,
  CreateSessionWithAddressPayload,
  CreateThirdyPartSessionPayload,
  DelegaTypesResp,
  FetchPersonInfoResponse,
  FindBookingsResp,
  FindByCheckResponse,
  FindByFiscalCodePayload,
  FindByFiscalCodeResponse,
  FindPrescriptionResponse,
  HealthcareUnitList,
  IConsent,
  IConsentsToUpdate,
  INationsResp,
  InitBookingFromMissingDataPayload,
  InitThirdBookingPayload,
  LockPayload,
  LockResponse,
  MemoPayload,
  MoveAppointmentPayload,
  Physician,
  RescheduleAppointmentPayload,
  ScanResult,
  Service,
} from './model';
import { addMinutes, getUnixTime } from 'date-fns';
// import { environment } from 'src/environments/environment'
// import { CardMultiUseConfig } from 'src/app/components/card/card.model'

@Injectable({
  providedIn: 'root',
})
export class BookingsHeroService {
  private readonly basePath = '/medical-booking/api';
  private readonly IS_DEV = true;
  private readonly http = inject(HttpClient);

  scanNreFromImage(request: { mimeType: string; content: string }): Observable<ScanResult> {
    const path = `${this.basePath}/prescription/scan`;

    if (this.IS_DEV) {
      console.log(path, request);
      return of({
        prescriptionPrimaryCode: '1900A',
        prescriptionSecondaryCode: '4704772058',
        fiscalCode: 'BRGGNN71R09A089S',
        person: {
          name: 'GIOVANNI',
          lastName: 'BURGIO',
          zipCode: '92015',
          address: "VIA D'ALESSANDRO N. 58/A",
          city: 'RAFFADALI',
          province: 'AG',
        },
      }).pipe(delay(500));
    }
    return this.http.post<ScanResult>(path, request);
  }

  findByFiscalCode(payload: FindByFiscalCodePayload) {
    const path = `${this.basePath}/person/find-by-fiscal-code`;

    if (this.IS_DEV) {
      console.log(path, 'payload:', payload);
      return of({
        sessionId: 'sessionId-find-by-fiscal-code',
        expireOn: getUnixTime(addMinutes(new Date(), 10)),
        firstName: 'Mario',
        lastName: 'Rossi',
        fiscalCode: 'RSSMRA72D22H501L',
        email: 'LORxxxxxxxxxxxxxxx@GMAIL.COM',
        phoneNumber: 'xxxxxxxx9703',
      } as FindByFiscalCodeResponse).pipe(delay(500));
      // return of(null).pipe(delay(500))
    }

    return this.http.post<FindByFiscalCodeResponse | null>(path, payload);
  }

  fetchPersonInfo(payload: FindByFiscalCodePayload) {
    const path = `${this.basePath}/person-info`;

    if (this.IS_DEV) {
      console.log(path, 'payload:', payload);
      return of({
        fiscalCode: 'BRGGNN71R09A089S',
        name: 'GIOVANNI',
        lastName: 'BURGIO',
        zipCode: '92015',
        address: "VIA D'ALESSANDRO N. 58/A",
        city: 'RAFFADALI',
        province: 'AG',
      } as FetchPersonInfoResponse).pipe(delay(500));
      // return of(null).pipe(delay(500))
    }

    return this.http.post<FetchPersonInfoResponse | null>(path, payload);
  }

  initThirdBooking(payload: InitThirdBookingPayload): Observable<FindPrescriptionResponse> {
    const path = `${this.basePath}/find-by-nre/init-third-booking`;

    if (this.IS_DEV) {
      console.log(path, 'payload:', payload);
      return of({
        sessionId: 'sessionId-/init-third-booking',
        expireOn: addMinutes(new Date(), 10).getTime() / 1000,
        prescription: {
          serviceRequestList: SERVICE_REQUEST_LIST,
          format: 'RE',
          id: '2022001615534',
          number: '1200A4499589420',
        },
      } as FindPrescriptionResponse).pipe(delay(500));
    }

    return this.http.post<FindPrescriptionResponse>(path, payload);
  }

  findPrescription(payload: FindByFiscalCodePayload): Observable<FindPrescriptionResponse> {
    const path = `${this.basePath}/find-prescription`;

    if (this.IS_DEV) {
      console.log(path, 'payload:', payload);
      return of({
        sessionId: 'sessionId-find-prescription',
        prescription: {
          serviceRequestList: SERVICE_REQUEST_LIST,
          format: 'RE',
          id: '2022001615534',
          number: '1200A4499589420',
        },
        expireOn: addMinutes(new Date(), 10).getTime() / 1000,
        medicalAppointmentPatient: {
          id: 'string',
          fiscalCode: 'string',
          firstName: 'string',
          lastName: 'string',
          gender: 'M',
          birthDate: '2021-12-22',
          email: 'a@a',
          phoneNumber: '33312345678',
        },
      } as FindPrescriptionResponse).pipe(delay(500));
    }

    return this.http.post<FindPrescriptionResponse>(path, payload);
  }

  createSession(serviceIds: string[]): Observable<CreateSessionResponse> {
    const path = `${this.basePath}/find-by-selection/create-session`;

    if (this.IS_DEV) {
      console.log(path, 'payload:', serviceIds);
      return of({
        sessionId: 'sessionId-find-by-selection/create-session',
        expireOn: 1767948168.137,
      }).pipe(delay(500));
    }

    return this.http.post<CreateSessionResponse>(path, serviceIds);
  }

  createThirdyPartSession(
    payload: CreateThirdyPartSessionPayload,
  ): Observable<CreateSessionResponse> {
    const path = `${this.basePath}/find-by-selection/create-thirdy-part-session`;

    if (this.IS_DEV) {
      console.log(path, 'payload:', payload);
      return of({
        sessionId: 'sessionId-find-by-selection/create-thirdy-part-session',
        expireOn: 1767948168.137,
      }).pipe(delay(500));
    }

    return this.http.post<CreateSessionResponse>(path, payload);
  }

  getProvincesList(): Observable<string[]> {
    const path = `${this.basePath}/istat/provinces`;

    if (this.IS_DEV) {
      console.log(path, 'get');
      return of(PROVINCES).pipe(delay(500));
    }
    return this.http.get<string[]>(path);
  }

  getCitiesList(province: string): Observable<string[]> {
    const path = `${this.basePath}/istat/cities?province=${province}`;

    if (this.IS_DEV) {
      console.log(path, 'get');
      return of(CITIES).pipe(delay(500));
    }
    return this.http.get<string[]>(path);
  }

  findAllHealthcareUnits(): Observable<HealthcareUnitList> {
    const path = `${this.basePath}/health-care-unit/find-all`;

    if (this.IS_DEV) {
      console.log(path, 'get');
      return of(HEALTHCARE_UNIT_LIST).pipe(delay(500));
    }

    return this.http.get<HealthcareUnitList>(path);
  }

  initBookingFromMissingData(payload: InitBookingFromMissingDataPayload) {
    const url = `${this.basePath}/find-by-nre/init-booking`;

    if (this.IS_DEV) {
      console.log(url, 'payload: ', payload);
      return of({
        sessionId: 'sessionId-find-by-nre/init-booking',
        prescription: {
          serviceRequestList: SERVICE_REQUEST_LIST,
          format: 'RE',
          id: '2022001615534',
          number: '1200A4499589420',
        },
        expireOn: addMinutes(new Date(), 10).getTime() / 1000,
        medicalAppointmentPatient: {
          id: 'string',
          fiscalCode: 'string',
          firstName: 'string',
          lastName: 'string',
          gender: 'M',
          birthDate: '2021-12-22',
          email: 'a@a',
          phoneNumber: '33312345678',
        },
      } as FindPrescriptionResponse).pipe(delay(500));
    }
    return this.http.post<FindPrescriptionResponse>(url, payload);
  }

  fetchAvailableDays(
    payload: AvailableDaysPayload,
    useCheck?: boolean,
  ): Observable<AvailableDaysResponse> {
    if (useCheck) {
      const path = `${this.basePath}/find/check `;

      if (this.IS_DEV) {
        console.log(path, 'payload: ', { sessionId: payload.sessionId }, 'useCheck: ', useCheck);

        return of(AVAILABLE_DAYS_RESPONSE).pipe(delay(500));
      }

      return this.http.post<AvailableDaysResponse>(path, { sessionId: payload.sessionId }).pipe(
        switchMap((response) => {
          if (response.status !== CallState.OK) {
            return timer(3000).pipe(switchMap(() => this.fetchAvailableDays(payload, true)));
          }
          return of(response);
        }),
      );
    } else {
      const path = `${this.basePath}/custom-find`;

      if (this.IS_DEV) {
        console.log(path, 'payload: ', payload);
        return of(AVAILABLE_DAYS_RESPONSE).pipe(delay(500));
      }

      const body = {
        ...payload,
        maxResults: 100,
      };
      return this.http.post<AvailableDaysResponse>(path, body);
    }
  }

  lock(payload: LockPayload): Observable<LockResponse> {
    const path = `${this.basePath}/lock`;

    if (this.IS_DEV) {
      console.log(path, 'payload: ', payload);
      return of({
        expireOn: addMinutes(new Date(), 10).getTime() / 1000,
        appointment: AVAILABLE_DAYS_RESPONSE.appointments![0],
      }).pipe(delay(500));
    }

    return this.http.post<LockResponse>(path, payload);
  }

  dateToExpire(sessionId: string): Observable<number> {
    const path = `${this.basePath}/lock/date-to-expire`;

    if (this.IS_DEV) {
      console.log(path, 'payload: ', { sessionId });
      return of(addMinutes(new Date(), 10).getTime() / 1000).pipe(delay(500));
    }

    return this.http.post<number>(path, { sessionId }).pipe(map((date) => date / 1000));
  }

  book(sessionId: string): Observable<BookResponse> {
    const path = `${this.basePath}/book`;

    if (this.IS_DEV) {
      console.log(path, 'payload: ', { sessionId });
      return of({ appointment: AVAILABLE_DAYS_RESPONSE.appointments![0] }).pipe(delay(500));
    }
    return this.http.post<BookResponse>(path, { sessionId });
  }

  fetchServicesByName(name: string): Observable<Service[]> {
    const path = `${this.basePath}/service/find-by-name`;
    if (!name) {
      return of([]).pipe(delay(500));
    }
    if (this.IS_DEV) {
      console.log(path, 'payload: ', name);
      return of(SERVICE_LIST).pipe(delay(500));
    }

    const params = new HttpParams().set('name', name ?? '');
    const options = {
      params,
    };
    return this.http.get<Service[]>(path, options);
  }

  fetchPhysicianByService(serviceId: string): Observable<Physician[]> {
    const path = `${this.basePath}/physician`;
    if (!serviceId) {
      return of([]).pipe(delay(500));
    }
    if (this.IS_DEV) {
      console.log(path, 'payload: ', serviceId);
      return of(PHISICIAN_LIST).pipe(delay(500));
    }

    const params = new HttpParams().set('query', serviceId ?? '');
    const options = {
      params,
    };
    return this.http.get<Physician[]>(path, options);
  }

  createSessionWithAddress(payload: CreateSessionWithAddressPayload) {
    const path = `${this.basePath}/find-by-selection/create-session-with-address`;

    if (this.IS_DEV) {
      console.log(path, 'payload: ', payload);
      return of({
        sessionId: 'sessionId-find-by-selection/create-session-with-address',
        expireOn: 1767948168.137,
      }).pipe(delay(500));
    }

    return this.http.post<CreateSessionResponse>(path, payload);
  }

  fetchDelegateTypes() {
    const path = `enumeration/api/enumeration/${'environment.name'}/tipodelega`;

    if (this.IS_DEV) {
      console.log(path);
      return of(TYPO_DELEGA_LIST).pipe(delay(500));
    }
    return this.http.get<DelegaTypesResp>(path);
  }

  fetchNations() {
    const path = `enumeration/api/enumeration/${'environment.name'}/nations`;

    if (this.IS_DEV) {
      console.log(path);
      return of(NATIONS).pipe(delay(500));
    }
    return this.http.get<INationsResp>(path);
  }

  fetchConsents() {
    const path = `/management-privacy-consent/api/user/consents/WAPP/`;

    if (this.IS_DEV) {
      console.log(path);
      return of(CONSENTS).pipe(delay(500));
    }
    return this.http.get<IConsent[]>(path);
  }

  updateConsents(payload: IConsentsToUpdate) {
    const path = `/management-privacy-consent/api/user/consents/WAPP/`;

    if (this.IS_DEV) {
      console.log(path, 'payload: ', payload);
      return of(EMPTY).pipe(delay(500));
    }
    return this.http.post(path, payload);
  }

  restartLp(sessionId: string) {
    const path = `${this.basePath}/lock/restart-lp`;

    if (this.IS_DEV) {
      console.log(path, 'payload: ', { sessionId });
      return of({
        sessionId: 'sessionId-lock/restart-lp',
        expireOn: 1767948168.137,
      }).pipe(delay(500));
    }

    return this.http.post<CreateSessionResponse>(path, {});
  }

  unlockSession(sessionId: string) {
    const path = `${this.basePath}/lock/release`;

    if (this.IS_DEV) {
      console.log(path, 'payload: ', { sessionId });
      return of(true).pipe(delay(500));
    }

    return this.http.post(path, { sessionId });
  }

  printMemo(payload: MemoPayload, isBook?: boolean) {
    const path = isBook ? `${this.basePath}/book/memo` : `${this.basePath}/reservations/memo-pdf`;

    if (this.IS_DEV) {
      console.log(path, 'payload: ', { payload }, 'isBook:', isBook);
      return of(new Blob([''], { type: 'application/pdf' })).pipe(delay(500));
    }
    return this.http.post(path, payload, { responseType: 'blob' });
  }

  sendEmailNotification(payload: MemoPayload, isBook?: boolean) {
    const path = isBook
      ? `${this.basePath}/book/memo-email`
      : `${this.basePath}/reservations/memo-email`;

    if (this.IS_DEV) {
      console.log(path, 'payload: ', { payload }, 'isBook:', isBook);

      return of(true).pipe(delay(500));
    }
    return this.http.post(path, payload);
  }

  addToCalendar(payload: MemoPayload) {
    const path = `${this.basePath}/book/memo-calendar`;

    if (this.IS_DEV) {
      console.log(path, 'payload: ', { payload });
      return of(new Blob([''], { type: 'text/calendar' })).pipe(delay(500));
    }
    return this.http.post(path, payload, { responseType: 'blob' });
  }

  cancelAppointment(payload: MemoPayload) {
    const path = `${this.basePath}/reservations/cancel`;

    if (this.IS_DEV) {
      console.log(path, 'payload: ', { payload });
      return of(true).pipe(delay(500));
    }
    return this.http.post(path, payload);
  }

  fetchBookingByNre(payload: FindByFiscalCodePayload): Observable<FindBookingsResp> {
    const path = `${this.basePath}/reservations/find`;

    if (this.IS_DEV) {
      console.log(path, 'payload: ', payload);

      return of({
        sessionId: 'sessionId-/reservations/find',
        appointments: AVAILABLE_DAYS_RESPONSE.appointments!,
        expireOn: addMinutes(new Date(), 15).getTime() / 1000,
      }).pipe(delay(500));
    }

    return this.http.post<FindBookingsResp>(path, payload).pipe(
      map((response) => ({
        ...response,
        appointments: response.appointments.map((appointment) => ({
          ...appointment,
          serviceDescriptionList: appointment.serviceDescriptionList
            ? appointment.serviceDescriptionList.map((serviceDescription) => ({
                ...serviceDescription,
                notes: serviceDescription.notes
                  ?.replaceAll('\\n', '<br />')
                  .replaceAll('\n', '<br />'),
              }))
            : appointment.descriptionList?.map((serviceDescription, i) => ({
                id: i.toString(),
                description: serviceDescription,
              })),
        })),
      })),
    );
  }

  fetchBookingsList(): Observable<FindBookingsResp> {
    const path = `${this.basePath}/reservations/find-by-person`;

    if (this.IS_DEV) {
      console.log(path, 'payload: null');
      return of({
        sessionId: 'sessionId-reservations/find-by-person',
        appointments: AVAILABLE_DAYS_RESPONSE.appointments!,
        expireOn: addMinutes(new Date(), 15).getTime() / 1000,
      }).pipe(delay(500));
    }
    return this.http.post<FindBookingsResp>(path, {});
  }

  // fetchCardMultiUseConfigBookingList(): Observable<CardMultiUseConfig> {
  //   if (environment?.pathCardMultiUseConfigBookingList) {
  //     const pathCardMultiUseConfigBookingList =
  //       window.document.baseURI +
  //       environment.pathCardMultiUseConfigBookingHeroList // fetch from assets/tenant/ xxx /config
  //     return this.http.get<CardMultiUseConfig>(
  //       pathCardMultiUseConfigBookingList,
  //     )
  //   }
  //   return throwError(
  //     () =>
  //       new Error(
  //         'BookingList: pathCardMultiUseConfigBookingHeroList is not defined',
  //       ),
  //   )
  // }

  fetchAvailableDaysForRescheduleAppointment(
    payload: RescheduleAppointmentPayload,
  ): Observable<AvailableDaysResponse> {
    const path = `${this.basePath}/custom-find`;

    if (this.IS_DEV) {
      console.log(path, 'payload: ', payload);
      return of(AVAILABLE_DAYS_RESPONSE).pipe(delay(500));
    }

    return this.http.post<AvailableDaysResponse>(path, payload);
  }

  move(payload: MoveAppointmentPayload): Observable<BookResponse> {
    const path = `${this.basePath}/reservations/move`;

    if (this.IS_DEV) {
      console.log(path, 'payload: ', payload);
      return of({ appointment: AVAILABLE_DAYS_RESPONSE.appointments![0] }).pipe(delay(500));
    }
    return this.http.post<BookResponse>(path, payload);
  }
}
