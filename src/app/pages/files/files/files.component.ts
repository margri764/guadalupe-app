import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, delay, filter, take } from 'rxjs';
import { getDataSS } from 'src/app/shared/storage';
import { DeleteModalComponent } from '../../modals/delete-modal/delete-modal/delete-modal.component';
import { ViewGroupusersModalComponent } from '../../modals/view-groupusers-modal/view-groupusers-modal/view-groupusers-modal.component';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ErrorService } from 'src/app/services/error.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { MatDialog } from '@angular/material/dialog';
import { EditFileModalComponent } from '../../modals/edit-file-modal/edit-file-modal/edit-file-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './files.component.html',
  styleUrl: './files.component.scss'
})
export class FilesComponent {

  displayedColumns: string[] = ['description','user','group','publishDay', 'status', 'file', 'list'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  files : any[]=[];
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
              private imageUploadService: ImageUploadService,
              private dialog : MatDialog
              ) 

  {

    (screen.width <= 800) ? this.phone = true : this.phone = false;
    
    const user = getDataSS('user');
    if(user){
      this.loggedUser = user;
    }
    this.dataSource = new MatTableDataSource();
  
   }

  ngOnInit(): void {

    if (this.loggedUser.role !== 'webmaster') {
      this.displayedColumns.push('action');
    }

    this.getInitialFiles();
    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));
  }

openModalFile(){

    // const dialogRef = this.dialog.open(NewfileModalComponent,{
    //   maxWidth: (this.phone) ? "97vw": '800px',
    //   maxHeight: (this.phone) ? "90vh": '90vh',   
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     if(result === 'new-file'){
    //       this.getInitialFiles() 
    //     }
    //   } 
    // });

}

downloadZip( file:any){

  this.isLoading = true;

  this.imageUploadService.genAndDownloadZIPFromFiles( file.idfilespack ).subscribe( 
    (success)=>{
      if(success){
        this.isLoading = false;
      }
    })
}

editFile( file:any ){

  
    const dialogRef = this.dialog.open(EditFileModalComponent,{
      maxWidth: (this.phone) ? "97vw": '800px',
      maxHeight: (this.phone) ? "90vh": '90vh',
      data: { file }
  });
  
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      if(result === 'edit-file'){
        this.getInitialFiles() 
      }
    } 
  });


}

getInitialFiles(){
  this.imageUploadService.getAllFilesPack().subscribe(
      ( {success, files} )=>{
        if(success){
          // displayedColumns: string[] = ['description','user','group','publishDay', 'status', 'file', 'list', 'action'];

          if(files && files.length > 0){
            this.dataSource.data = files;
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'description': return item.description;
                case 'user': return item.Nome_Completo;
                case 'group': return item.groups ;
                case 'publishDay': return item.publishDate;
                case 'status': return item.state;
                default: return '';
              }
            };
        setTimeout(()=>{ this.isLoading = false }, 700)
      }
        }
      })
}

onRemove( file:any ){

  this.openDeleteModal('delFilePack');

  this.unsubscribe$ = this.imageUploadService.authDelFilePack$.pipe(take(1)).subscribe(
    (auth)=>{
      if(auth){
          this.imageUploadService.deleteFilePackById( file.idfilespack ).subscribe(
          ( {success} )=>{

            setTimeout(()=>{ this.isLoading = false },700);
     
            if(success){
              this.getInitialFiles();
              this.successToast("Operação de remoção bem-sucedida!");
            }
          })
        
      }else{
        this.unsubscribe$.unsubscribe();
      }
    })
}

getUsersGroup( group:any, index:number ){

  const groupID = group.idgroup;

 this.dialog.open(ViewGroupusersModalComponent,{
    maxWidth: (this.phone) ? "97vw": '800px',
    maxHeight: (this.phone) ? "90vh": '90vh',
    data: { groupID }
});


}

activePauseFile( result:any, action:string ){

  // this.resultFuenteService.activePauseResultado( result.idresult, action).subscribe( 
  //   ( {success})=>{
  //         if(success){
  //           this.getInitialfiles();
  //           if(action === 'active'){
  //             this.successToast("Resultado ativada com successo")
  //           }else if(action === "paused"){
  //             this.warningToast("Resultado pausada com successo")
  //           }
  //         }
  //   } )
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
    data: { component: "file", action }
    });
}

ngOnDestroy(): void {
  if(this.unsubscribe$){
    this.unsubscribe$.unsubscribe();
  }
}

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  const savedPageSize = localStorage.getItem('filesPageSize');
  if (savedPageSize) {
    this.paginator.pageSize = +savedPageSize;
  }
  this.paginator.page.subscribe((event) => {
    localStorage.setItem('filesPageSize', event.pageSize.toString());
  });
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}



}
