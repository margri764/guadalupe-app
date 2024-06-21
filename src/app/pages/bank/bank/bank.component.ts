import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, Subscription, delay, take } from 'rxjs';
import { DeleteModalComponent } from '../../modals/delete-modal/delete-modal/delete-modal.component';
import { ToastrService } from 'ngx-toastr';
import { getDataSS } from 'src/app/shared/storage';
import Swal from 'sweetalert2';
import { AddPropulsaoModalComponent } from '../../modals/add-propulsao-modal/add-propulsao-modal/add-propulsao-modal.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { BankCreditcardService } from 'src/app/services/bank-creditcard.service';
import { ErrorService } from 'src/app/services/error.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EditBankModalComponent } from '../../modals/edit-bank-modal/edit-bank-modal/edit-bank-modal.component';
import { NewBankModalComponent } from '../../modals/new-bank-modal/new-bank-modal/new-bank-modal.component';
import { BankLogoPipe } from "../../../pipe/bank-logo.pipe";


@Component({
    selector: 'app-bank',
    standalone: true,
    templateUrl: './bank.component.html',
    styleUrl: './bank.component.scss',
    imports: [CommonModule, MaterialModule, ReactiveFormsModule, BankLogoPipe]
})
export class BankComponent {

  displayedColumns: string[] = ['img','number','name', 'description','action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isLoading : boolean = false;
  bankAccounts : any []=[];
  unsubscribe$ : Subscription;
  selectedBank : any;
  loggedUser : any;
  phone : boolean = false;

  
    constructor(
                  private bankCreditcardService : BankCreditcardService,
                  private errorService : ErrorService,
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
  
      this.getInitialBanks();
      this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));
  
    }
  
   getInitialBanks(){
  
    this.isLoading = true;
  
    this.bankCreditcardService.getAllBanksAccounts().subscribe(
      ( {success, bankAccounts} )=>{
        if(success){
          this.bankAccounts = bankAccounts;
          if(bankAccounts && bankAccounts.length > 0){
            this.dataSource.data = bankAccounts;
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'number': return item.number;
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
  
     
  openModalNewBankAccount(){
    const dialogRef = this.dialog.open(NewBankModalComponent,{
      maxWidth: (this.phone) ? "97vw": '800px',
      maxHeight: (this.phone) ? "90vh": '90vh',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
  
        if(result === 'new-account'){
              this.getInitialBanks()   
           }
      } 
    });
  }
  
   editBank( bank:any ){
    const dialogRef = this.dialog.open(EditBankModalComponent,{
      maxWidth: (this.phone) ? "97vw": '800px',
      maxHeight: (this.phone) ? "90vh": '90vh',
      data: {bank}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if(result === 'edit-bank'){
          this.getInitialBanks() 
        }
      } 
    });

   }
  
   onRemove( bank:any ){
  
    this.openDeleteModal('delBank');
  
    this.unsubscribe$ = this.bankCreditcardService.authDelBank$.pipe(take(1)).subscribe(
      (auth)=>{
        if(auth){
          
          if(bank.propulsao_name && bank.propulsao_name[0] !== null && bank.propulsao_name.length > 0){
            this.showWarningSwal(bank.propulsao_name)
          }else{
  
            this.bankCreditcardService.deleteBankById( bank.idbankaccount ).subscribe(
            ( {success} )=>{
  
              setTimeout(()=>{ this.isLoading = false },700);
       
              if(success){
                this.getInitialBanks();
                this.successToast("Conta bancaria eliminada com sucesso.");
              }
            })
          }
  
        }else{
          this.unsubscribe$.unsubscribe();
        }
      })
  }
  
  openDeleteModal( action:string ){
    this.dialog.open(DeleteModalComponent,{
      maxWidth: (this.phone) ? "98vw": '',
      panelClass: "custom-modal-picture",    
      data: { component: "bank", action }
      });
  }
  
  showWarningSwal( propulsaosName:any) {
  
    Swal.fire({
      title: "Si precisar excluir, faça-o através das propulsões associadas.!",
      text: `Esta conta bancaria está atribuída às seguintes propulsões: "${propulsaosName.join('", "')}", ` ,
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
  
  showPropulsaoSwal( ) {
  
    Swal.fire({
      title: "Editar através das propulsões!",
      text: `Este banco está atribuído a uma propulsão`,
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
  
  assignPropulsao( value:any){
    const id = value.idbankaccount;
    const component = "edit-bank";
  
    const dialogRef = this.dialog.open(AddPropulsaoModalComponent,{
       maxWidth: (this.phone) ? "97vw": '800px',
       maxHeight: (this.phone) ? "90vh": '90vh',
       data: { component, id }
   });
   
   dialogRef.afterClosed().subscribe(result => {
     if (result) {
       if(result === 'edit-bank'){
         this.getInitialBanks() 
       }
     } 
   });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    const savedPageSize = localStorage.getItem('bankPageSize');
    if (savedPageSize) {
      this.paginator.pageSize = +savedPageSize;
    }
    this.paginator.page.subscribe((event) => {
      localStorage.setItem('bankPageSize', event.pageSize.toString());
    });
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  

  selectBank( bank:any ){
    this.selectedBank = bank;
   }
  
  successToast( msg:string){
    this.toastr.success(msg, 'Sucesso!!', {
      positionClass: 'toast-bottom-right', 
      timeOut: 3500, 
      messageClass: 'message-toast',
      titleClass: 'title-toast'
    });
  }

  
    
  
  }
  
