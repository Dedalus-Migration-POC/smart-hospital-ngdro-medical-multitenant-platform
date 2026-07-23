import { Routes } from '@angular/router';

export const bookingsHeroRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./bookings-hero-list/bookings-hero-list.component').then(
        (m) => m.BookingsHeroListComponent,
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./booking-hero-new/bookings-hero-new.component').then(
        (m) => m.BookingHeroNewComponent,
      ),
  },
  {
    path: 'details',
    loadComponent: () =>
      import('./bookings-hero-details/bookings-hero-details.component').then(
        (m) => m.BookingHeroDetailsComponent,
      ),
  },
  {
    path: 'reschedule',
    loadComponent: () =>
      import('./bookings-hero-reschedule/bookings-hero-reschedule.component').then(
        (m) => m.BookingHeroRescheduleComponent,
      ),
  },
];
