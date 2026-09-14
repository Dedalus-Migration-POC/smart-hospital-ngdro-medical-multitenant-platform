import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { Breadcrumb } from 'src/app/components/breadcrumb/breadcrumb';
import { ImageBlock } from 'src/app/components/image-block/image-block';
import { Spinner } from 'src/app/components/spinner/spinner';
import { PageConfigService } from 'src/app/pages/page-config.service';
import { SmartHospitalState } from 'src/app/store/reducers';
import { selectUserProfile } from 'src/app/pages/user-profile/state/user-profile.selectors';
import { downloadInvoicePdf, fetchPayments, getLinkPagoPa } from '../state/actions';
import {
  selectDownloadingInvoicePdf,
  selectGetPayLoading,
  selectPaymentsData,
  selectPaymentsError,
  selectPaymentsLoading,
} from '../state/selectors';
import {
  getServiceCardsConfigById,
  getServiceCardsItems,
} from 'src/app/shared/utility/cards.utils';
import { CompiledCardsContainer, DataCardAction } from 'src/app/components/card/model';
import { CardActionsService } from 'src/app/shared/services/card-actions.service';
import { Card } from 'src/app/components/card/card';
import { UserProfile } from 'src/app/pages/user-profile/user-profile';

@Component({
  selector: 'app-payment-jcash-details',
  imports: [CommonModule, Spinner, Breadcrumb, ImageBlock, Card],
  templateUrl: './payment-jcash-details.component.html',
  styleUrls: ['./payment-jcash-details.component.scss'],
})
export class PaymentJcashDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(Store<SmartHospitalState>);
  private cardActionsService = inject(CardActionsService);
  private pageConfigService = inject(PageConfigService);

  readonly pageConfig = toSignal(this.pageConfigService.get('/payments-jcash/details'), {
    initialValue: null,
  });

  ngOnInit() {
    if (!this.payments()?.length) {
      this.store.dispatch(fetchPayments());
    }
  }

  retry() {
    this.store.dispatch(fetchPayments());
  }
  paymentId = toSignal(
    this.route.queryParamMap.pipe(map((queryParamMap) => queryParamMap.get('paymentId') ?? '')),
    { initialValue: null },
  );

  payments = this.store.selectSignal(selectPaymentsData);
  paymentsLoading = this.store.selectSignal(selectPaymentsLoading);
  loadingPdf = this.store.selectSignal(selectDownloadingInvoicePdf);
  getPayLoading = this.store.selectSignal(selectGetPayLoading);
  loading = computed(() => this.paymentsLoading() || this.loadingPdf() || this.getPayLoading());
  error = this.store.selectSignal(selectPaymentsError);
  user = this.store.selectSignal(selectUserProfile);

  userData = computed(() => {
    const user = this.user()?.data;
    const userFiscalCode = user?.fiscalCode?.toUpperCase() ?? '';
    if (!user) return null;
    return {
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
      fiscalCode: userFiscalCode.startsWith('TINIT-') ? userFiscalCode.slice(6) : userFiscalCode,
    } as unknown as UserProfile;
  });

  payment = computed(() => {
    const paymentId = this.paymentId();
    const payments = this.payments();

    if (!paymentId || !payments?.length) {
      return null;
    }
    let findPayment = payments.find((item) => item.codiceDistinta === paymentId) ?? null;
    return { ...findPayment, user: this.userData() };
  });

  readonly cardsSectionItems = computed<any[]>(() => {
    return getServiceCardsItems(this.pageConfig()?.sections, '/payments-jcash/details');
  });

  readonly cardsConfig = computed<any>(() =>
    getServiceCardsConfigById(this.cardsSectionItems(), 'payment-card', '/payments-jcash/details'),
  );

  readonly renderedCardsConfig = computed<CompiledCardsContainer>(() => {
    const cardsConfig = this.cardsConfig();
    if (!cardsConfig) return { items: [] };

    const templateCard = cardsConfig.items?.[0];
    return {
      ...cardsConfig,
      items: (this.payment() ? [this.payment()] : []).map((report: any, index: number) => {
        const compiledActions = this.cardActionsService.compileActions(
          report,
          templateCard?.actions as DataCardAction[] | undefined,
          {
            callbackContext: this,
            callbackArgsMode: 'paramsOnly',
          },
        );
        return {
          ...report,
          ...templateCard,
          id: `card-${index + 1}`,
          type: 'data',
          actions: compiledActions,
        } as any;
      }),
    };
  });

  downloadPdf(iuv: string | null) {
    if (!iuv) return;
    this.store.dispatch(downloadInvoicePdf({ iuv }));
  }

  pay() {
    this.store.dispatch(
      getLinkPagoPa({
        payment: {
          iuv:
            this.payment()!.iuv!.length === 17 ? '3' + this.payment()!.iuv! : this.payment()!.iuv!,
          amount: Math.round(this.payment()!.importo! * 100),
          reason: this.arrPrestazioni().join(' /'),
          notificationEmail: this.user()!.data!.email,
        },
      }),
    );
  }
  arrPrestazioni = computed(
    () =>
      this.payment()!
        .prestazioni?.split(';')
        .map((s) => s.trim())
        .filter(Boolean) ?? [],
  );
}
