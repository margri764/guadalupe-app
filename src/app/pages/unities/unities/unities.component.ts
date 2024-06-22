import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, delay } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ErrorService } from 'src/app/services/error.service';
import { AssociationService } from 'src/app/services/association.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { getDataSS } from 'src/app/storage';


@Component({
  selector: 'app-unities',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './unities.component.html',
  styleUrl: './unities.component.scss'
})
export class UnitiesComponent {

  displayedColumns: string[] = [
    'nome_da_unidade', 'oi_oii_ou_oiii', 'duplas', 'tratamento', 'encarregado_do_caixa',
    'tel_da_uni', 'tel_pessoal', 'endereco_para_correspondencia', 'cidade', 'cep',
    'e_mail_do_encarregado', 'e_mail_da_unidade', 'ativa', 'associacao', 'cnpj',
    'alta', 'banco', 'agencia', 'digito', 'cc_conta_corrente', 'digito_2',
    'endereco_completo_do_cnpj', 'obs', 'email_encarregado_dos_veiculos'
  ];
  
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  units : any[]=[];
  isLoading : boolean = false;
  phone : boolean = false;
  msg : string = '';

  private unsubscribe$: Subscription;
  loggedUser : any;
  unitTimeStamp : any;

  constructor(
              private errorService : ErrorService,
              private associationService : AssociationService,
              private toastr: ToastrService,
              private dialog : MatDialog
              ) 

  {
    const user = getDataSS('user');
    if(user){
      this.loggedUser = user;
    }
    (screen.width <= 800) ? this.phone = true : this.phone = false;
    this.dataSource = new MatTableDataSource();

   }


  ngOnInit(): void {

    this.getInitialUnits();
    this.getUnitsTimestamp();
    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));
  }


getInitialUnits(){
  this.isLoading = true;
  this.associationService.getAllUnits().subscribe(
      ( {success, units} )=>{
        if(success){
          this.units = units;
          this.units = this.units.filter(item => item.nome_da_unidade === '' || item.nome_da_unidade!== null )
          if(units && units.length > 0){
            this.dataSource.data = units;
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'nome_da_unidade': return item.nome_da_unidade;
                case 'oi_oii_ou_oiii': return item.oi_oii_ou_oiii;
                case 'duplas': return item.duplas;
                case 'tratamento': return item.tratamento;
                case 'encarregado_do_caixa': return item.encarregado_do_caixa;
                case 'tel_da_uni': return item.tel_da_uni;
                case 'tel_pessoal': return item.tel_pessoal;
                case 'endereco_para_correspondencia': return item.endereco_para_correspondencia;
                case 'cidade': return item.cidade;
                case 'cep': return item.cep;
                case 'e_mail_do_encarregado': return item.e_mail_do_encarregado;
                case 'e_mail_da_unidade': return item.e_mail_da_unidade;
                case 'ativa': return item.ativa;
                case 'associacao': return item.associacao;
                case 'cnpj': return item.cnpj;
                case 'alta': return item.alta;
                case 'banco': return item.banco;
                case 'agencia': return item.agencia;
                case 'digito': return item.digito;
                case 'cc_conta_corrente': return item.cc_conta_corrente;
                case 'digito_2': return item.digito_2;
                case 'endereco_completo_do_cnpj': return item.endereco_completo_do_cnpj;
                case 'obs': return item.obs;
                case 'email_encarregado_dos_veiculos': return item.email_encarregado_dos_veiculos;
                default: return '';
              }
            };
            
          }
       
          setTimeout(()=>{ this.isLoading = false }, 700)
        }
      })
}

sincroUnitsGoogleSheet(){

  this.isLoading = true;

  this.associationService.sincroUnitsGoogleSheet().subscribe(
    ( {success} )=>{
      if(success){
        this.successToast('Sincronização de unidades bem-sucedida');
        this.getInitialUnits();
        setTimeout(()=>{ this.isLoading = false },700)
      }
    })



}

getUnitsTimestamp(){

  this.associationService.getUnitsTimestamp().subscribe(
    ( {success, units} )=>{
      if(success){
        this.unitTimeStamp = units;
      }
    }
    )
}

successToast( msg:string){
  this.toastr.success(msg, 'Sucesso!!', {
    positionClass: 'toast-bottom-right', 
    timeOut: 3500, 
    messageClass: 'message-toast',
    titleClass: 'title-toast'
  });
}

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  const savedPageSize = localStorage.getItem('fontePageSize');
  if (savedPageSize) {
    this.paginator.pageSize = +savedPageSize;
  }
  this.paginator.page.subscribe((event) => {
    localStorage.setItem('fontePageSize', event.pageSize.toString());
  });
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}


ngOnDestroy(): void {
  if(this.unsubscribe$){
    this.unsubscribe$.unsubscribe();
  }
}


}

