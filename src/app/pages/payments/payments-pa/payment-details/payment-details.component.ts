import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take, Observable } from 'rxjs';
import {
  selectDownloadingInvoicePdf,
  selectPagoPaLinkLoading,
  selectPaymentSummaryData,
  selectPaymentSummaryError,
  selectPaymentSummaryLoading,
} from '../state/payments.selectors';
import { downloadInvoicePdf, fetchPaymentSummary, getPagoPaLink } from '../state/payments.actions';
import { TranslateService } from '@ngx-translate/core';
import { selectUserProfile } from 'src/app/pages/user-profile/state/user-profile.selectors';
import { SmartHospitalState } from 'src/app/store/reducers';
import { Spinner } from 'src/app/components/spinner/spinner';
import { Breadcrumb } from 'src/app/components/breadcrumb/breadcrumb';
import { PageConfigService } from 'src/app/pages/page-config.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ImageBlock } from 'src/app/components/image-block/image-block';
import {
  getServiceCardsConfigById,
  getServiceCardsItems,
} from 'src/app/shared/utility/cards.utils';
import { CompiledCardsContainer, DataCardAction } from 'src/app/components/card/model';
import { CardActionsService } from 'src/app/shared/services/card-actions.service';
import { Card } from 'src/app/components/card/card';
import { PaymentSummary } from '../state/payments.model';
import { PageConfig } from 'src/app/pages/page.model';

// campo specifico di questa pagina, non parte del PageConfig condiviso
interface PaymentDetailsPageConfig extends PageConfig {
  isSimplePagoPa?: boolean;
}

@Component({
  selector: 'app-payment-pa-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss'],
  imports: [CommonModule, Spinner, Breadcrumb, ImageBlock, Card],
})
export class PaymentsPaDetails implements OnInit {
  constructor() {}
  private store = inject(Store<SmartHospitalState>);
  private activatedRoute = inject(ActivatedRoute);
  private translate = inject(TranslateService);
  private cardActionsService = inject(CardActionsService);
  private pageConfigService = inject(PageConfigService);

  readonly pageConfig = toSignal(
    this.pageConfigService.get('/payments-pa/details') as Observable<PaymentDetailsPageConfig>,
    { initialValue: null },
  );

  ngOnInit(): void {
    const paymentId = this.paymentId();
    if (paymentId) this.store.dispatch(fetchPaymentSummary({ bookingId: paymentId }));
  }
  retry() {
    const paymentId = this.paymentId();
    if (paymentId) this.store.dispatch(fetchPaymentSummary({ bookingId: paymentId }));
  }

  user = this.store.selectSignal(selectUserProfile);
  paymentId = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map((queryParamMap) => queryParamMap.get('paymentId') ?? ''),
    ),
    { initialValue: null },
  );

  paymentSummary = this.store.selectSignal(selectPaymentSummaryData);
  paymentSummaryLoading = this.store.selectSignal(selectPaymentSummaryLoading);
  paymentSummaryError = this.store.selectSignal(selectPaymentSummaryError);
  loadingPdf = this.store.selectSignal(selectDownloadingInvoicePdf);
  loadingGetPagoPaLink = this.store.selectSignal(selectPagoPaLinkLoading);

  readonly commonLoading = computed(
    () => this.paymentSummaryLoading() || this.loadingPdf() || this.loadingGetPagoPaLink(),
  );

  getAppointmentDescriptions(): string[] {
    return this.paymentSummary()?.appointments?.map((appointment) => appointment.description) ?? [];
  }
  readonly cardsSectionItems = computed<any[]>(() => {
    return getServiceCardsItems(this.pageConfig()?.sections, '/payments-pa/details');
  });

  readonly cardsConfig = computed<any>(() =>
    getServiceCardsConfigById(this.cardsSectionItems(), 'payment-card', '/payments-pa/details'),
  );

  readonly renderedCardsConfig = computed<CompiledCardsContainer>(() => {
    const cardsConfig = this.cardsConfig();
    if (!cardsConfig) return { items: [] };

    const templateCard = cardsConfig.items?.[0];
    return {
      ...cardsConfig,
      items: (this.paymentSummary() ? [this.paymentSummary()] : []).map(
        (report: any, index: number) => {
          const compiledActions = this.cardActionsService.compileActions(
            report,
            templateCard?.actions as DataCardAction[] | undefined,
            {
              callbackContext: this,
              callbackArgsMode: 'sourceAndParams',
            },
          );
          return {
            ...report,
            ...templateCard,
            id: `card-${index + 1}`,
            type: 'data',
            actions: compiledActions,
          } as any;
        },
      ),
    };
  });

  downloadPdf(payment: PaymentSummary) {
    this.store.dispatch(downloadInvoicePdf({ admissionsId: payment.id }));
  }

  pay() {
    this.pageConfig()?.isSimplePagoPa
      ? this.store.dispatch(
          getPagoPaLink({
            payment: {
              iuv: this.paymentSummary()!.iuv!,
              amount: this.paymentSummary()!.amount! * 100,
              reason:
                this.paymentSummary()
                  ?.appointments?.map((appointment) => appointment.description)
                  .join('/') ?? '',
              notificationEmail: this.user()?.data?.email!,
            },
          }),
        )
      : window.open('https://checkout.pagopa.it/inserisci-dati-avviso', '_blank');
  }
}
