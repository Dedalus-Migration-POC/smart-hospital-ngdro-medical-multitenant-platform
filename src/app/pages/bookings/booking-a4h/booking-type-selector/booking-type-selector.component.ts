import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { Breadcrumb } from 'src/app/components/breadcrumb/breadcrumb';
import { SmartHospitalState } from 'src/app/store/reducers';
import {
  fetchStrutture,
  setSelectedStruttura,
} from 'src/app/pages/bookings/booking-a4h/state/struttura/struttura.actions';
import {
  selectAllStrutture,
  selectStruttureError,
  selectStruttureLoading,
} from 'src/app/pages/bookings/booking-a4h/state/struttura/struttura.selectors';
import { BookingUnifiedModalService } from '../booking-unified-modal.service';
import { BookingType } from '../models/booking-type';
import { PageConfigService } from 'src/app/pages/page-config.service';
import { Spinner } from 'src/app/components/spinner/spinner';

@Component({
  selector: 'app-booking-type-selector',
  imports: [TranslateModule, DesignAngularKitModule, Breadcrumb, Spinner],
  templateUrl: './booking-type-selector.component.html',
  styleUrls: ['./booking-type-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingTypeSelectorComponent {
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly bookingUnifiedModalService = inject(BookingUnifiedModalService);
  private readonly strutture = this.store.selectSignal(selectAllStrutture);
  readonly struttureLoading = this.store.selectSignal(selectStruttureLoading);
  private readonly struttureError = this.store.selectSignal(selectStruttureError);
  private readonly pendingBookingType = signal<BookingType | null>(null);

  private readonly pageConfigService = inject(PageConfigService);

  readonly pageConfig = toSignal(this.pageConfigService.get('/booking-a4h'), {
    initialValue: null,
  });

  protected readonly breadcrumbConfig = computed(() => {
    const config = this.pageConfig();
    if (!config?.breadcrumb) return null;

    return {
      ...config.breadcrumb,
      items: config.breadcrumb.items.slice(0, -1),
    };
  });

  // Se false, la struttura viene scelta automaticamente (la prima della
  // risposta) e la modale non viene mostrata.
  private readonly SHOW_STRUTTURA_SELECTION = true;

  constructor() {
    this.bookingUnifiedModalService.register(this.viewContainerRef);
    this.destroyRef.onDestroy(() => this.bookingUnifiedModalService.clear(this.viewContainerRef));

    effect(() => {
      const bookingType = this.pendingBookingType();
      if (!bookingType || this.struttureLoading()) return;

      const units = this.strutture();
      this.pendingBookingType.set(null);

      if (this.struttureError() || !units.length) {
        this.goToFlow(bookingType);
        return;
      }

      if (units.length === 1 || !this.SHOW_STRUTTURA_SELECTION) {
        this.store.dispatch(setSelectedStruttura({ struttura: units[0] }));
        this.goToFlow(bookingType);
        return;
      }

      this.bookingUnifiedModalService.openSelectStruttura({
        units,
        onSelect: (selectedUnit) => {
          this.store.dispatch(setSelectedStruttura({ struttura: selectedUnit }));
          this.goToFlow(bookingType);
        },
      });
    });
  }

  onCardClick(bookingType: BookingType) {
    this.store.dispatch(fetchStrutture());
    this.pendingBookingType.set(bookingType);
  }

  private goToFlow(bookingType: BookingType) {
    this.router.navigate([bookingType], { relativeTo: this.activatedRoute });
  }

  protected readonly cards = [
    {
      imageUrl: 'assets/images/ricetta_ssn.svg',
      targetUrl: BookingType.Ssn,
    },
    {
      imageUrl: 'assets/images/senza_scelta_medico.svg',
      targetUrl: BookingType.NoDocSelect,
    },
    {
      imageUrl: 'assets/images/con_scelta_medico.svg',
      targetUrl: BookingType.WithDocSelect,
    },
    {
      imageUrl: 'assets/images/concept_medici.svg',
      targetUrl: BookingType.Physicians,
    },
  ];
}
