import { Component, ViewChild,} from '@angular/core';
import { Subject, Subscription, delay, take, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { EditPropulsaoModalComponent } from '../../modals/edit-propulsao-modal/edit-propulsao-modal/edit-propulsao-modal.component';
import { DeleteModalComponent } from 'src/app/pages/modals/delete-modal/delete-modal/delete-modal.component';
import { getDataSS } from 'src/app/shared/storage';
import * as authActions from 'src/app/shared/redux/auth.actions';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/redux/app.reducer';
import { ErrorService } from 'src/app/services/error.service';
import { PropulsaoService } from 'src/app/services/propulsao.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { NewPropulsaoModalComponent } from '../../modals/new-propulsao-modal/new-propulsao-modal/new-propulsao-modal.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';


@Component({
  selector: 'app-propulsoes',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './propulsoes.component.html',
  styleUrl: './propulsoes.component.scss'
})
export class PropulsoesComponent {
  
  displayedColumns: string[] = ['name','currency', 'description','action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  propulsaos : any[]=[];
  isLoading : boolean = false;
  showSuccess : boolean = false;
  showSuccessCreateGroup : boolean = false;
  msg : string = '';


  private unsubscribe$: Subscription;
  phone : boolean = false;
  show : boolean = false;
  
  constructor(
              private errorService : ErrorService,
              private propulsaoService : PropulsaoService,
              private toastr: ToastrService,
              private store : Store<AppState>,
              private dialog : MatDialog
              ) 

  {
    (screen.width <= 800) ? this.phone = true : this.phone = false;
    this.dataSource = new MatTableDataSource();
   }

  ngOnInit(): void {

    this.getInitialPropulsaos();
    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));
  }

  settingPropulsaoModal( propulsao:any){

    // if(propulsao.status && propulsao.status !== 'no_assigned'){
    //   return;
    // }

    // const propulsaoName = getDataSS("propulsaoName");

    // if(propulsaoName && propulsaoName !== ''){
    //   if(propulsaoName !== propulsao.name){
    //     this.showErrorSwal(propulsao.name)
    //     return
    //   }
    // }

    // const modalRef = this.modalService.open(SettingPropulsaoModalComponent,{
    //   backdrop: 'static', 
    //   size: "lg"
    // });

    // modalRef.componentInstance.data =  {propulsao} ;
    // modalRef.result.then(
    //   (result) => {
    //     if(result === 'new-propulsao'){
    //     this.getInitialPropulsaos()      }
    //   },
    // );
  }

  newPropulsao(){
    const dialogRef = this.dialog.open(NewPropulsaoModalComponent,{
      maxWidth: (this.phone) ? "97vw": '800px',
      maxHeight: (this.phone) ? "90vh": '90vh',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
  
        if(result === 'new-propulsao'){
              this.getInitialPropulsaos()   
           }
      } 
    });
  }

  showErrorSwal( propulsaoName : string) {
    Swal.fire({
      title: `Primeiro, você deve concluir a configuração da propulsão  ${propulsaoName} ou cancelá-la.`,
      text: 'Se você excluí-la, perderá todo o progresso na configuração da propulsão',
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, excluí-la!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.resetPropulsaoConfig();
          Swal.fire({
            title: "Eliminada!",
            text: "A configuração da propulsão foi eliminada",
            icon: "success"
          });
        }else{
          this.isLoading = false;
        }
    });
}

resetPropulsaoConfig(){
  sessionStorage.removeItem('propulsaoName');
  sessionStorage.removeItem('diocesesPropulsao');
  sessionStorage.removeItem('resultsPropulsao');
  sessionStorage.removeItem('adminsPropulsao');
  sessionStorage.removeItem('countryPropulsao');
  sessionStorage.removeItem('fontsPropulsao');

  this.store.dispatch(authActions.unSetDiocesesPropulsao());
  this.store.dispatch(authActions.unSetResultsPropulsao());
  this.store.dispatch(authActions.unSetAdminsPropulsao());
  this.store.dispatch(authActions.unSetCountryPropulsao());
  this.store.dispatch(authActions.unSetFontsPropulsao());
}

  editPropulsao( propulsao:any ){
    const dialogRef = this.dialog.open(EditPropulsaoModalComponent,{
      maxWidth: (this.phone) ? "97vw": '800px',
      maxHeight: (this.phone) ? "90vh": '90vh',
      data: {propulsao}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if(result === 'edit-propulsao'){
          this.getInitialPropulsaos() 
        }
      } 
    });
}

getInitialPropulsaos(){
  this.propulsaoService.getAllPropulsaos().subscribe(
      ( {success, propulsaos} )=>{
        if(success){
          this.propulsaos = propulsaos;
          if(propulsaos && propulsaos.length > 0){
            this.dataSource.data = propulsaos;
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'name': return item.name;
                case 'currency': return item.currency_name;
                case 'description': return item.description;
                default: return '';
              }
            };
          }
   
          setTimeout(()=>{ this.isLoading = false }, 700)
        }
      })
}

onRemove( propulsao:any ){

  this.openDeleteModal('delPropulsao');

  this.unsubscribe$ =this.propulsaoService.authDelPropulsao$.pipe(take(1)).subscribe(
    (auth)=>{
      if(auth){
        this.isLoading = true;
        this.propulsaoService.deletePropulsaoById( propulsao.idpropulsao ).subscribe(
          ( {success} )=>{
            setTimeout(()=>{ this.isLoading = false },700) 
            if(success){
              this.getInitialPropulsaos();
              this.successToast("Propulsão eliminado com sucesso.");
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

openDeleteModal( action:string ){
  this.dialog.open(DeleteModalComponent,{
    maxWidth: (this.phone) ? "98vw": '',
    panelClass: "custom-modal-picture",    
    data: { component: "propulsaos", action }
    });
}

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  const savedPageSize = localStorage.getItem('propulsaoPageSize');
  if (savedPageSize) {
    this.paginator.pageSize = +savedPageSize;
  }
  this.paginator.page.subscribe((event) => {
    localStorage.setItem('propulsaoPageSize', event.pageSize.toString());
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

