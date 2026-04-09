import { Routes } from '@angular/router';
import { Auth } from './pages/auth/auth';
import { HomePage } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: HomePage },
  {
    path: 'login',
    component: Auth,
  },
  { path: '', redirectTo: '', pathMatch: 'full' }, // default redirect
  { path: '**', redirectTo: '' }, // fallback
];
