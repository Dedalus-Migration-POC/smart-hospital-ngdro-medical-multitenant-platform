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

interface IConfirmInfo {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-hero-confirm-appointment',
  standalone: true,
  imports: [CommonModule, TranslateModule, DesignAngularKitModule, ReactiveFormsModule],
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
        label: 'Prestazione',
        value: app.serviceDescriptionList
          ? app.serviceDescriptionList.map((service) => service.description).join(', ')
          : app.descriptionList
            ? app.descriptionList.join(', ')
            : '',
      },
      {
        label: 'Medico',
        value: app.physician ? app.physician.firstName + app.physician.lastName : '',
      },
      { label: 'Nome agenda', value: app.unitDescription },
      { label: 'Indirizzo', value: app.location.address || '' },
      {
        label: 'Data',
        value:
          format(new Date(app.dateTime), 'dd/MM/yyyy') +
          ' alle ore ' +
          format(new Date(app.dateTime), 'HH:mm'),
      },
      { label: 'Presidio', value: app.location.name || '' },
      { label: 'Prenoto per', value: app.delegateFiscalCode || '' },
      {
        label: 'Tariffa',
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
        label: 'Condizioni e Prescrizioni',
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
