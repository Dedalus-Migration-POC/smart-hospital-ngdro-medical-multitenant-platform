import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { SmartHospitalState } from 'src/app/store/reducers';
import { selectBookAppointment, selectBookingHeroSummary } from '../../../state/selectors';
import { addToCalendar, printMemo, sendEmailNotification } from '../../../state/actions';
import { format } from 'date-fns';
import { Router } from '@angular/router';

interface IConfirmInfo {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-hero-confirmed-appointment',
  standalone: true,
  imports: [CommonModule, TranslateModule, DesignAngularKitModule],
  templateUrl: './confirmed-appointment.component.html',
  styleUrls: ['./confirmed-appointment.component.scss'],
})
export class ConfirmedAppointmentComponent implements OnInit {
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly router = inject(Router);

  readonly bookingSummary = this.store.selectSignal(selectBookingHeroSummary);
  readonly bookedAppointment = this.store.selectSignal(selectBookAppointment);
  readonly appointment = computed(() => this.bookedAppointment()?.appointment ?? null);
  readonly appointmentId = computed(() => this.appointment()?.id ?? null);
  readonly confirmInfo = computed<IConfirmInfo[] | null>(() => {
    const app = this.appointment();
    if (!app) {
      return null;
    }
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
  });

  ngOnInit() {
    if (!this.appointment()) {
      this.router.navigate(['/bookings-hero/new']);
    }
  }

  onPrintMemo() {
    const summary = this.bookingSummary();
    if (summary?.bookingType === 'nre' || summary?.bookingType === 'free_prof') {
      this.store.dispatch(
        printMemo({
          payload: { sessionId: summary?.sessionId! },
          isBook: true,
        }),
      );
    } else {
      this.store.dispatch(
        printMemo({
          payload: {
            sessionId: summary?.sessionId!,
            appointmentId: this.appointmentId()!,
          },
        }),
      );
    }
  }

  onSendEmailNotification() {
    const summary = this.bookingSummary();
    if (summary?.bookingType === 'nre' || summary?.bookingType === 'free_prof') {
      this.store.dispatch(
        sendEmailNotification({
          payload: {
            sessionId: summary?.sessionId!,
            appointmentId: this.appointmentId()!,
            email: summary.userEmail,
          },
          isBook: true,
        }),
      );
    } else {
      this.store.dispatch(
        sendEmailNotification({
          payload: {
            sessionId: summary?.sessionId!,
            appointmentId: this.appointmentId()!,
          },
        }),
      );
    }
  }

  onAddToCalendar() {
    const summary = this.bookingSummary();
    this.store.dispatch(addToCalendar({ payload: { sessionId: summary?.sessionId! } }));
  }

  onPay() {
    this.router.navigate(['payments-pa']);
  }
}
