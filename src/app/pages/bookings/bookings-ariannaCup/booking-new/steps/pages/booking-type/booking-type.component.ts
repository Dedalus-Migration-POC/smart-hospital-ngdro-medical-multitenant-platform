import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Card } from 'src/app/components/card/card';
import { CardsContainer } from 'src/app/components/card/model';
import { PageConfigService } from 'src/app/pages/page-config.service';
import { setBookingType } from 'src/app/pages/bookings/bookings-ariannaCup/state/actions';
import { BookingType } from 'src/app/pages/bookings/bookings-ariannaCup/state/model';
import { SmartHospitalState } from 'src/app/store/reducers';
import { SessionStorageKey, SessionStorageUtils } from 'src/app/utility/session-storage-utils';

@Component({
  selector: 'app-booking-select-type',
  imports: [Card, TranslateModule],
  templateUrl: './booking-type.component.html',
  styleUrls: ['./booking-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingTypeComponent {
  readonly setActiveStep = input.required<(stepIndex: number) => void>();
  readonly activeStepIndex = input.required<number>();

  private readonly store = inject(Store<SmartHospitalState>);
  private readonly pageConfigService = inject(PageConfigService);
  private readonly pageConfig = toSignal(this.pageConfigService.get('/bookings/new'), {
    initialValue: null,
  });

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
        return {
          ...card,
          action: { ...card.action, callback: () => this.onCardSelected(card) },
        };
      }),
    };
  });

  onCardSelected(card: { id: string }) {
    if (card.id !== '1' && card.id !== '2') return;
    const selectedCard = this.cards()?.items.find((item) => item.id === card.id);
    if (selectedCard?.type !== 'mediaText') return;

    const selectedBookingType: BookingType = {
      id: selectedCard.id,
      titleI18n: selectedCard.text.title.text,
      descriptionI18n: selectedCard.text.subTitle?.text ?? '',
    };

    SessionStorageUtils.setItem(SessionStorageKey.bookingType, JSON.stringify(selectedBookingType));

    this.store.dispatch(setBookingType({ request: selectedBookingType }));

    if (selectedBookingType.id === '1') {
      this.setActiveStep()(this.activeStepIndex() + 1);
    } else {
      this.setActiveStep()(4);
    }
  }
}
