import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, take } from 'rxjs';
import { downloadInvoicePdf, fetchPayments } from '../state/payments.actions';
import {
  selectDownloadingInvoicePdf,
  selectPayments,
  selectPaymentsData,
  selectPaymentsError,
  selectPaymentsLoading,
} from '../state/payments.selectors';
import { getTime } from 'date-fns';
import { SmartHospitalState } from '../../../store/reducers';
import { Breadcrumb } from '../../../components/breadcrumb/breadcrumb';
import { Spinner } from '../../../components/spinner/spinner';
import { CommonModule } from '@angular/common';
import { DesignAngularKitModule } from 'design-angular-kit';
import { TranslateModule } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectAppConfig } from '../../../initialize/state/selector';
import { ImageBlock } from '../../../components/image-block/image-block';

@Component({
  selector: 'app-payments-list',
  imports: [CommonModule, Breadcrumb, Spinner, DesignAngularKitModule, TranslateModule, ImageBlock],
  templateUrl: './payments-list.component.html',
  styleUrls: ['./payments-list.component.scss'],
})
export class PaymentsPaList implements OnInit {
  constructor() {}
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private store = inject(Store<SmartHospitalState>);

  readonly pageConfig = toSignal(
    this.store.select(selectAppConfig).pipe(
      take(1),
      map((config) => config.pages.find((page: any) => page.id === '/payments-pa')), //TODO page type
    ),
    { initialValue: null },
  );

  ngOnInit(): void {
    this.store.dispatch(fetchPayments());
  }

  downloadingPdf$ = this.store.selectSignal(selectDownloadingInvoicePdf);
  getStatus(status: string) {
    let title;
    let styleClass;
    switch (status) {
      case 'NOT_PAYED':
        title = 'Da pagare';
        styleClass = 'error';
        break;
      case 'PAYED':
        title = 'Pagato';
        styleClass = 'success';
        break;
      case 'VERIFICATION':
        title = 'In attesa di verifica';
        styleClass = 'warning';
        break;
      default:
        title = undefined;
        styleClass = undefined;
    }

    return { title, styleClass };
  }
  payments = this.store.selectSignal(selectPaymentsData);
  loading = this.store.selectSignal(selectPaymentsLoading);
  error = this.store.selectSignal(selectPaymentsError);

  pendingPayments = computed(
    () => this.payments()?.filter((payment) => payment.state === 'NOT_PAYED') || [],
  );

  paidPayments = computed(
    () => this.payments()?.filter((payment) => payment.state === 'PAYED') || [],
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
}
