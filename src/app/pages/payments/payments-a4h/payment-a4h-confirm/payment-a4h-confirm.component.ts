import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { DesignAngularKitModule } from 'design-angular-kit';
import { TranslateModule } from '@ngx-translate/core';
import { map } from 'rxjs';
import { SmartHospitalState } from 'src/app/store/reducers';
import { downloadInvoicePdf, downloadInvoicePdfFailure } from '../state/actions';
import { selectPayNexiConfirmKO, selectPayNexiConfirmOK } from '../state/selectors';
import { StatusNexiPay } from '../state/model';

@Component({
  selector: 'app-payment-a4h-confirm',
  imports: [CommonModule, DesignAngularKitModule, TranslateModule],
  templateUrl: './payment-a4h-confirm.component.html',
  styleUrls: ['./payment-a4h-confirm.component.scss'],
})
export class PaymentA4hConfirmComponent {
  readonly resultNexiPay = input.required<StatusNexiPay | null>();

  readonly StatusNexiPay = StatusNexiPay;

  private store = inject(Store<SmartHospitalState>);

  confirmOK$ = this.store.select(selectPayNexiConfirmOK).pipe(
    map((data: { error: boolean; loading: boolean; invoiceId: string }) => ({
      loading: data.loading,
      error: data.error,
      invoiceId: data.invoiceId,
    })),
  );

  confirmKO$ = this.store.select(selectPayNexiConfirmKO).pipe(
    map((data: { error: boolean; loading: boolean }) => ({
      loading: data.loading,
      error: data.error,
    })),
  );

  downloadInvoicePdf(invoiceId: string): void {
    if (invoiceId.trim().length === 0) {
      this.store.dispatch(downloadInvoicePdfFailure({ error: new Error() }));
    } else {
      this.store.dispatch(downloadInvoicePdf({ invoiceId }));
    }
  }
}
