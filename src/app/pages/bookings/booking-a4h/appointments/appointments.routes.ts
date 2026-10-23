import { Routes } from '@angular/router';
import { BookingType } from '../models/booking-type';

export const appointmentsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./appointments-list/appointments-list.component').then(
        (m) => m.AppointmentsListComponent,
      ),
  },
  {
    path: 'details/:id',
    // ID della configurazione, indipendente dal parametro :id.
    data: { pageConfigId: '/booking-a4h/appointments/details' },
    loadComponent: () =>
      import('./appointment-details/appointment-details.component').then(
        (m) => m.AppointmentDetailsComponent,
      ),
  },
  {
    path: 'edit/:id',
    // letto dal BookingStepperComponent per selezionare gli step del flusso
    // ID della configurazione, indipendente dal parametro :id.
    data: {
      bookingType: BookingType.EditAppointment,
      pageConfigId: '/booking-a4h/appointments/edit',
    },
    loadComponent: () =>
      import('./appointment-edit/appointment-edit.component').then(
        (m) => m.AppointmentEditComponent,
      ),
  },
];
