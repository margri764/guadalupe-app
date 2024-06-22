import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, delay, take } from 'rxjs';
import Swal from 'sweetalert2';
import { DeleteModalComponent } from '../../modals/delete-modal/delete-modal/delete-modal.component';
import { getDataSS } from 'src/app/shared/storage';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BankCreditcardService } from 'src/app/services/bank-creditcard.service';
import { ErrorService } from 'src/app/services/error.service';
import { MatDialog } from '@angular/material/dialog';
import { EditBankagreementModalComponent } from '../../modals/edit-bankagreement-modal/edit-bankagreement-modal/edit-bankagreement-modal.component';
import { NewBankagreementModalComponent } from '../../modals/new-bankagreement-modal/new-bankagreement-modal/new-bankagreement-modal.component';
import { BankLogoPipe } from "../../../pipe/bank-logo.pipe";


@Component({
    selector: 'app-bank-agreement',
    standalone: true,
    templateUrl: './bank-agreement.component.html',
    styleUrl: './bank-agreement.component.scss',
    imports: [CommonModule, MaterialModule, ReactiveFormsModule, BankLogoPipe]
})
export class BankAgreementComponent {

  
  displayedColumns: string[] = ['img','name', 'description','action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  bankAgreements : any[]=[];
  isLoading : boolean = false;
  showSuccess : boolean = false;
  showSuccessCreateGroup : boolean = false;
  msg : string = '';

  private unsubscribe$: Subscription;
  phone : boolean = false;
  show : boolean = false;
  loggedUser : any;


  constructor(
              private errorService : ErrorService,
              private toastr: ToastrService,
              private bankcreditcardService : BankCreditcardService,
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

    this.getInitialBankAgreements();
    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));


  }

  openModalBankAgreement(){
    const dialogRef = this.dialog.open(NewBankagreementModalComponent,{
      maxWidth: (this.phone) ? "97vw": '800px',
      maxHeight: (this.phone) ? "90vh": '90vh',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
  
        if(result === 'new-bankagreement'){
              this.getInitialBankAgreements()   
           }
      } 
    });
}

editBankAgreement( bankagreement:any ){
  const dialogRef = this.dialog.open(EditBankagreementModalComponent,{
    maxWidth: (this.phone) ? "97vw": '800px',
    maxHeight: (this.phone) ? "90vh": '90vh',
    data: {bankagreement}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      if(result === 'edit-bankagreement'){
        this.getInitialBankAgreements() 
      }
    } 
  });
}

getInitialBankAgreements(){
  this.bankcreditcardService.getAllBankAgreements().subscribe(
      ( {success, bankAgreements} )=>{
        if(success){
          this.bankAgreements = bankAgreements;
          if(bankAgreements && bankAgreements.length > 0){
            this.dataSource.data = bankAgreements;
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'name': return item.name;
                case 'description': return item.description;
                case 'propulsao': return item.propulsao_name;
                default: return '';
              }
            };
          }
          setTimeout(()=>{ this.isLoading = false }, 700)
        }
      })
}

onRemove( bankagreement:any ){

  console.log(bankagreement);

  this.openDeleteModal('delBankAgreement');

  this.unsubscribe$ = this.bankcreditcardService.authDelBankAgreement$.pipe(take(1)).subscribe(
    (auth)=>{
      if(auth){
        
        if(bankagreement.propulsao_name && bankagreement.propulsao_name[0] !== null && bankagreement.propulsao_name.length > 0){
          this.showWarningSwal(bankagreement.propulsao_name)
        }else{

          this.bankcreditcardService.deleteBankAgreementById( bankagreement.idbankagreement ).subscribe(
          ( {success} )=>{

            setTimeout(()=>{ this.isLoading = false },700);
     
            if(success){
              this.getInitialBankAgreements();
              this.successToast("Convênio  eliminado com sucesso.");
            }
          })
        }
        
      }else{
        this.unsubscribe$.unsubscribe();
      }
    })
}


showWarningSwal( propulsaosName:any) {
  Swal.fire({
    title: "Si precisar excluir, faça-o através das propulsões associadas.!",
    text: `Este resultado está atribuído às seguintes propulsões: "${propulsaosName.join('", "')}", ` ,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Login como administrador"
  }).then((result)=>{
  })
}

showPropulsaoSwal( ) {
  Swal.fire({
    title: "Editar através das propulsões!",
    text: `Este resultado está atribuído a uma propulsão`,
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
    data: { component: "bank-agreement", action }
    });
}

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  const savedPageSize = localStorage.getItem('convenioPageSize');
  if (savedPageSize) {
    this.paginator.pageSize = +savedPageSize;
  }
  this.paginator.page.subscribe((event) => {
    localStorage.setItem('convenioPageSize', event.pageSize.toString());
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

