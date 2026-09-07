import { Routes } from '@angular/router';
import { Auth } from '../../auth/auth';
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
    path: ':bookingType',
    component: BookingUnifiedComponent,
    children: [
      {
        path: '',
        component: BookingStepperComponent,
        children: [{ path: 'login', pathMatch: 'full', component: Auth }],
      },
      {
        path: 'confirmed-booking',
        component: ConfirmedBookingComponent,
      },
    ],
  },
];