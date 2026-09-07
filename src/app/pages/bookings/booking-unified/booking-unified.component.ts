import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { SmartHospitalState } from 'src/app/store/reducers';
import { ensureStrutturaSelected } from './ensure-struttura-selected';
import { BookingType, isBookingType, BOOKING_FLOW_LABELS } from './models/booking-type';
import { initBooking, resetState } from './state/actions';
import { selectAnyLoading, selectBookingType } from './state/selectors';
import { BookingUnifiedModalService } from './booking-unified-modal.service';

@Component({
  selector: 'app-booking-unified',
  imports: [RouterOutlet, TranslateModule, DesignAngularKitModule],
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

  protected readonly loading = this.store.selectSignal(selectAnyLoading);
  protected readonly bookingType = this.store.selectSignal(selectBookingType);
  protected readonly flowLabels = BOOKING_FLOW_LABELS;

  constructor() {
    this.bookingUnifiedModalService.register(this.viewContainerRef);
    this.destroyRef.onDestroy(() => this.bookingUnifiedModalService.clear(this.viewContainerRef));
  }

  ngOnInit(): void {
    ensureStrutturaSelected(this.store);

    const bookingType = this.activatedRoute.snapshot.paramMap.get('bookingType');
    if (isBookingType(bookingType)) {
      this.store.dispatch(initBooking({ bookingType: bookingType as BookingType }));
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(resetState());
  }
}
