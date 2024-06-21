import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, delay, take } from 'rxjs';
import { getDataSS, saveDataLS } from 'src/app/shared/storage';
import { AddPropulsaoModalComponent } from '../../modals/add-propulsao-modal/add-propulsao-modal/add-propulsao-modal.component';
import { DeleteModalComponent } from '../../modals/delete-modal/delete-modal/delete-modal.component';
import { NewEmailsegmentationModalComponent } from '../../modals/new-emailsegmentation-modal/new-emailsegmentation-modal/new-emailsegmentation-modal.component';
import { EditEmailsegmentationModalComponent } from '../../modals/edit-emailsegmentation-modal/edit-emailsegmentation-modal/edit-emailsegmentation-modal.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ErrorService } from 'src/app/services/error.service';
import { UserService } from 'src/app/services/user.service';
import { SegmentationService } from 'src/app/services/segmentation.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-email-segmentation',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, RouterModule],
  templateUrl: './email-segmentation.component.html',
  styleUrl: './email-segmentation.component.scss'
})
export class EmailSegmentationComponent {

  displayedColumns: string[] = ['name', 'description','action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  emailSegmentations : any[]=[];
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
              private userService : UserService,
              private segmentationService : SegmentationService,
              private dialog :  MatDialog
    
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

  const dialogRef = this.dialog.open(NewEmailsegmentationModalComponent,{
    maxWidth: (this.phone) ? "97vw": '800px',
    maxHeight: (this.phone) ? "90vh": '90vh',
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {

      if(result === 'new-emailsegmentation'){
            this.getInitialSegmentation()   
         }
    } 
  });

}

editSegmentation( segmentation:any ){

  const dialogRef = this.dialog.open(EditEmailsegmentationModalComponent,{
    maxWidth: (this.phone) ? "97vw": '800px',
    maxHeight: (this.phone) ? "90vh": '90vh',
    data: {segmentation}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      if(result === 'edit-segmentation'){
        this.getInitialSegmentation() 
      }
    } 
  });

}

getInitialSegmentation(){
  this.segmentationService.getAllEmailSegmentation().subscribe(
    ( {success, emailSegmentations} )=>{
      if(success){
        this.emailSegmentations = emailSegmentations;
        if(emailSegmentations && emailSegmentations.length > 0){
          this.dataSource.data = emailSegmentations;
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

  this.openDeleteModal('delEmailSegmentation');
  
  this.unsubscribe$ = this.segmentationService.authDelEmailSegmentation$.pipe(take(1)).subscribe(
    (auth)=>{
      if(auth){

          this.segmentationService.deleteEmailSegmentationById( segmentation.idemailsegmentation ).subscribe(
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

  const id = value.idemailsegmentation;
  const component = "edit-emailsegmentation";

  const dialogRef = this.dialog.open(AddPropulsaoModalComponent,{
     maxWidth: (this.phone) ? "97vw": '800px',
     maxHeight: (this.phone) ? "90vh": '90vh',
     data: { component, id }
 });
 
 dialogRef.afterClosed().subscribe(result => {
   if (result) {
     if(result === 'edit-emailsegmentation'){
       this.getInitialSegmentation() 
     }
   } 
 });

}

openDeleteModal( action:string ){
  this.dialog.open(DeleteModalComponent,{
    maxWidth: (this.phone) ? "98vw": '',
    panelClass: "custom-modal-picture",    
    data: { component: "email-segmentation", action }
    });
}

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  const savedPageSize =  localStorage.getItem('emailSegmentationPageSize');
  if (savedPageSize) {
    this.paginator.pageSize = +savedPageSize;
  }
  this.paginator.page.subscribe((event) => {
    localStorage.setItem('emailSegmentationPageSize', event.pageSize.toString());
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
