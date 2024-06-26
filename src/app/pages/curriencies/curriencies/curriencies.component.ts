import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, delay, take } from 'rxjs';
import { DeleteModalComponent } from 'src/app/pages/modals/delete-modal/delete-modal/delete-modal.component';
import { CurrenciesService } from 'src/app/services/currencies.service';
import { ErrorService } from 'src/app/services/error.service';
import { getDataSS } from 'src/app/shared/storage';
import Swal from 'sweetalert2';
import { EditCurrencyModalComponent } from '../../modals/edit-currency-modal/edit-currency-modal/edit-currency-modal.component';
import { NewCurrencyModalComponent } from '../../modals/new-currency-modal/new-currency-modal/new-currency-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-curriencies',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './curriencies.component.html',
  styleUrl: './curriencies.component.scss'
})
export class CurrienciesComponent {

  displayedColumns: string[] = ['acronym', 'name','description','action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  currencies : any[]=[];
  isLoading : boolean = false;
  private unsubscribe$: Subscription;
  phone : boolean = false;
  show : boolean = false;  
  loggedUser : any;

  constructor(
              private errorService : ErrorService,
              private currenciesServices : CurrenciesService,
              private toastr: ToastrService,
              private router : Router,
              private dialog : MatDialog
              ) 

  {
    const user = getDataSS('user');
    if(user){
      this.loggedUser = user;
    }

    if (this.loggedUser.role === 'webmaster') {
      const position = this.displayedColumns.length - 1;
      this.displayedColumns.splice(position, 0, 'propulsao');
    }

    (screen.width <= 800) ? this.phone = true : this.phone = false;
    this.dataSource = new MatTableDataSource();

   }

  ngOnInit(): void {
    this.getInitialCurrencies();
    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));

  }

openModalCurrency(){
  this.showAttentionSwal();
}

showAttentionSwal(){
  Swal.fire({
    title: 'Moedas não podem ser editadas quando estão atribuídas a uma propulsão',
    // text: 'Se você excluí-la, perderá todo o progresso na configuração da propulsão',
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim, continuar!"
    }).then((result) => {
      if (result.isConfirmed) {

        const dialogRef = this.dialog.open(NewCurrencyModalComponent,{
          maxWidth: (this.phone) ? "97vw": '800px',
          maxHeight: (this.phone) ? "90vh": '90vh',
        });
      
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
      
            if(result === 'new-currency'){
                  this.getInitialCurrencies()   
               }
          } 
        });
       
      }else{
        this.isLoading = false;

      }
  });

}

editCurrency( currency:any ){
  let noAllowedEdition : boolean = false;
  if(currency.propulsao_name && currency.propulsao_name[0] !== null && currency.propulsao_name.length > 0 ){
    noAllowedEdition = true;
  }
  const dialogRef = this.dialog.open(EditCurrencyModalComponent,{
    maxWidth: (this.phone) ? "97vw": '800px',
    maxHeight: (this.phone) ? "90vh": '90vh',
    data: {currency, noAllowedEdition}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      if(result === 'edit-currency'){
        this.getInitialCurrencies() 
      }
    } 
  });
}

getInitialCurrencies(){

  this.currenciesServices.getAllCurrencies().subscribe(
      ( {success, currencies} )=>{
        if(success){
          this.currencies = currencies;
          if(currencies && currencies.length > 0){
            this.dataSource.data = currencies;
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'acronym': return item.acronym;
                case 'name': return item.name;
                case 'propulsao': return item.propulsao_name;
                case 'description': return item.description;
                default: return '';
              }
            };
          }
          setTimeout(()=>{ this.isLoading = false }, 700)
        }
      })
}

onRemove( currency:any ){

  this.openDeleteModal('delCurrency');

  this.unsubscribe$ =this.currenciesServices.authDelCurrency$.pipe(take(1)).subscribe(
    (auth)=>{
      if(auth){

        if(currency.propulsao_name && currency.propulsao_name[0] !== null && currency.propulsao_name.length > 0){
          this.showWarningSwal(currency.propulsao_name)
        }else{

          this.currenciesServices.deleteCurrencyById( currency.idcurrency ).subscribe(
          ( {success} )=>{

            setTimeout(()=>{ this.isLoading = false },700);
     
            if(success){
              this.getInitialCurrencies();
              this.successToast("Moeda eliminada com sucesso.");
            }
          })
        }
        // this.isLoading = true;
        // this.currenciesServices.deleteCurrencyById( currency.idcurrency ).subscribe(
        //   ( {success} )=>{
        //     setTimeout(()=>{ this.isLoading = false },700) 
        //     if(success){
        //       this.successToast("Moeda eliminada com sucesso.");
        //       this.getInitialCurrencies();
        //     }
        //   })
      }else{
        this.unsubscribe$.unsubscribe();
      }
    })
}

showPropulsaoSwal( ) {
  Swal.fire({
    title: "Operação proibida!",
    text: `Esta moeda está atribuída a uma propulsão`,
    icon: "warning",
    // showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "continuar"
  }).then((results) => {
    if (results.isConfirmed) {
    }
  });
  
}

showWarningSwal( propulsaosName:any) {
  Swal.fire({
    title: "Si precisar excluir, faça-o através das propulsões associadas.!",
    text: `Esta moeda está atribuída às seguintes propulsões: "${propulsaosName.join('", "')}", ` ,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Login como administrador"
  }).then((result)=>{
    if(result.isConfirmed){
      this.router.navigateByUrl('/dashboard/administradores')
    }
  })
}

successToast( msg:string){
  this.toastr.success(msg, 'Sucesso!!', {
    positionClass: 'toast-bottom-right', 
    timeOut: 3500, 
    messageClass: 'message-toast',
    titleClass: 'title-toast'
  });
}

warningToast( msg:string){
  this.toastr.warning(msg, 'Verificar!!', {
    positionClass: 'toast-bottom-right', 
    timeOut: 3500, 
    messageClass: 'message-toast',
    titleClass: 'title-toast'
  });
}

openDeleteModal( action:string ){
  this.dialog.open(DeleteModalComponent,{
    maxWidth: (this.phone) ? "98vw": '',
    panelClass: "custom-modal-picture",    
    data: { component: "currency", action }
    });
}

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  const savedPageSize = localStorage.getItem('currencyPageSize');
  if (savedPageSize) {
    this.paginator.pageSize = +savedPageSize;
  }
  this.paginator.page.subscribe((event) => {
    localStorage.setItem('currencyPageSize', event.pageSize.toString());
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

