import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login')
            .then(m => m.Login)
    },
    { path: '', redirectTo: '', pathMatch: 'full' }, // default redirect
    { path: '**', redirectTo: '' }, // fallback

];
