import { Routes } from '@angular/router';

// dashboards
import { AppDashboard1Component } from './dashboard1/dashboard1.component';
import { FormCongressComponent } from '../form-congress/form-congress/form-congress.component';
import { ParticipantsComponent } from '../participants/participants/participants.component';
import { ConferenceComponent } from '../conference/conference/conference.component';
import { NotificationComponent } from '../notification/notification/notification.component';
import { UsersComponent } from '../users/users/users.component';
import { EditUserComponent } from '../edit-user/edit-user/edit-user.component';

export const DashboardsRoutes: Routes = [
  {
    path: '',
    children: [
      { path: 'congressos', component: ConferenceComponent,  data: { title: 'Congressos' } },
      { path: 'registrados/:id', component: ParticipantsComponent,  data: { title: 'Registrados' }},
      { path: 'usuarios', component: UsersComponent,  data: { title: 'Usuários' } },
      { path: 'editar-usuario/:id',  component: EditUserComponent , data:{ title:"Editar Usuário"}},
      { path: 'notificacoes', component: NotificationComponent,  data: { title: 'Notificações' }},
    ],
  },
];
