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
import { BookingType, isBookingType } from '../models/booking-type';
import { PageConfigService } from 'src/app/pages/page-config.service';
import { Spinner } from 'src/app/components/spinner/spinner';
import { Card } from 'src/app/components/card/card';
import { CardsContainer } from 'src/app/components/card/model';

@Component({
  selector: 'app-booking-type-selector',
  imports: [TranslateModule, Breadcrumb, Spinner, Card],
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

  constructor() {
    this.bookingUnifiedModalService.register(this.viewContainerRef);
    this.destroyRef.onDestroy(() => this.bookingUnifiedModalService.clear(this.viewContainerRef));

    effect(() => {
      const bookingType = this.pendingBookingType();
      if (!bookingType || this.struttureLoading()) return;

      const units = this.strutture();
      this.pendingBookingType.set(null);

      if (this.struttureError() || !units.length) {
        return;
      }

      const selectStructure =
        (this.pageConfig() as { content?: { selectStructure?: boolean } } | null)?.content
          ?.selectStructure ?? true;

      if (units.length === 1 || !selectStructure) {
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

  protected readonly cards = computed<CardsContainer | null>(() => {
    const config = this.pageConfig()
      ?.sections?.flatMap((section) =>
        [section.areas.start, section.areas.center, section.areas.end].flatMap(
          (area) => area?.items ?? [],
        ),
      )
      .find((item) => item.id === 'booking-type-cards' && item.type === 'SERVICE_CARDS');

    if (!config?.enabled || !config.props) return null;

    const cards = config.props as CardsContainer;
    return {
      ...cards,
      items: cards.items.map((card) => {
        if (card.type !== 'mediaText' || card.action.type !== 'callback') return card;
        const bookingType = card.id;
        if (!isBookingType(bookingType)) return card;

        return {
          ...card,
          action: { ...card.action, callback: () => this.onCardClick(bookingType) },
        };
      }),
    };
  });
}
