import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map, of, switchMap } from 'rxjs';
import { PAGOPA_LINK, PAYMENTS_LIST } from './payments.mock';
import { PagoPaLinkRequest, PaymentSummary } from './payments.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}
  private readonly IS_DEV = true;

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
