import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DesignAngularKitModule } from 'design-angular-kit';
import { map, take } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { Breadcrumb } from 'src/app/components/breadcrumb/breadcrumb';
import { ImageBlock } from 'src/app/components/image-block/image-block';
import { Spinner } from 'src/app/components/spinner/spinner';
import { selectAppConfig } from 'src/app/initialize/state/selector';
import { SmartHospitalState } from 'src/app/store/reducers';
import { fetchPayments } from '../state/actions';
import { selectPaymentsData, selectPaymentsError, selectPaymentsLoading } from '../state/selectors';
import {
  getServiceCardsConfigById,
  getServiceCardsItems,
} from 'src/app/shared/utility/cards.utils';
import { CompiledCardsContainer, DataCardAction } from 'src/app/components/card/model';
import { CardActionsService } from 'src/app/shared/services/card-actions.service';
import { Payment } from '../state/model';
import { Card } from 'src/app/components/card/card';

@Component({
  selector: 'app-payments-jcash-list',
  imports: [
    CommonModule,
    Breadcrumb,
    Spinner,
    DesignAngularKitModule,
    TranslateModule,
    ImageBlock,
    Card,
  ],
  templateUrl: './payments-jcash-list.component.html',
  styleUrls: ['./payments-jcash-list.component.scss'],
})
export class PaymentsJcashListComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private store = inject(Store<SmartHospitalState>);
  private cardActionsService = inject(CardActionsService);

  readonly pageConfig = toSignal(
    this.store.select(selectAppConfig).pipe(
      take(1),
      map((config) => config.pages.find((page: any) => page.id === '/payments-jcash')),
    ),
    { initialValue: null },
  );

  ngOnInit(): void {
    this.store.dispatch(fetchPayments());
  }

  retry() {
    this.store.dispatch(fetchPayments());
  }

  payments = this.store.selectSignal(selectPaymentsData);
  loading = this.store.selectSignal(selectPaymentsLoading);
  error = this.store.selectSignal(selectPaymentsError);

  pendingPayments = computed(
    () => this.payments()?.filter((payment) => payment.statoDistinta === 'DA PAGARE') || [],
  );

  paidPayments = computed(
    () => this.payments()?.filter((payment) => payment.statoDistinta === 'PAGATA') || [],
  );

  readonly cardsSectionItems = computed<any[]>(() => {
    return getServiceCardsItems(this.pageConfig()?.sections, '/payments-jcash');
  });

  readonly cardsConfig = computed<any>(() =>
    getServiceCardsConfigById(this.cardsSectionItems(), 'payments-jcash-cards', '/payments-jcash'),
  );

  readonly renderedPendingCardsConfig = computed<CompiledCardsContainer>(() =>
    this.buildCardsContainer(this.pendingPayments(), this.cardsConfig()),
  );

  readonly renderedPaidCardsConfig = computed<CompiledCardsContainer>(() =>
    this.buildCardsContainer(this.paidPayments(), this.cardsConfig()),
  );

  private buildCardsContainer(payments: Payment[], cardsTemplate: any): CompiledCardsContainer {
    if (!cardsTemplate) {
      console.error('[PaymentsJcashList] Missing cards template');
      return { items: [] };
    }

    const templateCard = cardsTemplate.items?.[0];
    if (!templateCard) {
      console.error('[PaymentsJcashList] Cards template has no items[0]', cardsTemplate);
      return { ...cardsTemplate, items: [] };
    }

    return {
      ...cardsTemplate,
      items: (payments ?? []).map((report: any, index: number) => {
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
  }

  goDetail = (id: string) => {
    this.router.navigate(['details'], {
      relativeTo: this.activatedRoute,
      queryParams: { paymentId: id },
    });
  };
}
