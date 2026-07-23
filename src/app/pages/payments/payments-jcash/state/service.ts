import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PAYMENTS_JCASH_LIST } from './mock';
import { delay, map, of } from 'rxjs';
import { LinkPagoPaRequest, Payment } from './model';
// import { environment } from 'src/environments/environment';
// import { CardMultiUseConfig } from 'src/app/components/card/card.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentJcashService {
  constructor(private http: HttpClient) {}
  private readonly IS_DEV = true;

  private baseUrl = 'sh-jcash-integration/api/jcash';

  // fetchCardMultiUseConfigPayment() {
  //   if (environment?.pathCardMultiUseConfigPayment) {
  //     const pathMultiUseConfigPayment =
  //       window.document.baseURI + environment.pathCardMultiUseConfigPayment;
  //     return this.http.get<CardMultiUseConfig>(pathMultiUseConfigPayment);
  //   }
  //   return throwError(
  //     () => new Error('PAYMENT JS: pathMultiUseConfigPayment is not defined'),
  //   );
  // }

  fetchPayments() {
    if (this.IS_DEV) {
      return of(PAYMENTS_JCASH_LIST).pipe(delay(500));
    }
    return this.http.get<Array<Payment>>(`${this.baseUrl}/iuv-list`);
  }

  getPagoPaLink(payment: LinkPagoPaRequest) {
    return this.http.post<any>(`simple-pagopa/api/v1/payment`, payment);
  }

  downloadInvoicePdf(iuv: string) {
    if (this.IS_DEV) {
      return this.http.get(`https://pdfobject.com/pdf/sample.pdf`, {
        responseType: 'arraybuffer',
      });
    }
    return this.http
      .get<{ pdf: string }>(`${this.baseUrl}/invoice/${iuv}`)
      .pipe(map((res) => this.base64ToArrayBuffer(res.pdf)));
  }

  private base64ToArrayBuffer(b64: string): ArrayBuffer {
    const binary = atob(b64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
