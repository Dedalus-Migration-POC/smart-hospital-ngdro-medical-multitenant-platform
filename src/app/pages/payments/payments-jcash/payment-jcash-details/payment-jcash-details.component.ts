import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { Breadcrumb } from 'src/app/components/breadcrumb/breadcrumb';
import { ImageBlock } from 'src/app/components/image-block/image-block';
import { Spinner } from 'src/app/components/spinner/spinner';
import { selectAppConfig } from 'src/app/initialize/state/selector';
import { SmartHospitalState } from 'src/app/store/reducers';
import { selectUserProfile } from 'src/app/pages/user-profile/state/user-profile.selectors';
import { fetchPayments } from '../state/actions';
import { selectPaymentsData, selectPaymentsError, selectPaymentsLoading } from '../state/selectors';
import { PaymentInvoiceCardComponent } from './payment-invoice-card/payment-invoice-card.component';

@Component({
  selector: 'app-payment-jcash-details',
  imports: [CommonModule, PaymentInvoiceCardComponent, Spinner, Breadcrumb, ImageBlock],
  templateUrl: './payment-jcash-details.component.html',
  styleUrls: ['./payment-jcash-details.component.scss'],
})
export class PaymentJcashDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(Store<SmartHospitalState>);

  readonly pageConfig = toSignal(
    this.store
      .select(selectAppConfig)
      .pipe(
        map((config) => config.pages.find((page: any) => page.id === '/payments-jcash/details')),
      ),
    { initialValue: null },
  );

  paymentId = toSignal(
    this.route.queryParamMap.pipe(map((queryParamMap) => queryParamMap.get('paymentId') ?? '')),
    { initialValue: null },
  );

  payments = this.store.selectSignal(selectPaymentsData);
  loading = this.store.selectSignal(selectPaymentsLoading);
  error = this.store.selectSignal(selectPaymentsError);
  user = this.store.selectSignal(selectUserProfile);

  payment = computed(() => {
    const paymentId = this.paymentId();
    const payments = this.payments();

    if (!paymentId || !payments?.length) {
      return null;
    }

    return payments.find((item) => item.codiceDistinta === paymentId) ?? null;
  });

  ngOnInit() {
    if (!this.payments()?.length) {
      this.store.dispatch(fetchPayments());
    }
  }

  retry() {
    this.store.dispatch(fetchPayments());
  }
}
