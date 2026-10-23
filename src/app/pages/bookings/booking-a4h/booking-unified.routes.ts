import { Routes } from '@angular/router';
import { authenticatedGuard } from 'src/app/guards/authenticated.guard';
import { BookingStepperComponent } from './booking-stepper/booking-stepper.component';
import { BookingTypeSelectorComponent } from './booking-type-selector/booking-type-selector.component';
import { BookingUnifiedComponent } from './booking-unified.component';
import { ConfirmedBookingComponent } from './confirmed-booking/confirmed-booking.component';

export const bookingUnifiedRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: BookingTypeSelectorComponent,
  },
  {
    // prima di ':bookingType', altrimenti 'appointments' verrebbe letto come tipo di prenotazione
    path: 'appointments',
    // ID della configurazione per questa route autonoma.
    data: { pageConfigId: '/booking-a4h/appointments' },
    canActivate: [authenticatedGuard()],
    loadChildren: () =>
      import('./appointments/appointments.routes').then((m) => m.appointmentsRoutes),
  },
  {
    path: ':bookingType',
    component: BookingUnifiedComponent,
    children: [
      {
        path: '',
        component: BookingStepperComponent,
      },
      {
        path: 'confirmed-booking',
        component: ConfirmedBookingComponent,
      },
    ],
  },
];
