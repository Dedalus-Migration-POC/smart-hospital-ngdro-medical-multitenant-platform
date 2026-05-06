import { Routes } from '@angular/router';
import { Auth } from './pages/auth/auth';
import { HomePage } from './pages/home/home';
import { IdpRedirectComponent } from './pages/auth/idp-redirect.component';
import { UserProfile } from './pages/user-profile/user-profile';
import { authenticatedGuard } from './guards/authenticated.guard';

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
  { path: '', redirectTo: '', pathMatch: 'full' }, // default redirect
  { path: '**', redirectTo: '' }, // fallback
];
