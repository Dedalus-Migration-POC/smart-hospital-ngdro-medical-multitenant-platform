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
    loadComponent: () =>
      import('./appointment-details/appointment-details.component').then(
        (m) => m.AppointmentDetailsComponent,
      ),
  },
  {
    path: 'edit/:id',
    // letto dal BookingStepperComponent per selezionare gli step del flusso
    data: { bookingType: BookingType.EditAppointment },
    loadComponent: () =>
      import('./appointment-edit/appointment-edit.component').then(
        (m) => m.AppointmentEditComponent,
      ),
  },
];
