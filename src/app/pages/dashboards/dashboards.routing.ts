import { Routes } from '@angular/router';

// dashboards
import { AppDashboard1Component } from './dashboard1/dashboard1.component';
import { UsersComponent } from '../users/users/users.component';
import { EditUserComponent } from '../edit-user/edit-user/edit-user.component';

export const DashboardsRoutes: Routes = [
  {
    path: '',
    children: [
      { path: 'usuarios', component: UsersComponent,  data: { title: 'Usuários' } },
      { path: 'editar-usuario/:id',  component: EditUserComponent , data:{ title:"Editar Usuário"}},
    ],
  },
];
