import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { setBookingType } from 'src/app/pages/bookings-ariannaCup/state/actions';
import { BookingType } from 'src/app/pages/bookings-ariannaCup/state/model';
import { SmartHospitalState } from 'src/app/store/reducers';
import { SessionStorageKey, SessionStorageUtils } from 'src/app/utility/session-storage-utils';

@Component({
  selector: 'app-booking-select-type',
  standalone: true,
  imports: [CommonModule, DesignAngularKitModule, TranslateModule],
  templateUrl: './booking-type.component.html',
  styleUrls: ['./booking-type.component.scss'],
})
export class BookingTypeComponent {
  readonly setActiveStep = input.required<(stepIndex: number) => void>();
  readonly activeStepIndex = input.required<number>();

  bookingType: BookingType[] = [
    {
      id: '1',
      descriptionI18n: 'bookings.booking-new.booking-type.ssn.description',
      titleI18n: 'bookings.booking-new.booking-type.ssn.title',
    },
    {
      id: '2',
      descriptionI18n: 'bookings.booking-new.booking-type.private.description',
      titleI18n: 'bookings.booking-new.booking-type.private.title',
    },
  ];
  constructor(private store: Store<SmartHospitalState>) {}

  onCardSelected(card: BookingType) {
    //console.log(card)
    const selectedBookingType = this.bookingType.find((bt) => bt.id === card.id);

    // stored session for refresh
    SessionStorageUtils.setItem(SessionStorageKey.bookingType, JSON.stringify(selectedBookingType));

    this.store.dispatch(setBookingType({ request: selectedBookingType! }));

    if (selectedBookingType?.id === '1') {
      // SSN
      this.setActiveStep()(this.activeStepIndex() + 1);
    } else {
      this.setActiveStep()(4);
    }
  }
}
