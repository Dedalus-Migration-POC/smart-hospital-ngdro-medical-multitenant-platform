import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { SmartHospitalState } from 'src/app/store/reducers';
import {
  selectAvailability,
  selectBookingType,
  selectPrivateDoctor,
} from 'src/app/pages/bookings/bookings-ariannaCup/state/selectors';
import { SessionStorageKey, SessionStorageUtils } from 'src/app/utility/session-storage-utils';
import { resetStepAvailability } from 'src/app/pages/bookings/bookings-ariannaCup/state/actions';

@Component({
  selector: 'app-booking-summary',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './summary.component.html',
})
export class SummaryComponent {
  private readonly store = inject(Store<SmartHospitalState>);

  readonly setActiveStep = input<(stepIndex: number) => void>();

  private readonly bookingTypeState = this.store.selectSignal(selectBookingType);
  private readonly availabilityState = this.store.selectSignal(selectAvailability);
  private readonly privateDoctorState = this.store.selectSignal(selectPrivateDoctor);

  bookingType = computed(
    () => this.bookingTypeState() ?? this.readSessionItem(SessionStorageKey.bookingType),
  );

  availability = computed(
    () => this.availabilityState() ?? this.readSessionItem(SessionStorageKey.availability),
  );

  privateDoctor = computed(
    () => this.privateDoctorState() ?? this.readSessionItem(SessionStorageKey.privateDoctor),
  );
  isSSNBooking = computed(() => this.bookingType()?.id === '1');

  changeDate() {
    const setActiveStep = this.setActiveStep();
    if (!setActiveStep) {
      return;
    }

    this.store.dispatch(resetStepAvailability());
    if (this.isSSNBooking()) {
      SessionStorageUtils.removeItem(SessionStorageKey.availability);
      setActiveStep(2);
    } else {
      SessionStorageUtils.removeItem(SessionStorageKey.availability);
      setActiveStep(6);
    }
  }

  private readSessionItem(key: SessionStorageKey): any {
    const raw = SessionStorageUtils.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }
}

