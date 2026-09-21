import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { Payment, PaymentPending, PayRequest, PayResponseNexiOK } from './model';
import { LIST_PAYMENTS_A4H, PAYMENTS_A4H_KO, PAYMENTS_A4H_OK, PENDING_PAYMENTS_A4H } from './mock';

@Injectable({ providedIn: 'root' })
export class PaymentsA4hService {
  private readonly BASE_URL = '/payment/api/pay';
  private readonly http = inject(HttpClient);
  private readonly IS_DEV = true;

  constructor() {}

  fetchPaymentList(): Observable<Payment[]> {
    if (this.IS_DEV) {
      return of(LIST_PAYMENTS_A4H).pipe(delay(500));
    }
    return this.http.get<Payment[]>(`${this.BASE_URL}/list`);
  }

  fetchPendingPaymentList(): Observable<PaymentPending> {
    if (this.IS_DEV) {
      return of(PENDING_PAYMENTS_A4H).pipe(delay(500));
    }
    return this.http.get<PaymentPending>(`${this.BASE_URL}/pending`);
  }

  downloadInvoicePdf(invoiceId: string): Observable<ArrayBuffer> {
    return this.http.get(`${this.BASE_URL}/invoice/${invoiceId}`, {
      responseType: 'arraybuffer',
    });
  }

  payNexi(payRequest: PayRequest): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}`, payRequest);
  }

  confirmOKNexiPayment(codTrans: string): Observable<Array<PayResponseNexiOK>> {
    if (this.IS_DEV) {
      return of(PAYMENTS_A4H_OK).pipe(delay(500));
    }
    const requestUrl = `${this.BASE_URL}/ok?codTrans=${codTrans}`;
    return this.http.get<Array<PayResponseNexiOK>>(requestUrl);
  }

  confirmKONexiPayment(codTrans: string): Observable<any> {
    if (this.IS_DEV) {
      return of(PAYMENTS_A4H_KO).pipe(delay(500));
    }
    const requestUrl = `${this.BASE_URL}/ko?codTrans=${codTrans}`;
    return this.http.get<any>(requestUrl);
  }
}
