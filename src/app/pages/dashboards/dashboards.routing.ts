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
import { PhonesegmentationComponent } from '../modals/phonesegmentation/phonesegmentation/phonesegmentation.component';
import { AddressSegmentationComponent } from '../address-segmentation/address-segmentation/address-segmentation.component';
import { RelationshipSegmentationComponent } from '../relationship-segmentation/relationship-segmentation/relationship-segmentation.component';
import { CongregatioComponent } from '../congregatio/congregatio/congregatio.component';
import { CitiesComponent } from '../cities/cities/cities.component';
import { DiocesesComponent } from '../dioceses/dioceses/dioceses.component';
import { FontesComponent } from '../fontes/fontes/fontes.component';
import { ResultsComponent } from '../results/results/results.component';
import { BankComponent } from '../bank/bank/bank.component';
import { BankAgreementComponent } from '../bank-agreement/bank-agreement/bank-agreement.component';
import { CreditCardComponent } from '../credit-card/credit-card/credit-card.component';
import { AssociationComponent } from '../association/association/association.component';
import { UnitiesComponent } from '../unities/unities/unities.component';
import { CadComponent } from '../cad/cad/cad.component';
import { PropulsoesComponent } from '../propulsoes/propulsoes/propulsoes.component';
import { CurrienciesComponent } from '../curriencies/curriencies/curriencies.component';
import { AssignDioceseDrawerComponent } from '../drawers/assign-diocese-drawer/assign-diocese-drawer/assign-diocese-drawer.component';

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
      { path: 'segmentacao-de-telefone', component: PhonesegmentationComponent,  data: { title: 'Segmentação de telefone' } },
      { path: 'segmentacao-de-enderecos', component: AddressSegmentationComponent,  data: { title: 'Segmentação de Endereços' } },
      { path: 'segmentacao-de-relacao', component: RelationshipSegmentationComponent,  data: { title: 'Segmentação de Relaçãos' } },
      { path: 'congregatio', component: CongregatioComponent,  data: { title: 'Congregatio' } },
      { path: 'cidades', component: CitiesComponent,  data: { title: 'Cidades' } },
      { path: 'dioceses', component: DiocesesComponent,  data: { title: 'Dioceses' } },
      { path: 'fontes', component: FontesComponent,  data: { title: 'Fontes' } },
      { path: 'resultados', component: ResultsComponent,  data: { title: 'Resultados' } },
      { path: 'contas-bancarias', component: BankComponent,  data: { title: 'Contas bancárias' } },
      { path: 'convenios-bancarios', component: BankAgreementComponent,  data: { title: 'Convênios' } },
      { path: 'cartoes-de-credito', component: CreditCardComponent,  data: { title: 'Cartões de crédito' } },
      { path: 'associacao', component: AssociationComponent,  data: { title: 'Associação' } },
      { path: 'unidades', component: UnitiesComponent,  data: { title: 'Unidades' } },
      { path: 'codigos-cad', component: CadComponent,  data: { title: 'Cadastro' } },
      { path: 'propulsoes', component: PropulsoesComponent,  data: { title: 'Propulsões' } },
      { path: 'moedas', component: CurrienciesComponent,  data: { title: 'Moedas' } },
      // { path: 'drawer', component: AssignDioceseDrawerComponent,  data: { title: 'Drawer' } },
      { path: 'editar-usuario/:id',  component: EditUserComponent , data:{ title:"Editar Usuário"}},
    ],
  },
];


