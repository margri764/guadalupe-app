import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, delay, take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DeleteModalComponent } from '../../modals/delete-modal/delete-modal/delete-modal.component';
import { EditAssociationModalComponent } from '../../modals/edit-association-modal/edit-association-modal/edit-association-modal.component';
import { getDataSS } from 'src/app/shared/storage';
import Swal from 'sweetalert2';
import { RoundOffsets } from '@popperjs/core/lib/modifiers/computeStyles';
import { Router } from '@angular/router';
import { AddPropulsaoModalComponent } from '../../modals/add-propulsao-modal/add-propulsao-modal/add-propulsao-modal.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ErrorService } from 'src/app/services/error.service';
import { AssociationService } from 'src/app/services/association.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NewAssociationModalComponent } from '../../modals/new-association-modal/new-association-modal/new-association-modal.component';
import { AssociationLogoPipe } from "../../../pipe/association-logo.pipe";


@Component({
    selector: 'app-association',
    standalone: true,
    templateUrl: './association.component.html',
    styleUrl: './association.component.scss',
    imports: [CommonModule, MaterialModule, AssociationLogoPipe]
})
export class AssociationComponent {

  displayedColumns: string[] = ['img', 'name', 'number', 'description','action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  associations : any[]=[];
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
              private associationService : AssociationService,
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

    this.getInitialAssociations();
    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));
  }

  openModalNewAssociation(){
    const dialogRef = this.dialog.open(NewAssociationModalComponent,{
      maxWidth: (this.phone) ? "97vw": '800px',
      maxHeight: (this.phone) ? "90vh": '90vh',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
  
        if(result === 'new-association'){
              this.getInitialAssociations()   
           }
      } 
    });
  }


editAssociation( association:any ){
  const dialogRef = this.dialog.open(EditAssociationModalComponent,{
    maxWidth: (this.phone) ? "97vw": '800px',
    maxHeight: (this.phone) ? "90vh": '90vh',
    data: {association}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      if(result === 'edit-association'){
        this.getInitialAssociations() 
      }
    } 
  });
}

getInitialAssociations(){
  this.associationService.getAllAssociations().subscribe(
    ( {success, associations} )=>{
      if(success){
         this.associations = associations;
        if(associations && associations.length > 0){
          this.dataSource.data = associations;
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'name': return item.name;
              case 'number': return item.number;
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

onRemove( association:any ){

  this.openDeleteModal('delAssociation');
  
  this.unsubscribe$ =this.associationService.authDelAssociation$.pipe(take(1)).subscribe(
    (auth)=>{
      if(auth){

        if(association.propulsao_name && association.propulsao_name[0] !== null && association.propulsao_name.length > 0){
          this.showWarningSwal(association.propulsao_name)
        }else{

          this.associationService.deleteAssociationById( association.idassociation ).subscribe(
          ( {success} )=>{

            setTimeout(()=>{ this.isLoading = false },700);
     
            if(success){
              this.getInitialAssociations();
              this.successToast("Associação eliminada com sucesso.");
            }
          })
        }
      }else{
        this.unsubscribe$.unsubscribe();
      }
    })
}

showWarningSwal( propulsaosName:any) {
  Swal.fire({
    title: "Si precisar excluir, faça-o através das propulsões associadas.!",
    text: `Esta Associação está atribuída às seguintes propulsões: "${propulsaosName.join('", "')}", ` ,
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

successToast( msg:string){
  this.toastr.success(msg, 'Sucesso!!', {
    positionClass: 'toast-bottom-right', 
    timeOut: 3500, 
    messageClass: 'message-toast',
    titleClass: 'title-toast'
  });
}

assignPropulsao( value:any){
  const id = value.idassociation;
  const component = "edit-association";

  const dialogRef = this.dialog.open(AddPropulsaoModalComponent,{
     maxWidth: (this.phone) ? "97vw": '800px',
     maxHeight: (this.phone) ? "90vh": '90vh',
     data: { component, id }
 });
 
 dialogRef.afterClosed().subscribe(result => {
   if (result) {
     if(result === 'edit-association'){
       this.getInitialAssociations() 
     }
   } 
 });
}

openDeleteModal( action:string ){
  this.dialog.open(DeleteModalComponent,{
    maxWidth: (this.phone) ? "98vw": '',
    panelClass: "custom-modal-picture",    
    data: { component: "associations", action }
    });
}

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  const savedPageSize = localStorage.getItem('associationPageSize');
  if (savedPageSize) {
    this.paginator.pageSize = +savedPageSize;
  }
  this.paginator.page.subscribe((event) => {
    localStorage.setItem('associationPageSize', event.pageSize.toString());
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

