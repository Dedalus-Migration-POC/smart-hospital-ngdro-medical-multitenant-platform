import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { DesignAngularKitModule } from 'design-angular-kit';
import { TranslateModule } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Breadcrumb } from 'src/app/components/breadcrumb/breadcrumb';
import { Spinner } from 'src/app/components/spinner/spinner';
import { ImageBlock } from 'src/app/components/image-block/image-block';
import { Card } from 'src/app/components/card/card';
import { CompiledCardsContainer } from 'src/app/components/card/model';
import { PageConfigService } from 'src/app/pages/page-config.service';
import { SmartHospitalState } from 'src/app/store/reducers';
import {
  getServiceCardsConfigById,
  getServiceCardsItems,
} from 'src/app/shared/utility/cards.utils';
import { CardActionsService } from 'src/app/shared/services/card-actions.service';
import {
  downloadInvoicePdf as downloadInvoicePdfAction,
  fetchPaymentList,
  fetchPendingPaymentList,
  payNexi,
  payNexiConfirmKO,
  payNexiConfirmOK,
} from '../state/actions';
import {
  selectDownloadingInvoicePdf,
  selectPayNexi,
  selectPayments,
  selectPendingPayments,
} from '../state/selectors';
import { Appointment, Payment, PayRequest, StatusNexiPay } from '../state/model';
import { PaymentA4hConfirmComponent } from '../payment-a4h-confirm/payment-a4h-confirm.component';

@Component({
  selector: 'app-payments-a4h-list',
  imports: [
    CommonModule,
    RouterModule,
    DesignAngularKitModule,
    TranslateModule,
    Breadcrumb,
    Spinner,
    ImageBlock,
    Card,
    PaymentA4hConfirmComponent,
  ],
  templateUrl: './payments-a4h-list.component.html',
  styleUrls: ['./payments-a4h-list.component.scss'],
  providers: [DatePipe],
})
export class PaymentsA4hListComponent implements OnInit {
  private store = inject(Store<SmartHospitalState>);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pageConfigService = inject(PageConfigService);
  private cardActionsService = inject(CardActionsService);
  private datePipe = inject(DatePipe);

  readonly pageConfig = toSignal(this.pageConfigService.get('/payments-a4h'), {
    initialValue: null,
  });

  readonly StatusNexiPay = StatusNexiPay;

  isPayNexi = signal(false);
  isPayNexiConfirm = signal(false);
  selectedAmount = signal<number | undefined>(undefined);
  statusNexiPay = signal<StatusNexiPay | null>(null);

  payments = this.store.selectSignal(selectPayments);
  pendingPayments = this.store.selectSignal(selectPendingPayments);
  payNexiState = this.store.selectSignal(selectPayNexi);
  downloadingInvoicePdf = this.store.selectSignal(selectDownloadingInvoicePdf);

  readonly isLoading = computed(
    () =>
      this.payNexiState().loading ||
      this.pendingPayments().loading ||
      this.payments().loading ||
      this.downloadingInvoicePdf(),
  );

  readonly cardsSectionItems = computed<any[]>(() =>
    getServiceCardsItems(this.pageConfig()?.sections, '/payments-a4h'),
  );

  readonly pendingCardsConfig = computed<any>(() =>
    getServiceCardsConfigById(
      this.cardsSectionItems(),
      'payments-a4h-pending-cards',
      '/payments-a4h',
    ),
  );

  readonly paidCardsConfig = computed<any>(() =>
    getServiceCardsConfigById(this.cardsSectionItems(), 'payments-a4h-paid-cards', '/payments-a4h'),
  );

  readonly renderedPendingCardsConfig = computed<CompiledCardsContainer>(() =>
    this.buildCardsContainer(this.pendingPayments().payments ?? [], this.pendingCardsConfig()),
  );

