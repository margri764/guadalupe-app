import { Routes } from '@angular/router';

// dashboards
import { AppDashboard1Component } from './dashboard1/dashboard1.component';
import { UsersComponent } from '../users/users/users.component';
import { EditUserComponent } from '../edit-user/edit-user/edit-user.component';
import { DuplasComponent } from '../duplas/duplas/duplas.component';
import { GroupsComponent } from '../groups/groups/groups.component';
import { FilesComponent } from '../files/files/files.component';
import { AlarmsComponent } from '../alarms/alarms/alarms.component';
import { NextAlarmsComponent } from '../next-alarms/next-alarms/next-alarms.component';
import { TratamentoComponent } from '../tratamento/tratamento/tratamento.component';
import { ProfessionComponent } from '../profession/profession/profession.component';
import { EmailSegmentationComponent } from '../email-segmentation/email-segmentation/email-segmentation.component';

export const DashboardsRoutes: Routes = [
  {
    path: '',
    children: [
      { path: 'usuarios', component: UsersComponent,  data: { title: 'Usuários' } },
      { path: 'duplas', component: DuplasComponent,  data: { title: 'Duplas' } },
      { path: 'grupos', component: GroupsComponent,  data: { title: 'Grupos' } },
      { path: 'arquivos', component: FilesComponent,  data: { title: 'Arquivos' } },
      { path: 'alarmes', component: AlarmsComponent,  data: { title: 'Alarmes' } },
      { path: 'proximos-alarmes', component: NextAlarmsComponent,  data: { title: 'Próximos alarmes' } },
      { path: 'tratamento', component: TratamentoComponent,  data: { title: 'Tratamento' } },
      { path: 'profissao', component: ProfessionComponent,  data: { title: 'Profissão' } },
      { path: 'segmentacao-de-emails', component: EmailSegmentationComponent,  data: { title: 'Segmentação de emails' } },
      { path: 'editar-usuario/:id',  component: EditUserComponent , data:{ title:"Editar Usuário"}},
    ],
  },
];
