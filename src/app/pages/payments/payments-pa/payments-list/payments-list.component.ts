import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { downloadInvoicePdf, fetchPayments } from '../state/payments.actions';
import {
  selectDownloadingInvoicePdf,
  selectPaymentsData,
  selectPaymentsError,
  selectPaymentsLoading,
} from '../state/payments.selectors';
import { SmartHospitalState } from 'src/app/store/reducers';
import { Breadcrumb } from 'src/app/components/breadcrumb/breadcrumb';
import { Spinner } from 'src/app/components/spinner/spinner';
import { CommonModule } from '@angular/common';
import { DesignAngularKitModule } from 'design-angular-kit';
import { TranslateModule } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectAppConfig } from 'src/app/initialize/state/selector';
import { ImageBlock } from 'src/app/components/image-block/image-block';
import { Card } from 'src/app/components/card/card';
import { CompiledCardsContainer } from 'src/app/components/card/model';
import { PaymentSummary } from '../state/payments.service';
import {
  getServiceCardsConfigById,
  getServiceCardsItems,
} from 'src/app/shared/utility/cards.utils';
import { CardActionsService } from 'src/app/shared/services/card-actions.service';

@Component({
  selector: 'app-payments-list',
  imports: [
    CommonModule,
    Breadcrumb,
    Spinner,
    DesignAngularKitModule,
    TranslateModule,
    ImageBlock,
    Card,
  ],
  templateUrl: './payments-list.component.html',
  styleUrls: ['./payments-list.component.scss'],
})
export class PaymentsPaList implements OnInit {
  constructor() {}
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private store = inject(Store<SmartHospitalState>);
  private cardActionsService = inject(CardActionsService);

  readonly pageConfig = toSignal(
    this.store
      .select(selectAppConfig)
      .pipe(map((config) => config.pages.find((page: any) => page.id === '/payments-pa'))),
    { initialValue: null },
  );

  ngOnInit(): void {
    this.store.dispatch(fetchPayments());
  }

  downloadingPdf$ = this.store.selectSignal(selectDownloadingInvoicePdf);
  // getStatus(status: string) {
  //   let title;
  //   let styleClass;
  //   switch (status) {
  //     case 'NOT_PAYED':
  //       title = 'Da pagare';
  //       styleClass = 'error';
  //       break;
  //     case 'PAYED':
  //       title = 'Pagato';
  //       styleClass = 'success';
  //       break;
  //     case 'VERIFICATION':
  //       title = 'In attesa di verifica';
  //       styleClass = 'warning';
  //       break;
  //     default:
  //       title = undefined;
  //       styleClass = undefined;
  //   }

  //   return { title, styleClass };
  // }
  payments = this.store.selectSignal(selectPaymentsData);
  loading = this.store.selectSignal(selectPaymentsLoading);
  error = this.store.selectSignal(selectPaymentsError);

  pendingPayments = computed(
    () => this.payments()?.filter((payment) => payment.state === 'NOT_PAYED') || [],
  );

  paidPayments = computed(
    () => this.payments()?.filter((payment) => payment.state === 'PAYED') || [],
  );

  readonly cardsSectionItems = computed<any[]>(() => {
    return getServiceCardsItems(this.pageConfig()?.sections, '/payments-pa');
  });

  readonly cardsConfig = computed<any>(() =>
    getServiceCardsConfigById(this.cardsSectionItems(), 'payments-pa-cards', '/payments-pa'),
  );

  readonly renderedPendingCardsConfig = computed<CompiledCardsContainer>(() =>
    this.buildCardsContainer(this.pendingPayments(), this.cardsConfig()),
  );

  readonly renderedPaidCardsConfig = computed<CompiledCardsContainer>(() =>
    this.buildCardsContainer(this.paidPayments(), this.cardsConfig()),
  );

  retry(): void {
    this.store.dispatch(fetchPayments());
  }

  downloadPdf(admissionsId: string) {
    this.store.dispatch(downloadInvoicePdf({ admissionsId }));
  }

  // ALL CALLBACKS FOR CARDMULTIUSE
  // defined in the various payment.json files
  goDetail = (paymentId: string) => {
    this.router.navigate([`details`], {
      relativeTo: this.activatedRoute,
      queryParams: { paymentId: paymentId },
    });
  };

  private buildCardsContainer(
    payments: PaymentSummary[],
    cardsTemplate: any,
  ): CompiledCardsContainer {
    if (!cardsTemplate) {
      console.error('[PaymentsPaList] Missing cards template');
      return { items: [] };
    }

    const templateCard = cardsTemplate.items?.[0];
    if (!templateCard) {
      console.error('[PaymentsPaList] Cards template has no items[0]', cardsTemplate);
      return { ...cardsTemplate, items: [] };
    }

    return {
      ...cardsTemplate,
      items: payments.map((payment, index) => {
        const paymentCardData = this.toCardData(payment);
        return {
          ...paymentCardData,
          ...templateCard,
          id: `payment-card-${payment.id ?? index}`,
          type: 'data',
          actions: this.cardActionsService.compileActions(paymentCardData, templateCard.actions, {
            callbackContext: this,
            callbackArgsMode: 'paramsOnly',
          }),
        };
      }),
    };
  }

  private toCardData(payment: PaymentSummary): Record<string, unknown> {
    return {
      ...payment,
      appointmentDate: this.getFirstAppointmentDate(payment),
      state: payment.state,
    };
  }

  private getFirstAppointmentDate(payment: PaymentSummary): string | null {
    const firstAppointmentDate = payment.appointments
      ?.map((appointment) => appointment?.scheduledOn)
      ?.find((scheduledOn) => Boolean(scheduledOn));

    return firstAppointmentDate ?? null;
  }

}
