import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, Subscription, delay, take, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DeleteModalComponent } from '../../modals/delete-modal/delete-modal/delete-modal.component';
import { EditResultModalComponent } from '../../modals/edit-result-modal/edit-result-modal/edit-result-modal.component';
import { NewResultModalComponent } from '../../modals/new-result-modal/new-result-modal/new-result-modal.component';
import { getDataSS } from 'src/app/shared/storage';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ResultFuenteService } from 'src/app/services/result-fuente.service';
import { ErrorService } from 'src/app/services/error.service';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent {

  displayedColumns: string[] = ['acronym', 'description','action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  results : any[]=[];
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
              private fb : FormBuilder,
              private toastr: ToastrService,
              private resultFuenteService : ResultFuenteService,
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

    this.getInitialResults();
    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));


  }

openModalResul(){
  const dialogRef = this.dialog.open(NewResultModalComponent,{
    maxWidth: (this.phone) ? "97vw": '800px',
    maxHeight: (this.phone) ? "90vh": '90vh',
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {

      if(result === 'new-result'){
            this.getInitialResults()   
         }
    } 
  });

}

editResult( result:any ){
  const dialogRef = this.dialog.open(EditResultModalComponent,{
    maxWidth: (this.phone) ? "97vw": '800px',
    maxHeight: (this.phone) ? "90vh": '90vh',
    data: {result}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      if(result === 'edit-result'){
        this.getInitialResults() 
      }
    } 
  });
}

getInitialResults(){
  this.resultFuenteService.getAllResults().subscribe(
      ( {success, results} )=>{
        if(success){
           this.results = results;
          if(results && results.length > 0){
            this.dataSource.data = results;
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

onRemove( result:any ){

  this.openDeleteModal('delResult');

  this.unsubscribe$ = this.resultFuenteService.authDelResult$.pipe(take(1)).subscribe(
    (auth)=>{
      if(auth){
        
        if(result.propulsao_name && result.propulsao_name[0] !== null && result.propulsao_name.length > 0){
          this.showWarningSwal(result.propulsao_name)
        }else{

          this.resultFuenteService.deleteResultById( result.idresult ).subscribe(
          ( {success} )=>{

            setTimeout(()=>{ this.isLoading = false },700);
     
            if(success){
              this.getInitialResults();
              this.successToast("Resultado eliminado com sucesso.");
            }
          })
        }
        
      }else{
        this.unsubscribe$.unsubscribe();
      }
    })
}

activePauseResultado( result:any, action:string ){

  this.resultFuenteService.activePauseResultado( result.idresult, action).subscribe( 
    ( {success})=>{
          if(success){
            this.getInitialResults();
            if(action === 'active'){
              this.successToast("Resultado ativada com successo")
            }else if(action === "paused"){
              this.warningToast("Resultado pausada com successo")
            }
          }
    } )
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
    if(result.isConfirmed){
      this.router.navigateByUrl('/dashboard/administradores')
    }
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
    data: { component: "result", action }
    });
}

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  const savedPageSize = localStorage.getItem('resultPageSize');
  if (savedPageSize) {
    this.paginator.pageSize = +savedPageSize;
  }
  this.paginator.page.subscribe((event) => {
    localStorage.setItem('resultPageSize', event.pageSize.toString());
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