  readonly renderedPaidCardsConfig = computed<CompiledCardsContainer>(() =>
    this.buildCardsContainer(this.payments().payments, this.paidCardsConfig()),
  );

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (Object.keys(params).length > 0) {
        const codTrans = params['codTrans'];
        if (codTrans && codTrans.length > 0) {
          this.isPayNexiConfirm.set(true);

          if (this.isValidStatusNexiPay(params['esito'])) {
            this.statusNexiPay.set(params['esito']);

            if (params['esito'] === StatusNexiPay.OK) {
              this.store.dispatch(payNexiConfirmOK({ codTrans }));
            } else if (params['esito'] === StatusNexiPay.KO) {
              this.store.dispatch(payNexiConfirmKO({ codTrans }));
            } else if (params['esito'] === StatusNexiPay.ANNULLO) {
              this.isPayNexiConfirm.set(false);
            }
          }
        }
        this.removeQueryParams();
      }
    });

    if (!this.isPayNexiConfirm()) {
      this.store.dispatch(fetchPendingPaymentList());
      this.store.dispatch(fetchPaymentList());
    }
  }

  retryPending(): void {
    this.store.dispatch(fetchPendingPaymentList());
  }

  retryPaid(): void {
    this.store.dispatch(fetchPaymentList());
  }

  // callback usata dalle card di tipo "data" nella sezione da pagare (vedi payments-a4h.json)
  payNexiFromCard(amount: number, structureId: string, episodeNumber: string): void {
    this.toPayNexi({ amount, structureId, episodeNumber: [episodeNumber] });
  }

  downloadInvoicePdf(invoiceId: string): void {
    this.store.dispatch(downloadInvoicePdfAction({ invoiceId }));
  }

  private toPayNexi(payRequest: PayRequest | null): void {
    if (payRequest) {
      this.isPayNexi.set(true);
      this.selectedAmount.set(payRequest.amount);
      this.store.dispatch(payNexi({ payRequest }));
    }
  }

  private buildCardsContainer(
    payments: Appointment[] | Payment[],
    cardsTemplate: any,
  ): CompiledCardsContainer {
    if (!cardsTemplate) {
      console.error('[PaymentsA4hList] Missing cards template');
      return { items: [] };
    }

    const templateCard = cardsTemplate.items?.[0];
    if (!templateCard) {
      console.error('[PaymentsA4hList] Cards template has no items[0]', cardsTemplate);
      return { ...cardsTemplate, items: [] };
    }

    return {
      ...cardsTemplate,
      items: payments.map((payment: any, index: number) => {
        const cardData = this.toCardData(payment);
        return {
          ...cardData,
          ...templateCard,
          id: `payment-a4h-card-${payment.id ?? payment.episodeNumber ?? index}`,
          type: 'data',
          actions: this.cardActionsService.compileActions(cardData, templateCard.actions, {
            callbackContext: this,
            callbackArgsMode: 'paramsOnly',
          }),
        };
      }),
    };
  }

  // pending appointments hanno gli ordini annidati (order.activity.name):
  // appiattiti qui perché le card leggono solo proprietà dirette dell'item (itemKey),
  // e arricchiti con "summary" (nome + data) per il campo array che elenca le prestazioni
  private toCardData(payment: Appointment | Payment): Record<string, unknown> {
    if ('orders' in payment) {
      return {
        ...payment,
        orders: payment.orders.map((order) => ({
          ...order,
          scheduledOn:
            this.datePipe.transform(order.scheduledOn, 'dd/MM/yyyy HH:mm') ?? order.scheduledOn,
        })),
      };
    }

    return {
      ...payment,
      prescriptions: payment.prescriptions.map((prescription) => ({
        ...prescription,
        scheduledOn:
          this.datePipe.transform(prescription.scheduledOn, 'dd/MM/yyyy HH:mm') ??
          prescription.scheduledOn,
      })),
    };
  }

  private removeQueryParams(): void {
    this.router.navigate([], { replaceUrl: true, queryParams: {} });
  }

  private isValidStatusNexiPay(value: any): value is StatusNexiPay {
    return Object.values(StatusNexiPay).includes(value);
  }
}
