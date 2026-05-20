import { Routes } from '@angular/router';
import { Auth } from './pages/auth/auth';
import { HomePage } from './pages/home/home';
import { IdpRedirectComponent } from './pages/auth/idp-redirect.component';
import { UserProfile } from './pages/user-profile/user-profile';
import { authenticatedGuard } from './guards/authenticated.guard';
import { SingleReport } from './pages/reports-and-documents/single-report/single-report';
import { MedicalReportsList } from './pages/reports-and-documents/medical-reports/medical-reports-list/medical-reports-list';

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

  { path: '', redirectTo: '', pathMatch: 'full' }, // default redirect
  { path: '**', redirectTo: '' }, // fallback
];
