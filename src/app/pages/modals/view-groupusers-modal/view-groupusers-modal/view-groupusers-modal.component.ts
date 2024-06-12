import { Component, ElementRef, Inject, Input, OnDestroy, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { NgbActiveModal, NgbActiveOffcanvas, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, delay, take } from 'rxjs';
import { DeleteModalComponent } from '../../delete-modal/delete-modal/delete-modal.component';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { AlarmGroupService } from 'src/app/services/alarm-group.service';
import { ErrorService } from 'src/app/services/error.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { User } from 'src/app/shared/models/user.models';
import { ImagenPathPipe } from "../../../../pipe/imagen-path.pipe";
import { NewUsergroupModalComponent } from '../../new-usergroup-modal/new-usergroup-modal/new-usergroup-modal.component';
import { AssignUsersgroupComponent } from "../../../assign-usersgroup/assign-usersgroup/assign-usersgroup.component";
import { ViewCongregatioModalComponent } from '../../view-congregatio-modal/view-congregatio-modal/view-congregatio-modal.component';

@Component({
    selector: 'app-view-groupusers-modal',
    standalone: true,
    templateUrl: './view-groupusers-modal.component.html',
    styleUrl: './view-groupusers-modal.component.scss',
    imports: [CommonModule, MaterialModule, ImagenPathPipe, AssignUsersgroupComponent]
})
export class ViewGroupusersModalComponent {

  displayedColumns: string[] = ['img','name','action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
	private offcanvasService = inject(NgbOffcanvas);


  @ViewChild('cerrarCanvas', { static: false }) cerrarCanvas: ElementRef;
  
  usersGroup : any []=[];
  selectedGroup : any;
  isLoading : boolean = false;
  phone : boolean = false;
  backClose : boolean = false;
  addUsers : boolean = false;
  groupID : any;


  openDrawer() {
   this.addUsers = true;
  }

  constructor(
                private alarmGroupService : AlarmGroupService,
                private toastr: ToastrService,
                private errorService : ErrorService,
                private dialogRef : MatDialogRef<ViewGroupusersModalComponent>,
                private dialog : MatDialog,
                @Inject(MAT_DIALOG_DATA) public data: any,

             ) 
  
  { 

    (screen.width <= 800) ? this.phone = true : this.phone = false;

    this.dataSource = new MatTableDataSource();
    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));
  }

  ngOnInit(): void {

    this.groupID = this.data.groupID;

    this.getUsersGroup(this.data.groupID);
  }


getUsersGroup( id:any ){

  this.alarmGroupService.getUsersFromGroup(id).subscribe(
    ( {success, users, group} )=>{
      if(success){
        
        this.selectedGroup = {name: group.name, length: users.length};
        if(users && users.length > 0){
          this.dataSource.data = users;
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'name': return item.Nome_Completo;
              case 'action': return item.active;
              default: return '';
            }
          };
        }
        
        setTimeout(()=>{ this.isLoading = false }, 700)
                
         
      
      }
    })
}

private subscription : Subscription;

removeUserFromGroup( group:any ){

  if(this.data.managedFromPropulsao ){
    this.showPropulsaoSwal();
    return;
  }

  this.openDeleteModal('delUserGroup');
    
  this.subscription =  this.alarmGroupService.authDelUserGroup$.pipe(take(1)).subscribe(
    (auth)=>{
      if(auth){
        this.isLoading = true;
        this.alarmGroupService.deleteUserFromGroup( group.idusersgroups ).subscribe(
          ( {success} )=>{
            setTimeout(()=>{ this.isLoading = false },700)
            if(success){
                // this.usersGroup = this.usersGroup .filter(a => a.idusersgroups !== group.idusersgroups);
                this.successToast('Usuário eliminado com successo');
                this.getUsersGroup(this.data.groupID);
                //espero hasta el suceess para hacer el reload en groups
                this.alarmGroupService.successDelUserGroup$.emit(true);

            }
          })
      }else{
        this.subscription.unsubscribe();

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

showPropulsaoSwal( ) {

  Swal.fire({
    title: "Editar através das propulsões!",
    text: `Este grupo está atribuído a uma propulsão`,
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

closingAddUsers( value:boolean){
  this.addUsers = value;
  this.getUsersGroup(this.groupID);
}



openModalFichaCompleta( user:User ){

  
  let userFichaCompleta: any;
  let origin: any;

  if(user && user.linkCongregatio){
    userFichaCompleta = user;
    origin = 'congregatio';

  }else{
    userFichaCompleta = user;
    origin = 'group'
  }
   this.dialog.open(ViewCongregatioModalComponent,{
    maxWidth: (this.phone) ? "98vw": '',
    panelClass: "custom-modal-picture",    
    data: { user: userFichaCompleta, origin  }
    });


  // const modalRef = this.modalService.open(ViewCongregatiComponent,{
  //   keyboard: true, 
  //   backdrop: 'static',
  //   size: 'xl',
  //   scrollable: true
  // });

  // let userFichaCompleta: any;
  // let origin: any;

  // if(user && user.linkCongregatio){
  //   userFichaCompleta = user;
  //   origin = 'congregatio';

  // }else{
  //   userFichaCompleta = user;
  //   origin = 'group'
  // }

  // modalRef.componentInstance.data = { user: userFichaCompleta, origin  }
}

openDeleteModal( action:string ){
  this.dialog.open(DeleteModalComponent,{
    maxWidth: (this.phone) ? "98vw": '',
    panelClass: "custom-modal-picture",    
    data: { component: "view-groupusers", action }
    });
}


closeModal(){
  this.backClose = true;
  setTimeout( ()=>{ this.dialogRef.close() }, 400 )
  
}

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  const savedPageSize = localStorage.getItem('viewGroupUsersPageSize');
  if (savedPageSize) {
    this.paginator.pageSize = +savedPageSize;
  }
  this.paginator.page.subscribe((event) => {
    localStorage.setItem('viewGroupUsersPageSize', event.pageSize.toString());
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
