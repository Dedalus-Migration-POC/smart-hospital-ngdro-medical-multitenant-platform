import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { SmartHospitalState } from 'src/app/store/reducers';
import { selectAvailableAppointments, selectBookingHeroSummary } from '../../../state/selectors';
import { lockAppointment, lockDateToExpire, setSummaryBooking } from '../../../state/actions';
import { Availability } from '../../../state/model';
import { SummaryCardComponent } from '../components/summary-card/summary-card.component';

@Component({
  selector: 'app-hero-available-appointments',
  standalone: true,
  imports: [CommonModule, TranslateModule, DesignAngularKitModule, SummaryCardComponent],
  templateUrl: './available-appointments.component.html',
  styleUrls: ['./available-appointments.component.scss'],
})
export class AvailableAppointmentsComponent implements OnInit {
  private readonly store = inject(Store<SmartHospitalState>);

  readonly availableAppointments = this.store.selectSignal(selectAvailableAppointments);
  readonly bookingSummary = this.store.selectSignal(selectBookingHeroSummary);

  ngOnInit() {}

  onHourSelected(availableAppointment: Availability) {
    const summary = this.bookingSummary();
    if (
      summary?.bookingType === 'nre' ||
      summary?.bookingType === 'free_prof' ||
      summary?.bookingType === 'free_prof_delegate' ||
      summary?.bookingType === 'nre_delegate'
    ) {
      const payload = {
        appointmentId: availableAppointment.id,
        sessionId: summary?.sessionId!,
      };
      this.store.dispatch(lockAppointment({ payload }));
      this.store.dispatch(
        setSummaryBooking({
          payload: {
            ...summary,
            hour: availableAppointment.dateTime,
          },
        }),
      );
      return;
    }

    this.store.dispatch(lockDateToExpire({ sessionId: summary?.sessionId! }));
    this.store.dispatch(
      setSummaryBooking({
        payload: {
          ...summary,
          hour: availableAppointment.dateTime,
          newAppointment: availableAppointment,
        },
      }),
    );
  }
}
