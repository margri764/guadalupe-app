import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AppErrorComponent } from './pages/authentication/error/error.component';
import { LoginComponent } from './pages/authentication/login/login.component';
import { RegisterComponent } from './pages/authentication/register/register.component';
import { AssignDioceseDrawerComponent } from './pages/drawers/assign-diocese-drawer/assign-diocese-drawer/assign-diocese-drawer.component';

const routes: Routes = [
  {
    path: 'painel', component: FullComponent, data: { title: 'Painel' },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/dashboards/dashboards.module').then(
            (m) => m.DashboardsModule
          ),
      },
     
    ],
  },

  {
    path: 'autenticacao', component: BlankComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/authentication/authentication.module').then(
            (m) => m.AuthenticationModule
          ),
      },
    ],
  },

 
  { path: 'login', component: LoginComponent,  data: { title: 'login' } },

  // { path: 'registro', component: RegisterComponent,  data: { title: 'registro' } },
 
  { path: "error", component: AppErrorComponent },
  { path: "", redirectTo: "/login", pathMatch: 'full' },
  { path: '**', redirectTo: '/error' },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
