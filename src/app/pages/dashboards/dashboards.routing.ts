import { Routes } from '@angular/router';

// dashboards
import { AppDashboard1Component } from './dashboard1/dashboard1.component';
import { UsersComponent } from '../users/users/users.component';
import { EditUserComponent } from '../edit-user/edit-user/edit-user.component';
import { DuplasComponent } from '../duplas/duplas/duplas.component';
import { GroupsComponent } from '../groups/groups/groups.component';

export const DashboardsRoutes: Routes = [
  {
    path: '',
    children: [
      { path: 'usuarios', component: UsersComponent,  data: { title: 'Usuários' } },
      { path: 'duplas', component: DuplasComponent,  data: { title: 'Duplas' } },
      { path: 'grupos', component: GroupsComponent,  data: { title: 'Grupos' } },
      { path: 'editar-usuario/:id',  component: EditUserComponent , data:{ title:"Editar Usuário"}},
    ],
  },
];
