import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, delay, take } from 'rxjs';
import { getDataSS, saveDataLS } from 'src/app/shared/storage';
import { EditProfessionModalComponent } from '../../modals/edit-profession-modal/edit-profession-modal/edit-profession-modal.component';
import { AddPropulsaoModalComponent } from '../../modals/add-propulsao-modal/add-propulsao-modal/add-propulsao-modal.component';
import { DeleteModalComponent } from '../../modals/delete-modal/delete-modal/delete-modal.component';
import { NewProfessionModalComponent } from '../../modals/new-profession-modal/new-profession-modal/new-profession-modal.component';
import { ErrorService } from 'src/app/services/error.service';
import { SegmentationService } from 'src/app/services/segmentation.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-profession',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './profession.component.html',
  styleUrl: './profession.component.scss'
})
export class ProfessionComponent {

  displayedColumns: string[] = ['number','name', 'description','action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  professions : any[]=[];
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

    this.getInitialProfessions();
    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));
    
  }

openModalNewProfession(){

  const dialogRef = this.dialog.open(NewProfessionModalComponent,{
    maxWidth: (this.phone) ? "97vw": '800px',
    maxHeight: (this.phone) ? "90vh": '90vh',
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {

      if(result === 'new-profession'){
            this.getInitialProfessions()   
         }
    } 
  });



}

editProfession( profession:any ){

  const dialogRef = this.dialog.open(EditProfessionModalComponent,{
    maxWidth: (this.phone) ? "97vw": '800px',
    maxHeight: (this.phone) ? "90vh": '90vh',
    data: {profession}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      if(result === 'edit-profession'){
        this.getInitialProfessions() 
      }
    } 
  });

}

getInitialProfessions(){
  this.segmentationService.getAllProfessions().subscribe(
    ( {success, professions} )=>{
      if(success){
         this.professions = professions;
        if(professions && professions.length > 0){
          this.dataSource.data = professions;
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'number': return item.number;
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

onRemove( profession:any ){

  this.openDeleteModal('delProfession');
  
  this.unsubscribe$ = this.segmentationService.authDelProfession$.pipe(take(1)).subscribe(
    (auth)=>{
      if(auth){

          this.segmentationService.deleteProfessionById( profession.idprofession ).subscribe(
          ( {success} )=>{

            setTimeout(()=>{ this.isLoading = false },700);
     
            if(success){
              this.getInitialProfessions();
              this.successToast("Profissão eliminada com sucesso.");
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

  const id = value.idprofession;
  const component = "edit-profession";

  const dialogRef = this.dialog.open(AddPropulsaoModalComponent,{
     maxWidth: (this.phone) ? "97vw": '800px',
     maxHeight: (this.phone) ? "90vh": '90vh',
     data: { component, id }
 });
 
 dialogRef.afterClosed().subscribe(result => {
   if (result) {
     if(result === 'edit-profession'){
       this.getInitialProfessions() 
     }
   } 
 });

}


openDeleteModal( action:string ){
  this.dialog.open(DeleteModalComponent,{
    maxWidth: (this.phone) ? "98vw": '',
    panelClass: "custom-modal-picture",    
    data: { component: "profession", action }
    });
}

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  const savedPageSize = getDataSS('professionPageSize');
  if (savedPageSize) {
    this.paginator.pageSize = +savedPageSize;
  }
  this.paginator.page.subscribe((event) => {
    saveDataLS('professionPageSize', event.pageSize.toString());
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
