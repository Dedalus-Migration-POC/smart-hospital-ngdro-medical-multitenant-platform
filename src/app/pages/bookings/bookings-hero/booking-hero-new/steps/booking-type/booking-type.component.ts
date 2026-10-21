import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Card } from 'src/app/components/card/card';
import { CardsContainer } from 'src/app/components/card/model';
import { PageConfigService } from 'src/app/pages/page-config.service';
import { SmartHospitalState } from 'src/app/store/reducers';
import { BookingStepId } from '../../../state/model';
import { setActiveStep, setSummaryBooking } from '../../../state/actions';

@Component({
  selector: 'app-booking-select-type',
  imports: [Card, TranslateModule],
  templateUrl: './booking-type.component.html',
  styleUrls: ['./booking-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingTypeComponent {
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly pageConfigService = inject(PageConfigService);
  private readonly pageConfig = toSignal(this.pageConfigService.get('/bookings-hero/new'), {
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
    switch (card.id) {
      case 'nre':
        this.store.dispatch(
          setSummaryBooking({
            payload: {
              bookingType: 'nre',
            },
          }),
        );
        this.store.dispatch(setActiveStep({ step: BookingStepId.PrescriptionUpload }));
        break;
      case 'free_prof':
        this.store.dispatch(
          setSummaryBooking({
            payload: {
              bookingType: 'free_prof',
            },
          }),
        );
        this.store.dispatch(setActiveStep({ step: BookingStepId.SelectMedicalService }));

        break;
      case 'nre_delegate':
        this.store.dispatch(
          setSummaryBooking({
            payload: {
              bookingType: 'nre_delegate',
            },
          }),
        );
        this.store.dispatch(setActiveStep({ step: BookingStepId.Delega }));

        break;
      case 'free_prof_delegate':
        this.store.dispatch(
          setSummaryBooking({
            payload: {
              bookingType: 'free_prof_delegate',
            },
          }),
        );
        this.store.dispatch(setActiveStep({ step: BookingStepId.Delega }));

        break;
      default:
    }
  }
}
