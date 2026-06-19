import { Routes } from '@angular/router';
import { Auth } from './pages/auth/auth';
import { HomePage } from './pages/home/home';
import { IdpRedirectComponent } from './pages/auth/idp-redirect.component';
import { UserProfile } from './pages/user-profile/user-profile';
import { authenticatedGuard } from './guards/authenticated.guard';
import { SingleReport } from './pages/reports-and-documents/single-report/single-report';
import { MedicalReportsList } from './pages/reports-and-documents/medical-reports/medical-reports-list/medical-reports-list';
import { DepartmentsComponent } from './pages/departments-and-units/departments/departments.component';
import { DepartmentsAndUnitsRouting } from './pages/departments-and-units/departments-and-units.routing';
import { UnitsComponent } from './pages/departments-and-units/units/units.component';
import { UnitDetailsComponent } from './pages/departments-and-units/unit-details/unit-details.component';
import { UnitsRouting } from './pages/departments-and-units/units/units.routing';

export const routes: Routes = [
  { path: '', component: HomePage },
  {
    path: 'login',
    component: Auth,
  },
  {
    path: 'user-profile',
    component: UserProfile,
    canActivate: [authenticatedGuard({ allowTemporary: true })],
  },
  {
    path: 'idp-redirect',
    component: IdpRedirectComponent,
  },
  { path: 'single-report', component: SingleReport },
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

  { path: '', redirectTo: '', pathMatch: 'full' }, // default redirect
  { path: '**', redirectTo: '' }, // fallback
];
