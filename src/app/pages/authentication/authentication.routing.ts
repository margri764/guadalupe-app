import { Routes } from '@angular/router';

import { AppErrorComponent } from './error/error.component';
import { AppMaintenanceComponent } from './maintenance/maintenance.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResendPasswordComponent } from './resend-password/resend-password.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
     
      { path: 'error', component: AppErrorComponent },
      { path: 'maintenance', component: AppMaintenanceComponent },
      { path: 'login', component: LoginComponent,  data: { title: 'login' } },
      { path: 'registro', component: RegisterComponent,  data: { title: 'registro' } },
      { path: 'recuperar-senha', component: ResendPasswordComponent,  data: { title: 'recuperar senha' } },
    ],
  },
];
