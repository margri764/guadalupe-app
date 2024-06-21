import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, delay, take } from 'rxjs';
import { getDataSS, saveDataLS } from 'src/app/shared/storage';
import { AddPropulsaoModalComponent } from '../../modals/add-propulsao-modal/add-propulsao-modal/add-propulsao-modal.component';
import { DeleteModalComponent } from '../../modals/delete-modal/delete-modal/delete-modal.component';
import { ErrorService } from 'src/app/services/error.service';
import { SegmentationService } from 'src/app/services/segmentation.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NewAddressegmentationModalComponent } from '../../modals/new-addressegmentation-modal/new-addressegmentation-modal/new-addressegmentation-modal.component';
import { EditAddressegmentationModalComponent } from '../../modals/edit-addressegmentation-modal/edit-addressegmentation-modal/edit-addressegmentation-modal.component';

@Component({
  selector: 'app-address-segmentation',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './address-segmentation.component.html',
  styleUrl: './address-segmentation.component.scss'
})

export class AddressSegmentationComponent {

    displayedColumns: string[] = ['name', 'description','action'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    addressSegmentations : any[]=[];
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

    const dialogRef = this.dialog.open(NewAddressegmentationModalComponent,{
      maxWidth: (this.phone) ? "97vw": '800px',
      maxHeight: (this.phone) ? "90vh": '90vh',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
  
        if(result === 'new-addresssegmentation'){
              this.getInitialSegmentation()   
           }
      } 
    });
   
  }
  
  editSegmentation( segmentation:any ){

    const dialogRef = this.dialog.open(EditAddressegmentationModalComponent,{
      maxWidth: (this.phone) ? "97vw": '800px',
      maxHeight: (this.phone) ? "90vh": '90vh',
      data: {segmentation}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if(result === 'edit-addresssegmentation'){
          this.getInitialSegmentation() 
        }
      } 
    });
  }
  
  getInitialSegmentation(){
    this.segmentationService.getAllAddressSegmentation().subscribe(
      ( {success, addressSegmentations} )=>{
        if(success){
          this.addressSegmentations = addressSegmentations;
          if(addressSegmentations && addressSegmentations.length > 0){
            this.dataSource.data = addressSegmentations;
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
  
    this.openDeleteModal('delAddressSegmentation');
    
    this.unsubscribe$ = this.segmentationService.authDelAddressSegmentation$.pipe(take(1)).subscribe(
      (auth)=>{
        if(auth){
  
            this.segmentationService.deleteAddressSegmentationById( segmentation.idaddresssegmentation ).subscribe(
            ( {success} )=>{
  
              setTimeout(()=>{ this.isLoading = false },1200);
       
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
   const id = value.idaddresssegmentation;
    const component = "edit-addresssegmentation";
    const dialogRef = this.dialog.open(AddPropulsaoModalComponent,{
       maxWidth: (this.phone) ? "97vw": '800px',
       maxHeight: (this.phone) ? "90vh": '90vh',
       data: { component, id }
   });
   
   dialogRef.afterClosed().subscribe(result => {
     if (result) {
       if(result === 'edit-addresssegmentation'){
         this.getInitialSegmentation() 
       }
     } 
   });
  
  }
  
  openDeleteModal( action:string ){
    this.dialog.open(DeleteModalComponent,{
      maxWidth: (this.phone) ? "98vw": '',
      panelClass: "custom-modal-picture",    
      data: { component: "address-segmentation", action }
      });
   
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    const savedPageSize = localStorage.getItem('addressSegmentationPageSize');
    if (savedPageSize) {
      this.paginator.pageSize = +savedPageSize;
    }
    this.paginator.page.subscribe((event) => {
      localStorage.setItem('addressSegmentationPageSize', event.pageSize.toString());
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
  
