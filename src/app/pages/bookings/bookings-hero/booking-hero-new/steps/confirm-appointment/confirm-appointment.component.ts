import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { SmartHospitalState } from 'src/app/store/reducers';
import { selectBookingHeroSummary, selectLockAppointment } from '../../../state/selectors';
import {
  bookAppointment,
  moveAppointment,
  setActiveStep,
  setSummaryBooking,
  unlockSession,
} from '../../../state/actions';
import { format } from 'date-fns';
import { Availability, BookingStepId } from '../../../state/model';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountdownTimerComponent } from 'src/app/components/countdown-timer/countdown-timer.component';

@Component({
  selector: 'app-hero-confirm-appointment',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    DesignAngularKitModule,
    ReactiveFormsModule,
    CountdownTimerComponent,
  ],
  templateUrl: './confirm-appointment.component.html',
  styleUrls: ['./confirm-appointment.component.scss'],
})
export class ConfirmAppointmentComponent implements OnInit {
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly router = inject(Router);

  disclaimerControl = new FormControl(false, Validators.requiredTrue);
  readonly lockAppointment = this.store.selectSignal(selectLockAppointment);
  readonly bookingSummary = this.store.selectSignal(selectBookingHeroSummary);

  readonly confirmInfo = computed(() => {
    const appointment = this.lockAppointment();
    const summary = this.bookingSummary();
    if (appointment?.appointment) {
      return this.buildConfirmInfo(appointment.appointment);
    }

    if (summary?.newAppointment) {
      return this.buildConfirmInfo(summary.newAppointment);
    }

    return null;
  });

  buildConfirmInfo(app: Availability) {
    return [
      {
        label: 'bookings-hero.booking-new.confirm-appointment.fields.service',
        value: app.serviceDescriptionList
          ? app.serviceDescriptionList.map((service) => service.description).join(', ')
          : app.descriptionList
            ? app.descriptionList.join(', ')
            : '',
      },
      {
        label: 'bookings-hero.booking-new.confirm-appointment.fields.physician',
        value: app.physician ? app.physician.firstName + app.physician.lastName : '',
      },
      {
        label: 'bookings-hero.booking-new.confirm-appointment.fields.agenda',
        value: app.unitDescription,
      },
      {
        label: 'bookings-hero.booking-new.confirm-appointment.fields.address',
        value: app.location.address || '',
      },
      {
        label: 'bookings-hero.booking-new.confirm-appointment.fields.date',
        value:
          format(new Date(app.dateTime), 'dd/MM/yyyy') +
          ' alle ore ' +
          format(new Date(app.dateTime), 'HH:mm'),
      },
      {
        label: 'bookings-hero.booking-new.confirm-appointment.fields.facility',
        value: app.location.name || '',
      },
      {
        label: 'bookings-hero.booking-new.confirm-appointment.fields.booked-for',
        value: app.delegateFiscalCode || '',
      },
      {
        label: 'bookings-hero.booking-new.confirm-appointment.fields.fee',
        value:
          '€' +
          app.billingInfo.reduce((sum, item) => {
            if (item.finalPrice) {
              return sum + item.finalPrice;
            }
            return sum + 0;
          }, 0),
      },
      {
        label: 'bookings-hero.booking-new.confirm-appointment.fields.conditions-prescriptions',
        value: app.additionalProperties?.agenda_patient_text || '',
      },
    ];
  }

  readonly expireOn = computed(() => this.bookingSummary()?.expireOn);

  onExpiration() {
    this.onCancel();
  }

  ngOnInit() {}

  onConfirm() {
    const summary = this.bookingSummary();
    if (summary?.appointmentToMove && summary.newAppointment) {
      this.store.dispatch(
        moveAppointment({
          payload: {
            sessionId: summary?.sessionId!,
            newAppointmentId: summary.newAppointment?.id,
          },
        }),
      );
    } else {
      this.store.dispatch(bookAppointment({ sessionId: summary?.sessionId! }));
    }
  }

  onCancel() {
    const summary = this.bookingSummary();
    this.store.dispatch(unlockSession({ sessionId: summary?.sessionId! }));
    if (summary?.bookingType === 'free_prof_to_move' || summary?.bookingType === 'nre_to_move') {
      this.router.navigate(['bookings-hero']);
    }

    this.store.dispatch(
      setSummaryBooking({
        payload: null,
      }),
    );

    this.store.dispatch(setActiveStep({ step: BookingStepId.SelectBookingType }));
  }
}
