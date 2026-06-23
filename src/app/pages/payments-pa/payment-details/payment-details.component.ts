import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';
import { selectPaymentSummary } from '../state/payments.selectors';
import { fetchPaymentSummary } from '../state/payments.actions';
import { TranslateService } from '@ngx-translate/core';
import { selectUserProfile } from '../../user-profile/state/user-profile.selectors';
import { SmartHospitalState } from '../../../store/reducers';
import { PaymentNoticeCardNewComponent } from './payment-notice-card-new/payment-notice-card-new.component';
import { Spinner } from '../../../components/spinner/spinner';
import { Breadcrumb } from '../../../components/breadcrumb/breadcrumb';
import { selectAppConfig } from '../../../initialize/state/selector';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-pa-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss'],
  imports: [CommonModule, PaymentNoticeCardNewComponent, Spinner, Breadcrumb],
})
export class PaymentsPaDetails implements OnInit {
  constructor() {}
  private store = inject(Store<SmartHospitalState>);
  private activatedRoute = inject(ActivatedRoute);
  private translate = inject(TranslateService);

  readonly pageConfig = toSignal(
    this.store.select(selectAppConfig).pipe(
      take(1),
      map((config) => config.pages.find((page: any) => page.id === '/payments-pa/details')), //TODO page type
    ),
    { initialValue: null },
  );

  user = this.store.selectSignal(selectUserProfile);
  paymentId = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map((queryParamMap) => queryParamMap.get('paymentId') ?? ''),
    ),
    { initialValue: null },
  );

  paymentSummary = this.store.selectSignal(selectPaymentSummary);
  payment = computed(() => {
    const payment = this.paymentSummary();
    if (!payment?.data) return null;

    return {
      causal: payment.data.appointments.map((appointment) => appointment.description) || [],
      // causal : appointment.description,
      id: payment.data.id,
      iuv: payment.data.iuv,
      amount: payment.data.amount,
      creditors: payment.data.authorityName,
      creditorsFiscalCode: payment.data.taxCode,
      noticeCode: payment.data.iuv,
      paymentStatus: payment.data.state,
    };
  });

  retry() {
    const paymentId = this.paymentId();
    if (paymentId) this.store.dispatch(fetchPaymentSummary({ bookingId: paymentId }));
  }

  ngOnInit(): void {
    const paymentId = this.paymentId();

    if (paymentId) this.store.dispatch(fetchPaymentSummary({ bookingId: paymentId }));
  }
}
