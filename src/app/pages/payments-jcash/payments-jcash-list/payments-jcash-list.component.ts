import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DesignAngularKitModule } from 'design-angular-kit';
import { map, take } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { Breadcrumb } from '../../../components/breadcrumb/breadcrumb';
import { ImageBlock } from '../../../components/image-block/image-block';
import { Spinner } from '../../../components/spinner/spinner';
import { selectAppConfig } from '../../../initialize/state/selector';
import { SmartHospitalState } from '../../../store/reducers';
import { fetchPayments } from '../state/actions';
import { selectPaymentsData, selectPaymentsError, selectPaymentsLoading } from '../state/selectors';

@Component({
  selector: 'app-payments-jcash-list',
  imports: [CommonModule, Breadcrumb, Spinner, DesignAngularKitModule, TranslateModule, ImageBlock],
  templateUrl: './payments-jcash-list.component.html',
  styleUrls: ['./payments-jcash-list.component.scss'],
})
export class PaymentsJcashListComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private store = inject(Store<SmartHospitalState>);

  readonly pageConfig = toSignal(
    this.store.select(selectAppConfig).pipe(
      take(1),
      map((config) => config.pages.find((page: any) => page.id === '/payments-jcash')),
    ),
    { initialValue: null },
  );

  payments = this.store.selectSignal(selectPaymentsData);
  loading = this.store.selectSignal(selectPaymentsLoading);
  error = this.store.selectSignal(selectPaymentsError);

  pendingPayments = computed(
    () => this.payments()?.filter((payment) => payment.statoDistinta === 'DA PAGARE') || [],
  );

  paidPayments = computed(
    () => this.payments()?.filter((payment) => payment.statoDistinta === 'PAGATA') || [],
  );

  ngOnInit(): void {
    this.store.dispatch(fetchPayments());
  }

  retry() {
    this.store.dispatch(fetchPayments());
  }

  // ALL CALLBACKS FOR CARDMULTIUSE
  // defined in the various payment.json files
  goDetail = (id: string) => {
    this.router.navigate(['details'], {
      relativeTo: this.activatedRoute,
      queryParams: { paymentId: id },
    });
  };
}
