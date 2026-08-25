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
import { LocalizedText } from 'src/app/shared/models/shared_model';
import { LanguageService } from 'src/app/initialize/state/services/language.service';

interface IConfirmInfo {
  label: LocalizedText;
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
  private langService = inject(LanguageService);

  lang = this.langService.lang;

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
        label: { it: 'Prestazione', en: 'Service' },
        value: app.serviceDescriptionList
          ? app.serviceDescriptionList.map((service) => service.description).join(', ')
          : app.descriptionList
            ? app.descriptionList.join(', ')
            : '',
      },
      {
        label: { it: 'Medico', en: 'Physician' },
        value: app.physician ? app.physician.firstName + app.physician.lastName : '',
      },
      { label: { it: 'Nome agenda', en: 'Agenda Name' }, value: app.unitDescription },
      { label: { it: 'Indirizzo', en: 'Address' }, value: app.location.address || '' },
      {
        label: { it: 'Data', en: 'Date' },
        value:
          format(new Date(app.dateTime), 'dd/MM/yyyy') +
          ' alle ore ' +
          format(new Date(app.dateTime), 'HH:mm'),
      },
      { label: { it: 'Presidio', en: 'Location' }, value: app.location.name || '' },
      { label: { it: 'Prenotato per', en: 'Booked for' }, value: app.delegateFiscalCode || '' },
      {
        label: { it: 'Tariffa', en: 'Fee' },
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
        label: { it: 'Condizioni e Prescrizioni', en: 'Conditions and Prescriptions' },
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
