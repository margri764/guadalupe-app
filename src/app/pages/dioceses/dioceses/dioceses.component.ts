import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, Subscription, delay, take, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { EditDioceseModalComponent } from '../../modals/edit-diocese-modal/edit-diocese-modal/edit-diocese-modal.component';
import { DeleteModalComponent } from '../../modals/delete-modal/delete-modal/delete-modal.component';
import Swal from 'sweetalert2';
import { getDataSS, saveDataLS } from 'src/app/shared/storage';
import { AddPropulsaoModalComponent } from '../../modals/add-propulsao-modal/add-propulsao-modal/add-propulsao-modal.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ErrorService } from 'src/app/services/error.service';
import { DiocesisCidadeService } from 'src/app/services/diocesis-cidade.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NewDioceseModalComponent } from '../../modals/new-diocese-modal/new-diocese-modal/new-diocese-modal.component';
import { AddCitydioceseModalComponent } from '../../modals/add-citydiocese-modal/add-citydiocese-modal/add-citydiocese-modal.component';



@Component({
  selector: 'app-dioceses',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './dioceses.component.html',
  styleUrl: './dioceses.component.scss'
})

export class DiocesesComponent{
  displayedColumns: string[] = ['number','name', 'description','action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  dioceses : any[]=[];
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
              private diocesisCityService : DiocesisCidadeService,
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

    this.getInitialDioceses();
    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));

  }


openModalNewDioceses(){
  const dialogRef = this.dialog.open(NewDioceseModalComponent,{
    maxWidth: (this.phone) ? "97vw": '800px',
    maxHeight: (this.phone) ? "90vh": '90vh',
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {

      if(result === 'new-diocese'){
            this.getInitialDioceses()   
         }
    } 
  });
}

editDiocese( diocese:any ){
  const dialogRef = this.dialog.open(EditDioceseModalComponent,{
    maxWidth: (this.phone) ? "97vw": '800px',
    maxHeight: (this.phone) ? "90vh": '90vh',
    data: {diocese}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      if(result === 'edit-diocese'){
        this.getInitialDioceses() 
      }
    } 
  });

}

getInitialDioceses(){

  this.diocesisCityService.getAllDioceses().subscribe(
      ( {success, dioceses} )=>{
        if(success){
          this.dioceses = dioceses;
          if(dioceses && dioceses.length > 0){
            this.dataSource.data = dioceses;
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

addCityDiocese( diocese:any){

  const dialogRef = this.dialog.open(AddCitydioceseModalComponent,{
    maxWidth: (this.phone) ? "97vw": '800px',
    maxHeight: (this.phone) ? "90vh": '90vh',
    data: diocese.iddiocese
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      if(result === 'addCity'){
        this.getInitialDioceses() 
      }
    } 
  });
}

onRemove( diocese:any ){

  this.openDeleteModal('delDiocese');

  this.unsubscribe$ = this.diocesisCityService.authDelDiocese$.pipe(take(1)).subscribe(
    (auth)=>{
      if(auth){

        if(diocese.propulsao_name && diocese.propulsao_name[0] !== null && diocese.propulsao_name.length > 0){
          this.showWarningSwal(diocese.propulsao_name)
        }else{

          this.diocesisCityService.deleteDioceseById( diocese.iddiocese ).subscribe(
          ( {success} )=>{

            setTimeout(()=>{ this.isLoading = false },700);
     
            if(success){
              this.getInitialDioceses();
              this.successToast("Diocese eliminada com sucesso.");
            }
          })

        }
    
      }else{
        this.unsubscribe$.unsubscribe();
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

openDeleteModal( action:string ){
  this.dialog.open(DeleteModalComponent,{
    maxWidth: (this.phone) ? "98vw": '',
    panelClass: "custom-modal-picture",    
    data: { component: "diocese", action }
    });
}

showWarningSwal( propulsaosName:any) {

  Swal.fire({
    title: "Si precisar excluir, faça-o através das propulsões associadas.!",
    text: `Esta diocese está atribuída às seguintes propulsões: "${propulsaosName.join('", "')}", ` ,
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
    text: `Esta diocese está atribuído a uma propulsão`,
    icon: "warning",
    // showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "continuar"
  }).then((results) => {
    if (results.isConfirmed) {
 
    //     })
    }
  });
  
}

assignPropulsao( value:any){
  const id = value.iddiocese;
  const component = "edit-diocese";

  const dialogRef = this.dialog.open(AddPropulsaoModalComponent,{
     maxWidth: (this.phone) ? "97vw": '800px',
     maxHeight: (this.phone) ? "90vh": '90vh',
     data: { component, id }
 });
 
 dialogRef.afterClosed().subscribe(result => {
   if (result) {
     if(result === 'edit-diocese'){
       this.getInitialDioceses() 
     }
   } 
 });

}

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  const savedPageSize = localStorage.getItem('diocesePageSize');
  if (savedPageSize) {
    this.paginator.pageSize = +savedPageSize;
  }
  this.paginator.page.subscribe((event) => {
    localStorage.setItem('diocesePageSize', event.pageSize.toString());
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

