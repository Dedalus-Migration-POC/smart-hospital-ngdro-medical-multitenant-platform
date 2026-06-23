import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map, Observable, of, switchMap, throwError } from 'rxjs';
import { PAGOPA_LINK, PAYMENTS_LIST } from './payments.mock';
// import { CardMultiUseConfig } from 'src/app/components/card/card.model'

// export interface FetchPaymentsResponse {
//   practiceList: Payment[]
// }

// export interface Payment {
//   billingId?: string
//   appointmentId?: string
//   practiceId: string
//   branchCode: string
//   name?: string
//   location?: string
//   date?: number
//   amount: number
//   serviceId?: string
//   appointmentList?: Appointment[]
//   status: string
// }

// export interface Appointment {
//   id: string
//   dateTime: string
//   serviceDescriptionList: string
// }

export interface Location {
  id: string;
  name: string;
  municipality: string;
  postalCode: string;
  address: string;
  gpsCoordinate: string;
  taxCode: string;
}

export interface GpsCoordinate {
  longitude: number;
  latitude: number;
}
export interface LocationDetails {
  id: string;
  building: string;
  floor: string;
  room: string;
  department: string;
}

export interface Appointment {
  id: string;
  location: Location;
  lockCause: string;
  linkNote: string;
  checkInStatus: string;
  scheduledOn: string;
  description: string;
  locationDetails: LocationDetails;
  physician: string;
  ticketId: string;
  amount: number;
}

export interface PaymentSummary {
  id: string;
  amount: number;
  subtitle: string;
  paymentSystem?: string;
  iuv: string;
  taxCode: string;
  state: string;
  authorityId: string;
  authorityName: string;
  appointments: Appointment[];
  causale?: string;
  numeroRichiesta?: string;
}

export interface FetchPaymentsResponse {
  payments: PaymentSummary[];
}

export interface PayRequest {
  amount: number;
  practiceId: string;
  branchCode: string;
}

export interface PayResponse {
  params: { url: string };
}

export interface PagoPaLinkRequest {
  iuv: string;
  amount: string | number;
  reason: string;
  notificationEmail: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}
  private readonly IS_DEV = true;

  // fetchCardMultiUseConfigPayment() {
  //   if (environment?.pathCardMultiUseConfigPayment) {
  //     const pathMultiUseConfigPayment =
  //       window.document.baseURI + environment.pathCardMultiUseConfigPayment // fetch from assets/tenant/ xxx /config
  //     return this.http.get<CardMultiUseConfig>(pathMultiUseConfigPayment)
  //   }
  //   return throwError(
  //     () => new Error('PAYMENT: pathMultiUseConfigPayment is not defined'),
  //   )
  // }

  fetchPayments() {
    if (this.IS_DEV) {
      return of(PAYMENTS_LIST).pipe(
        delay(500),
        map((response) => response.payments),
      );
    }
    return this.http.get<any>(`checkin/api/payments`).pipe(map((response) => response.payments));
  }

  fetchPaymentSummary(bookingId: string) {
    return this.fetchPayments().pipe(
      switchMap((payments) => {
        const payment = payments.find((payment: any) => payment.id === bookingId);
        if (payment) return of(payment);
        return this.http.get<PaymentSummary>(`checkin/api/payments/${bookingId}`);
      }),
    );
  }

  downloadInvoicePdf(admissionsId: string) {
    if (this.IS_DEV) {
      return this.http.get(`https://pdfobject.com/pdf/sample.pdf`, {
        responseType: 'arraybuffer',
      });
    }
    return this.http.get(`checkin/api/payments/${admissionsId}/pdf`, {
      responseType: 'arraybuffer',
    });
  }

  getPagoPaLink(payment: PagoPaLinkRequest) {
    if (this.IS_DEV) {
      return of(PAGOPA_LINK).pipe(delay(500));
    }
    return this.http.post<any>(`simple-pagopa/api/v1/payment`, payment);
  }
}
