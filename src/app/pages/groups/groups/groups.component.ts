import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject, Subscription, delay, take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { getDataSS } from 'src/app/shared/storage';
import { Router, RouterModule } from '@angular/router';
import { ErrorService } from 'src/app/services/error.service';
import { MatDialog } from '@angular/material/dialog';
import { AlarmGroupService } from 'src/app/services/alarm-group.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DeleteModalComponent } from '../../modals/delete-modal/delete-modal/delete-modal.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { NewGroupModalComponent } from '../../modals/new-group-modal/new-group-modal/new-group-modal.component';
import { EditGroupModalComponent } from '../../modals/edit-group-modal/edit-group-modal/edit-group-modal.component';
import { ViewGroupusersModalComponent } from '../../modals/view-groupusers-modal/view-groupusers-modal/view-groupusers-modal.component';


@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss'
})
export class GroupsComponent {


  @Input() user: any;

  displayedColumns: string[] = ['name','description','membersNumber','propulsao','action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  groups : any[]=[];
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
              private alarmGroupService : AlarmGroupService,
              private dialog : MatDialog,
              private toastr: ToastrService,
              private router : Router
  
    
              ) 

  {
    const user = getDataSS('user');
    if(user){
      this.loggedUser = user;
    }

    (screen.width <= 800) ? this.phone = true : this.phone = false;

    this.dataSource = new MatTableDataSource();

   }


  ngOnInit(): void {

    this.getInitialData();
    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));

    this.alarmGroupService.successDelUserGroup$.subscribe((auth)=>{if(auth){ this.getInitialData() }});
    this.alarmGroupService.successAssignUserGroup$.subscribe((auth)=>{if(auth){ this.getInitialData() }});
    
  }

  newUsersGroup( group:any){

    // const modalRef = this.modalService.open(NewUsergroupModalsComponent,{
    //   backdrop: 'static', 
    //   size: "lg"
    // });

    // modalRef.componentInstance.data =  group.idgroup ;

    // modalRef.result.then(
    //   (result) => {
    //     if(result === 'createGroupOk'){
    //     this.getInitialData()      }
    //   },
    // );


  }

  openModalGroupAlarm(){
    const dialogRef = this.dialog.open(NewGroupModalComponent,{
      maxWidth: (this.phone) ? "97vw": '800px',
      maxHeight: (this.phone) ? "90vh": '90vh',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
  
        if(result === 'new-group'){
                this.getInitialData();
              }
      } 
    });
  }

  getUsersGroup( group:any ){

    let managedFromPropulsao : boolean = false

    if(group.propulsao_name && group.propulsao_name[0] !== null ){
      managedFromPropulsao = true
    }

    const groupID=  group.idgroup;


    this.dialog.open(ViewGroupusersModalComponent,{
      maxWidth: (this.phone) ? "97vw": '800px',
      maxHeight: (this.phone) ? "90vh": '90vh',
      data: { groupID, managedFromPropulsao }
    });


    //  const groupID=  group.idgroup;

    // const modalRef = this.modalService.open(ViewGroupusersModalComponent,{
    //   backdrop: 'static', 
    //   size: "lg"
    // });

    // modalRef.componentInstance.data = { groupID, managedFromPropulsao }
  
  }

  assignPropulsao( value:any){

  //  const id = value.idgroup;
  //  const component = "edit-group";

  //   const modalRef = this.modalService.open(AddPropulsaoModalComponent,{
  //     backdrop: 'static', 
  //     // keyboard: false,  
  //     size: "md"
  //   });
  
  //   modalRef.componentInstance.data = { component, id }
  //   modalRef.result.then(
  //     (result) => {
  //       if(result === 'edit-group'){
  //      this.getInitialData()      }
  //     },
  //   );

  }

editGroup( group:any ){

    const dialogRef = this.dialog.open(EditGroupModalComponent,{
      maxWidth: (this.phone) ? "97vw": '800px',
      maxHeight: (this.phone) ? "90vh": '90vh',
      data: {group}
  });
  
  dialogRef.afterClosed().subscribe(result => {
    if (result) {

      if(result === 'edit-group'){
        this.getInitialData() 
            }
    } 
  });

}

getInitialData(){

  this.alarmGroupService.getAllGroups().subscribe(
      ( {success, groups} )=>{
        if(success){

        if(groups && groups.length > 0){
              this.dataSource.data = groups;
              this.dataSource.sortingDataAccessor = (item, property) => {
                switch (property) {
                  case 'name': return item.name;
                  case 'description': return item.description;
                  case 'membersNumber': return item.quantity;
                  case 'propulsao': return item.propulsao_name;
                  case 'action': return item.active;
                  default: return '';
                }
              };
            }
          setTimeout(()=>{ this.isLoading = false }, 700)
        }
      })
}

onRemove( group:any ){

  this.openDeleteModal('delGroup');

  this.unsubscribe$ =this.alarmGroupService.authDelGroup$.pipe(take(1)).subscribe(
    (auth)=>{
      if(auth){

        if(group.propulsao_name && group.propulsao_name[0] !== null && group.propulsao_name.length > 0){
          this.showWarningSwal(group.propulsao_name)
        }else{

          this.alarmGroupService.deleteGroup( group.idgroup ).subscribe(
          ( {success} )=>{

            setTimeout(()=>{ this.isLoading = false },700);
     
            if(success){
              this.getInitialData();
              this.successToast("Grupo eliminado com sucesso.");
            }
          })
        }
 
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

showWarningSwal( propulsaosName:any) {

  Swal.fire({
    title: "Exclua das unidades associadas",
    text: `Este grupo está atribuído às seguintes propulsões: "${propulsaosName.join('", "')}", ` ,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Login como administrador"
  }).then((result)=>{
    if(result.isConfirmed){
      this.router.navigateByUrl('/painel/administradores')
    }
  })
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
    }
  });
  
}

openDeleteModal( action:string ){
  // const modalRef = this.modalService.open(DeleteModalComponent,{
  //   backdrop: 'static', 
  //   keyboard: false,    
  //   windowClass: 'custom-modal-delete'
  // });
  // modalRef.componentInstance.data = { component: "groups", action }

  
  this.dialog.open(DeleteModalComponent,{
    maxWidth: (this.phone) ? "98vw": '',
    panelClass: "custom-modal-picture",    
    data: { component: "groups", action }
    });

}

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;

  const savedPageSize = localStorage.getItem('groupPageSize');
  if (savedPageSize) {
    this.paginator.pageSize = +savedPageSize;
  }

  this.paginator.page.subscribe((event) => {
    localStorage.setItem('groupPageSize', event.pageSize.toString());
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
