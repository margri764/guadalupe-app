import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { FormCongressComponent } from './pages/form-congress/form-congress/form-congress.component';
import { AppSideLoginComponent } from './pages/authentication/side-login/side-login.component';
import { AppErrorComponent } from './pages/authentication/error/error.component';
import { HomePhoneComponent } from './pages/home-phone/home-phone/home-phone.component';

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
    path: 'autenticacao',
    component: BlankComponent,
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

  {
    path: 'formulario', component: FormCongressComponent,  data: { title: 'Formulario' },
  },
  {
    path: 'home-app', component: HomePhoneComponent,  data: { title: 'Formulario' },
  },
 
  { path: "login", component: AppSideLoginComponent },
  { path: "error", component: AppErrorComponent },
  { path: "", redirectTo: "/login", pathMatch: 'full' },
  { path: '**', redirectTo: '/error' } // redirigir a una página de error 404 para rutas no encontradas


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
