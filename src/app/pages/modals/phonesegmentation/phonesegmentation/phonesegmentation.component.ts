import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, delay, take } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { ErrorService } from 'src/app/services/error.service';
import { SegmentationService } from 'src/app/services/segmentation.service';
import { getDataSS, saveDataLS } from 'src/app/shared/storage';
import { NewPhonesegmentationModalComponent } from '../../new-phonesegmentation-modal/new-phonesegmentation-modal/new-phonesegmentation-modal.component';
import { EditPhonesegmentationModalComponent } from '../../edit-phonesegmentation-modal/edit-phonesegmentation-modal/edit-phonesegmentation-modal.component';
import { AddPropulsaoModalComponent } from '../../add-propulsao-modal/add-propulsao-modal/add-propulsao-modal.component';
import { DeleteModalComponent } from '../../delete-modal/delete-modal/delete-modal.component';


@Component({
  selector: 'app-phonesegmentation',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './phonesegmentation.component.html',
  styleUrl: './phonesegmentation.component.scss'
})
export class PhonesegmentationComponent {

  
  displayedColumns: string[] = ['name', 'description','action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  phoneSegmentations : any[]=[];
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

    this.getInitialSegmentation();
    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));

    
  }

openModalNewSegmentation(){

  const dialogRef = this.dialog.open(NewPhonesegmentationModalComponent,{
    maxWidth: (this.phone) ? "97vw": '800px',
    maxHeight: (this.phone) ? "90vh": '90vh',
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {

      if(result === 'new-phonesegmentation'){
            this.getInitialSegmentation()   
         }
    } 
  });

}

editSegmentation( segmentation:any ){

  const dialogRef = this.dialog.open(EditPhonesegmentationModalComponent,{
    maxWidth: (this.phone) ? "97vw": '800px',
    maxHeight: (this.phone) ? "90vh": '90vh',
    data: {segmentation}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      if(result === 'edit-phonesegmentation'){
        this.getInitialSegmentation() 
      }
    } 
  });

}

getInitialSegmentation(){
  this.segmentationService.getAllPhoneSegmentation().subscribe(
    ( {success, phoneSegmentations} )=>{
      if(success){
        this.phoneSegmentations = phoneSegmentations;
        if(phoneSegmentations && phoneSegmentations.length > 0){
          this.dataSource.data = phoneSegmentations;
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

onRemove( segmentation:any ){

  this.openDeleteModal('delPhoneSegmentation');
  
  this.unsubscribe$ = this.segmentationService.authDelPhoneSegmentation$.pipe(take(1)).subscribe(
    (auth)=>{
      if(auth){

          this.segmentationService.deletePhoneSegmentationById( segmentation.idphonesegmentation ).subscribe(
          ( {success} )=>{

            setTimeout(()=>{ this.isLoading = false },700);
     
            if(success){
              this.getInitialSegmentation();
              this.successToast("Segmentação eliminada com sucesso.");
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

  const id = value.idphonesegmentation;
  const component = "edit-phonesegmentation";

  const dialogRef = this.dialog.open(AddPropulsaoModalComponent,{
     maxWidth: (this.phone) ? "97vw": '800px',
     maxHeight: (this.phone) ? "90vh": '90vh',
     data: { component, id }
 });
 
 dialogRef.afterClosed().subscribe(result => {
   if (result) {
     if(result === 'edit-phonesegmentation'){
       this.getInitialSegmentation() 
     }
   } 
 });

}

openDeleteModal( action:string ){
  this.dialog.open(DeleteModalComponent,{
    maxWidth: (this.phone) ? "98vw": '',
    panelClass: "custom-modal-picture",    
    data: { component: "phone-segmentation", action }
    });
}


ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  const savedPageSize =  localStorage.getItem('phoneSegmentationPageSize');
  if (savedPageSize) {
    this.paginator.pageSize = +savedPageSize;
  }
  this.paginator.page.subscribe((event) => {
    localStorage.setItem('phoneSegmentationPageSize', event.pageSize.toString());
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
