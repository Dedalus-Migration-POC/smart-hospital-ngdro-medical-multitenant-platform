import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { SmartHospitalState } from 'src/app/store/reducers';
import { ensureStrutturaSelected } from './ensure-struttura-selected';
import { BookingType, isBookingType, BOOKING_FLOW_LABELS } from './models/booking-type';
import { initBooking, resetState } from './state/actions';
import { selectAnyLoading, selectBookingType } from './state/selectors';
import { BookingUnifiedModalService } from './booking-unified-modal.service';
import { BookingResumeService } from './booking-resume.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Breadcrumb } from 'src/app/components/breadcrumb/breadcrumb';
import { BreadcrumbService } from 'src/app/components/breadcrumb/breadcrumb.service';
import { Spinner } from 'src/app/components/spinner/spinner';
import { PageConfigService } from '../../page-config.service';
import { ConsentPdfService } from 'src/app/pages/user-profile/a4h-consents/consents-privacy-a4h.service';

@Component({
  selector: 'app-booking-unified',
  imports: [RouterOutlet, TranslateModule, DesignAngularKitModule, Breadcrumb, Spinner],
  templateUrl: './booking-unified.component.html',
  styleUrls: ['./booking-unified.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingUnifiedComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly bookingUnifiedModalService = inject(BookingUnifiedModalService);
  private readonly consentPdfService = inject(ConsentPdfService);
  private readonly bookingResumeService = inject(BookingResumeService);
  private breadcrumbService = inject(BreadcrumbService);
  private translateService = inject(TranslateService);

  protected readonly loading = this.store.selectSignal(selectAnyLoading);
  protected readonly bookingType = this.store.selectSignal(selectBookingType);
  protected readonly flowLabels = BOOKING_FLOW_LABELS;
  private readonly pageConfigService = inject(PageConfigService);

  constructor() {
    this.bookingUnifiedModalService.register(this.viewContainerRef);
    this.destroyRef.onDestroy(() => this.bookingUnifiedModalService.clear(this.viewContainerRef));
    this.consentPdfService.register(this.viewContainerRef);
    this.destroyRef.onDestroy(() => this.consentPdfService.clear(this.viewContainerRef));
  }

  readonly pageConfig = toSignal(this.pageConfigService.get('/booking-a4h'), {
    initialValue: null,
  });

  readonly breadcrumbConfig = computed(() => {
    const config = this.pageConfig();
    const bookingType = this.bookingType();
    const test = this.translateService.instant('booking-a4h.' + bookingType);
    if (!config?.breadcrumb) return null;

    return this.breadcrumbService.interpolateConfig(config.breadcrumb, {
      bookingType: bookingType ? test : '',
    });
  });

  ngOnInit(): void {
    const bookingType = this.activatedRoute.snapshot.paramMap.get('bookingType');
    if (isBookingType(bookingType)) {
      this.store.dispatch(initBooking({ bookingType: bookingType as BookingType }));
      const restoredUrl = this.bookingResumeService.restore(bookingType);
      if (!restoredUrl) {
        ensureStrutturaSelected(this.store);
      }
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(resetState());
  }
}
