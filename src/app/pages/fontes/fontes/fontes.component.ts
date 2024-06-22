import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, delay, take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DeleteModalComponent } from '../../modals/delete-modal/delete-modal/delete-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewFonteModalComponent } from '../../modals/new-fonte-modal/new-fonte-modal/new-fonte-modal.component';
import { EditFonteModalComponent } from '../../modals/edit-fonte-modal/edit-fonte-modal/edit-fonte-modal.component';
import { getDataSS } from 'src/app/shared/storage';
import Swal from 'sweetalert2';
import { AddPropulsaoModalComponent } from '../../modals/add-propulsao-modal/add-propulsao-modal/add-propulsao-modal.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorService } from 'src/app/services/error.service';
import { ResultFuenteService } from 'src/app/services/result-fuente.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AddResultfonteModalComponent } from '../../modals/add-resultfonte-modal/add-resultfonte-modal/add-resultfonte-modal.component';


@Component({
  selector: 'app-fontes',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './fontes.component.html',
  styleUrl: './fontes.component.scss'
})

export class FontesComponent {

  displayedColumns: string[] = ['acronym', 'description','action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  fontes : any[]=[];
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
              private resultFonteService : ResultFuenteService,
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

    this.getInitialFontes();
    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));
    
  }

  openModalNewFonte(){
    const dialogRef = this.dialog.open(NewFonteModalComponent,{
      maxWidth: (this.phone) ? "97vw": '800px',
      maxHeight: (this.phone) ? "90vh": '90vh',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
  
        if(result === 'new-fonte'){
              this.getInitialFontes()   
           }
      } 
    });
  }

editFonte( fonte:any ){
  const dialogRef = this.dialog.open(EditFonteModalComponent,{
    maxWidth: (this.phone) ? "97vw": '800px',
    maxHeight: (this.phone) ? "90vh": '90vh',
    data: {fonte}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      if(result === 'edit-fonte'){
        this.getInitialFontes() 
      }
    } 
  });
}

getInitialFontes(){

  this.isLoading = true;

  this.resultFonteService.getAllFuentes().subscribe(
      ( {success, fontes} )=>{
        if(success){
          this.fontes = fontes;
          if(fontes && fontes.length > 0){
            this.dataSource.data = fontes;
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'acronym': return item.acronym;
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

onRemove( fonte:any ){

  this.openDeleteModal('delFonte');

  this.unsubscribe$ = this.resultFonteService.authDelFonte$.pipe(take(1)).subscribe(
    (auth)=>{
      if(auth){

        if(fonte.propulsao_name && fonte.propulsao_name[0] !== null && fonte.propulsao_name.length > 0){
          this.showWarningSwal(fonte.propulsao_name)
        }else{

          this.resultFonteService.deleteFonteById( fonte.idfonte ).subscribe(
          ( {success} )=>{

            setTimeout(()=>{ this.isLoading = false },700);
     
            if(success){
              this.getInitialFontes();
              this.successToast("Fonte eliminada com sucesso.");
            }
          })

        }

      }else{
        this.unsubscribe$.unsubscribe();
      }
    })
}

addResultFonte( fonte:any ){
  const dialogRef = this.dialog.open(AddResultfonteModalComponent,{
    maxWidth: (this.phone) ? "97vw": '800px',
    maxHeight: (this.phone) ? "90vh": '90vh',
    data: {fonte}
  });

}

showWarningSwal( propulsaosName:any) {
  Swal.fire({
    title: "Si precisar excluir, faça-o através das propulsões associadas.!",
    text: `Esta fonte está atribuída às seguintes propulsões: "${propulsaosName.join('", "')}", ` ,
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
    text: `Esta fonte está atribuída a uma propulsão`,
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
  const id = value.idfonte;
  const component = "edit-fonte";

  const dialogRef = this.dialog.open(AddPropulsaoModalComponent,{
     maxWidth: (this.phone) ? "97vw": '800px',
     maxHeight: (this.phone) ? "90vh": '90vh',
     data: { component, id }
 });
 
 dialogRef.afterClosed().subscribe(result => {
   if (result) {
     if(result === 'edit-fonte'){
       this.getInitialFontes() 
     }
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

openDeleteModal( action:string ){
  this.dialog.open(DeleteModalComponent,{
    maxWidth: (this.phone) ? "98vw": '',
    panelClass: "custom-modal-picture",    
    data: { component: "fonte", action }
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

