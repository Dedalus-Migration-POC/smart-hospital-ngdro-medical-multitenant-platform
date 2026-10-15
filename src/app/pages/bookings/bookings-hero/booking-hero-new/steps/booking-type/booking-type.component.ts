import { Component, Input, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
// import { Card as CardComponent } from 'src/app/components/card/card';
// import { Card, CardTextLink, CardType } from 'src/app/components/card/card.model';
import { SmartHospitalState } from 'src/app/store/reducers';
import { BookingStepId, BookingType, OptionBookingType } from '../../../state/model';
import { setActiveStep, setSummaryBooking } from '../../../state/actions';

@Component({
  selector: 'app-booking-select-type',
  standalone: true,
  imports: [DesignAngularKitModule, TranslateModule],
  templateUrl: './booking-type.component.html',
  styleUrls: ['./booking-type.component.scss'],
})
export class BookingTypeComponent implements OnInit {
  private readonly translate = inject(TranslateService);
  private readonly store = inject(Store<SmartHospitalState>);

  bookingType: OptionBookingType[] = [
    {
      id: 'nre',
      descriptionI18n: 'bookings-hero.booking-new.booking-type.nre-description',
      titleI18n: 'bookings-hero.booking-new.booking-type.nre-title',
    },
    {
      id: 'free_prof',
      descriptionI18n: 'bookings-hero.booking-new.booking-type.free_prof-description',
      titleI18n: 'bookings-hero.booking-new.booking-type.free_prof-title',
    },
    {
      id: 'nre_delegate',
      descriptionI18n: 'bookings-hero.booking-new.booking-type.nre_delegate-description',
      titleI18n: 'bookings-hero.booking-new.booking-type.nre_delegate-title',
    },
    {
      id: 'free_prof_delegate',
      descriptionI18n: 'bookings-hero.booking-new.booking-type.free_prof_delegate-description',
      titleI18n: 'bookings-hero.booking-new.booking-type.free_prof_delegate-title',
    },
  ];
  cardTextLink: any[] = [];
  // cardTextLink: Card[] = [];

  ngOnInit(): void {
    this.cardTextLink = this.setCardTextLink(this.bookingType);
  }

  // private setCardTextLink(bookingType: OptionBookingType[]): Card[] {
  private setCardTextLink(bookingType: OptionBookingType[]): any[] {
    let cardTextLink: any[] = [];
    // let cardTextLink: Card[] = [];

    bookingType.forEach((value) => {
      cardTextLink.push({
        id: value.id.toString(),
        title: value.titleI18n,
        description: value.descriptionI18n,
        showArrow: true,
        styleClass: 'shadow-sm border-light w-min-50',
        // type: CardType.TEXT_LINK,
      });
    });

    return cardTextLink;
  }

  // onCardSelected(card: CardTextLink) {
  onCardSelected(card: any) {
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
