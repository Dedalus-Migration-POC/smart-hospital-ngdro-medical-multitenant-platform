import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  DELETE_RESERVATION,
  FIND_AVAILABILITY,
  FIND_FIRST_AVAILABILITY_EMPTY,
  FIND_PRIVATE_AVAILABILITY,
  GET_RESERVATION_LIST,
  RESERVE,
  RETRIEVE_PRESTAZIONI,
} from './mock';
import { delay, map, Observable, of, throwError } from 'rxjs';
// import { CardMultiUseConfig } from 'src/app/components/card/card.model'
import {
  Booking,
  BookingRequest,
  FirstAvailabilityRequest,
  OtherAvailabilityRequest,
  PrivateAvailability,
  RetrievePrestazioni,
  RetrievePrestazioniRequest,
  Schedule,
  TelefonoRequest,
} from './model';
import { PRIVATE_BOOKING_AVAILABILITY_REQUEST } from './constants';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  private readonly DEFAULT_PHONE = '3334567890'; // fallback
  private readonly basePath = '/smart-healthcare/api/public/integration';
  private readonly IS_DEV = true;

  constructor(private http: HttpClient) {}

  // fetchCardMultiUseConfigBookingList(): Observable<CardMultiUseConfig> {
  //   if (environment?.pathCardMultiUseConfigBookingList) {
  //     const pathCardMultiUseConfigBookingList =
  //       window.document.baseURI + environment.pathCardMultiUseConfigBookingList // fetch from assets/tenant/ xxx /config
  //     return this.http.get<CardMultiUseConfig>(
  //       pathCardMultiUseConfigBookingList,
  //     )
  //   }
  //   return throwError(
  //     () =>
  //       new Error(
  //         'BookingList: pathCardMultiUseConfigBookingList is not defined',
  //       ),
  //   )
  // }

  fetchBookingList(request: TelefonoRequest): Observable<Booking> {
    if (this.IS_DEV) {
      return of(GET_RESERVATION_LIST as Booking).pipe(delay(500));
    }

    const body = this.setPhoneNumber(request);
    const url = `${this.basePath}/reservation/get-reservation-list`;

    return this.http.post<Booking>(url, body);
  }

  deleteBooking(request: BookingRequest): Observable<Schedule> {
    if (this.IS_DEV) {
      return of(DELETE_RESERVATION as Schedule).pipe(delay(500));
    }

    request = this.setPhoneNumber(request);

    const url = `${this.basePath}/reservation/delete-reservation`;
    return this.http.post<Schedule>(url, request);
  }

  findFirstAvailability(request: FirstAvailabilityRequest): Observable<Booking> {
    if (this.IS_DEV) {
      return of(FIND_FIRST_AVAILABILITY_EMPTY as Booking).pipe(delay(500));
    }

    request = this.setPhoneNumber(request);

    const url = `${this.basePath}/reservation/find-first-availability`;

    return this.http.post<Booking>(url, request);
  }

  findOtherAvailability(request: OtherAvailabilityRequest): Observable<Booking> {
    if (this.IS_DEV) {
      return of(FIND_AVAILABILITY as Booking).pipe(delay(500));
    }

    request = this.setPhoneNumber(request);

    const url = `${this.basePath}/reservation/find-availability`;

    return this.http.post<Booking>(url, request);
  }

  reserve(request: BookingRequest): Observable<Schedule> {
    if (this.IS_DEV) {
      return of(RESERVE as Schedule).pipe(delay(500));
    }

    request = this.setPhoneNumber(request);

    const url = `${this.basePath}/reservation/reserve`;

    return this.http.post<Schedule>(url, request);
  }

  fetchPrivateBookingList(request: RetrievePrestazioniRequest): Observable<RetrievePrestazioni> {
    if (this.IS_DEV) {
      return of(RETRIEVE_PRESTAZIONI as RetrievePrestazioni).pipe(delay(500));
    }

    const url = `${this.basePath}/prestazioni/retrieve-prestazioni-grouped`;

    return this.http.post<RetrievePrestazioni>(url, request);
  }

  findPrivateAvailability(
    codRegPrest: string,
    descPrest: string,
    idAgenda: number,
  ): Observable<PrivateAvailability> {
    if (this.IS_DEV) {
      return of(FIND_PRIVATE_AVAILABILITY as PrivateAvailability).pipe(delay(500));
    }

    const request = {
      serviceCode: codRegPrest,
      serviceDescription: descPrest,
      idAgenda: idAgenda,
      structures: PRIVATE_BOOKING_AVAILABILITY_REQUEST.structures,
      doctorFiscalCode: PRIVATE_BOOKING_AVAILABILITY_REQUEST.doctorFiscalCode,
      doctorTypeCode: PRIVATE_BOOKING_AVAILABILITY_REQUEST.doctorTypeCode,
      regimeErogazione: PRIVATE_BOOKING_AVAILABILITY_REQUEST.regimeErogazione,
      maxResults: PRIVATE_BOOKING_AVAILABILITY_REQUEST.maxResults,
      ais11: PRIVATE_BOOKING_AVAILABILITY_REQUEST.ais11,
    };

    const url = `${this.basePath}/reservation/lp/availability`;

    return this.http.post<PrivateAvailability>(url, request);
  }

  private setPhoneNumber<T extends TelefonoRequest | BookingRequest | FirstAvailabilityRequest>(
    request: T,
  ): T {
    const phone = (request?.telefonoIntestatario ?? '').trim();

    return { ...request, telefonoIntestatario: phone || this.DEFAULT_PHONE };
  }
}
