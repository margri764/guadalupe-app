import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, delay, take } from 'rxjs';
import { getDataSS } from 'src/app/shared/storage';
import { AddPropulsaoModalComponent } from '../../modals/add-propulsao-modal/add-propulsao-modal/add-propulsao-modal.component';
import { DeleteModalComponent } from '../../modals/delete-modal/delete-modal/delete-modal.component';
import { ErrorService } from 'src/app/services/error.service';
import { SegmentationService } from 'src/app/services/segmentation.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { NewTratamentoModalComponent } from '../../modals/new-tratamento-modal/new-tratamento-modal/new-tratamento-modal.component';
import { saveDataLS } from 'src/app/storage';
import { EditTratamentoModalComponent } from '../../modals/edit-tratamento-modal/edit-tratamento-modal/edit-tratamento-modal.component';


@Component({
  selector: 'app-tratamento',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './tratamento.component.html',
  styleUrl: './tratamento.component.scss'
})
export class TratamentoComponent {

  displayedColumns: string[] = ['number','acronym','name', 'description','action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  tratamentos : any[]=[];
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
              private segmentationService : SegmentationService,
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

    this.getInitialTratamentos();
    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));
    
  }

openModalNewTratamento(){

  const dialogRef = this.dialog.open(NewTratamentoModalComponent,{
    maxWidth: (this.phone) ? "97vw": '800px',
    maxHeight: (this.phone) ? "90vh": '90vh',
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {

      if(result === 'new-tratamento'){
            this.getInitialTratamentos()   
         }
    } 
  });

}

editTratamento( tratamento:any ){
  const dialogRef = this.dialog.open(EditTratamentoModalComponent,{
    maxWidth: (this.phone) ? "97vw": '800px',
    maxHeight: (this.phone) ? "90vh": '90vh',
    data: {tratamento}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      if(result === 'edit-tratamento'){
        this.getInitialTratamentos() 
      }
    } 
  });
}

getInitialTratamentos(){
  this.segmentationService.getAllTratamentos().subscribe(
    ( {success, tratamentos} )=>{
      if(success){
        if(tratamentos && tratamentos.length > 0){
          this.dataSource.data = tratamentos;
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'number': return item.number;
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

onRemove( tratamento:any ){

  this.openDeleteModal('delTratamento');
  
  this.unsubscribe$ = this.segmentationService.authDelTratamento$.pipe(take(1)).subscribe(
    (auth)=>{
      if(auth){

          this.segmentationService.deleteTratamentoById( tratamento.idtratamento ).subscribe(
          ( {success} )=>{

            setTimeout(()=>{ this.isLoading = false },700);
     
            if(success){
              this.getInitialTratamentos();
              this.successToast("Tratamento eliminado com sucesso.");
            }
          })
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

assignPropulsao( value:any){

  const id = value.idtratamento;
  const component = "edit-tratamento";

  const dialogRef = this.dialog.open(AddPropulsaoModalComponent,{
     maxWidth: (this.phone) ? "97vw": '800px',
     maxHeight: (this.phone) ? "90vh": '90vh',
     data: { component, id }
 });
 
 dialogRef.afterClosed().subscribe(result => {
   if (result) {
     if(result === 'edit-tratamento'){
       this.getInitialTratamentos() 
     }
   } 
 });

}

openDeleteModal( action:string ){
  this.dialog.open(DeleteModalComponent,{
    maxWidth: (this.phone) ? "98vw": '',
    panelClass: "custom-modal-picture",    
    data: { component: "tratamento", action }
    });
}

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  const savedPageSize =  localStorage.getItem('tratamentoPageSize');
  if (savedPageSize) {
    this.paginator.pageSize = +savedPageSize;
  }
  this.paginator.page.subscribe((event) => {
    localStorage.setItem('tratamentoPageSize', event.pageSize.toString());
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
