import { Routes } from '@angular/router';
import { Auth } from './pages/auth/auth';
import { HomePage } from './pages/home/home';
import { IdpRedirectComponent } from './pages/auth/idp-redirect.component';
import { authenticatedGuard } from './guards/authenticated.guard';
import { SingleReport } from './pages/reports-and-documents/single-report/single-report';
import { MedicalReportsList } from './pages/reports-and-documents/medical-reports/medical-reports-list/medical-reports-list';
import { DepartmentsComponent } from './pages/departments-and-units/departments/departments.component';
import { DepartmentsAndUnitsRouting } from './pages/departments-and-units/departments-and-units.routing';
import { UnitsComponent } from './pages/departments-and-units/units/units.component';
import { UnitDetailsComponent } from './pages/departments-and-units/unit-details/unit-details.component';
import { UnitsRouting } from './pages/departments-and-units/units/units.routing';
import { PaymentsPaRouting } from './pages/payments/payments-pa/payments-pa.routing';
import { PaymentsPaList } from './pages/payments/payments-pa/payments-list/payments-list.component';
import { PaymentsPaDetails } from './pages/payments/payments-pa/payment-details/payment-details.component';
import { PaymentsJcashRouting } from './pages/payments/payments-jcash/payments-jcash.routing';
import { PaymentsJcashListComponent } from './pages/payments/payments-jcash/payments-jcash-list/payments-jcash-list.component';
import { PaymentJcashDetailsComponent } from './pages/payments/payments-jcash/payment-jcash-details/payment-jcash-details.component';
import { PaymentsA4hRouting } from './pages/payments/payments-a4h/payments-a4h.routing';
import { PaymentsA4hListComponent } from './pages/payments/payments-a4h/payments-a4h-list/payments-a4h-list.component';
import { TripletReport } from './pages/reports-and-documents/reports-by-triplet/reports-by-triplet';
import { BookingsListComponent } from './pages/bookings/bookings-ariannaCup/bookings-list/bookings-list.component';
import { BookingNewComponent } from './pages/bookings/bookings-ariannaCup/booking-new/bookings-new.component';
import { A4hConsents } from './pages/user-profile/a4h-consents/a4h-consents';

export const routes: Routes = [
  { path: '', component: HomePage },
  {
    path: 'login',
    component: Auth,
  },
  {
    path: 'user-profile',
    canActivate: [authenticatedGuard({ allowTemporary: true })],
    loadChildren: () =>
      import('./pages/user-profile/user-profile.routes').then((m) => m.userProfileRoutes),
  },
  {
    path: 'consents-a4h',
    canActivate: [authenticatedGuard()],
    component: A4hConsents,
  },
  {
    path: 'idp-redirect',
    component: IdpRedirectComponent,
  },
  { path: 'single-report', component: SingleReport },
  { path: 'reports-by-triplet', component: TripletReport },
  {
    path: 'medical-reports',
    component: MedicalReportsList,
    canActivate: [authenticatedGuard({ allowTemporary: true })],
  },
  {
    path: 'departments',
    component: DepartmentsAndUnitsRouting,
    children: [
      {
        path: '',
        component: DepartmentsComponent,
      },
      {
        path: 'units',
        component: UnitsRouting,
        children: [
          {
            path: '',
            component: UnitsComponent,
          },
          { path: 'details', component: UnitDetailsComponent },
        ],
      },
    ],
  },
  {
    path: 'payments-pa',
    component: PaymentsPaRouting,
    canActivate: [authenticatedGuard()],
    children: [
      {
        path: '',
        component: PaymentsPaList,
      },
      {
        path: 'details',
        component: PaymentsPaDetails,
      },
    ],
  },
  {
    path: 'bookings',
    canActivate: [authenticatedGuard()],
    children: [
      {
        path: '',
        component: BookingsListComponent,
      },
      {
        path: 'new',
        component: BookingNewComponent,
      },
    ],
  },
  {
    path: 'bookings-hero',
    canActivate: [authenticatedGuard()],
    loadChildren: () =>
      import('./pages/bookings/bookings-hero/bookings-hero.routes').then(
        (m) => m.bookingsHeroRoutes,
      ),
  },
  {
    path: 'booking-a4h',
    // canActivate: [authenticatedGuard()],
    loadChildren: () =>
      import('./pages/bookings/booking-a4h/booking-unified.routes').then(
        (m) => m.bookingUnifiedRoutes,
      ),
  },
  {
    path: 'payments-jcash',
    component: PaymentsJcashRouting,
    canActivate: [authenticatedGuard()],
    children: [
      {
        path: '',
        component: PaymentsJcashListComponent,
      },
      {
        path: 'details',
        component: PaymentJcashDetailsComponent,
      },
    ],
  },
  {
    path: 'payments-a4h',
    component: PaymentsA4hRouting,
    canActivate: [authenticatedGuard()],
    children: [
      {
        path: '',
        component: PaymentsA4hListComponent,
      },
    ],
  },

  { path: '', redirectTo: '', pathMatch: 'full' }, // default redirect
  { path: '**', redirectTo: '' }, // fallback
];
