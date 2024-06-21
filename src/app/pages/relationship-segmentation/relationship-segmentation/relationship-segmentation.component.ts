import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, delay, take } from 'rxjs';
import { getDataSS, saveDataLS } from 'src/app/shared/storage';
import { AddPropulsaoModalComponent } from '../../modals/add-propulsao-modal/add-propulsao-modal/add-propulsao-modal.component';
import { DeleteModalComponent } from '../../modals/delete-modal/delete-modal/delete-modal.component';
import { NewRelationshipModalComponent } from '../../modals/new-relationship-modal/new-relationship-modal/new-relationship-modal.component';
import { EditRelationshipModalComponent } from '../../modals/edit-relationship-modal/edit-relationship-modal/edit-relationship-modal.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ErrorService } from 'src/app/services/error.service';
import { SegmentationService } from 'src/app/services/segmentation.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-relationship-segmentation',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './relationship-segmentation.component.html',
  styleUrl: './relationship-segmentation.component.scss'
})

export class RelationshipSegmentationComponent {

  displayedColumns: string[] = ['name', 'description','action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  relationships : any[]=[];
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
      if (this.loggedUser.role === 'webmaster') {
        const position = this.displayedColumns.length - 1;
        this.displayedColumns.splice(position, 0, 'propulsao');
      }
    }
    (screen.width <= 800) ? this.phone = true : this.phone = false;
    this.dataSource = new MatTableDataSource();

   }



  ngOnInit(): void {

    this.getInitialRelationships();
    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));

    
  }

openModalNewRelationship(){

  const dialogRef = this.dialog.open(NewRelationshipModalComponent,{
    maxWidth: (this.phone) ? "97vw": '800px',
    maxHeight: (this.phone) ? "90vh": '90vh',
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {

      if(result === 'new-relationship'){
            this.getInitialRelationships()   
         }
    } 
  });

}

editRelationship( relationship:any ){

  const dialogRef = this.dialog.open(EditRelationshipModalComponent,{
    maxWidth: (this.phone) ? "97vw": '800px',
    maxHeight: (this.phone) ? "90vh": '90vh',
    data: {relationship}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      if(result === 'edit-relationship'){
        this.getInitialRelationships() 
      }
    } 
  });

}

getInitialRelationships(){
  this.segmentationService.getAllRelationships().subscribe(
    ( {success, relationships} )=>{
      if(success){
        this.relationships = relationships;
        if(relationships && relationships.length > 0){
          this.dataSource.data = relationships;
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

onRemove( relationship:any ){

  this.openDeleteModal('delRelationship');
  
  this.unsubscribe$ = this.segmentationService.authDelRelationship$.pipe(take(1)).subscribe(
    (auth)=>{
      if(auth){

          this.segmentationService.deleteRelationshipById( relationship.idrelationship ).subscribe(
          ( {success} )=>{

            setTimeout(()=>{ this.isLoading = false }, 1200);
     
            if(success){
              this.getInitialRelationships();
              this.successToast("Relacão eliminada com sucesso.");
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

  const id = value.idrelationship;
  const component = "edit-relationship";

  const dialogRef = this.dialog.open(AddPropulsaoModalComponent,{
     maxWidth: (this.phone) ? "97vw": '800px',
     maxHeight: (this.phone) ? "90vh": '90vh',
     data: { component, id }
 });
 
 dialogRef.afterClosed().subscribe(result => {
   if (result) {
     if(result === 'edit-relationship'){
       this.getInitialRelationships() 
     }
   } 
 });

}

openDeleteModal( action:string ){
  this.dialog.open(DeleteModalComponent,{
    maxWidth: (this.phone) ? "98vw": '',
    panelClass: "custom-modal-picture",    
    data: { component: "relationship", action }
    });

}

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  const savedPageSize =  localStorage.getItem('relationshipSegmentationPageSize');
  if (savedPageSize) {
    this.paginator.pageSize = +savedPageSize;
  }
  this.paginator.page.subscribe((event) => {
    localStorage.setItem('relationshipSegmentationPageSize', event.pageSize.toString());
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
