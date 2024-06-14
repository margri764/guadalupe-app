import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subject, Subscription, delay, take } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { getDataSS } from 'src/app/shared/storage';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { AlarmGroupService } from 'src/app/services/alarm-group.service';
import { ErrorService } from 'src/app/services/error.service';
import { User } from 'src/app/shared/models/user.models';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DeleteModalComponent } from '../../modals/delete-modal/delete-modal/delete-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { EditGroupModalComponent } from '../../modals/edit-group-modal/edit-group-modal/edit-group-modal.component';
import { EditGrupalalarmModalComponent } from '../../modals/edit-grupalalarm-modal/edit-grupalalarm-modal/edit-grupalalarm-modal.component';


@Component({
  selector: 'app-alarms',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './alarms.component.html',
  styleUrl: './alarms.component.scss'
})
export class AlarmsComponent {

  displayedColumns: string[] = ['name','alarmUser','group','user','data','action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  @ViewChild('excluir') excluir! : ElementRef;
  @ViewChild('closebutton') closebutton! : ElementRef;
  @ViewChild('closebuttonEdit') closebuttonEdit! : ElementRef;
  @ViewChild('closebuttonEditGrupal') closebuttonEditGrupal! : ElementRef;
  @ViewChild('closeModalFicha') closeModalFicha! : ElementRef;
  @Input() userViewModal: any;

  // start search
  @Output() onDebounce: EventEmitter<string> = new EventEmitter();
  @Output() onEnter   : EventEmitter<string> = new EventEmitter();
  debouncer: Subject<string> = new Subject();
  
  authDelAlarmSubscription: Subscription;


  // start search
  itemSearch : string = '';
  mostrarSugerencias: boolean = false;
  showSuggested : boolean = false;
  suggested : any[] = [];
  spinner : boolean = false;
  fade : boolean = false;
  search : boolean = true;
  product  : any[] = [];
  clients : any []=[];
  arrClient : any []=[];
  clientFound : any = null;
  isClientFound : boolean = false;
  labelNoFinded : boolean = false;
  phone : boolean = false;
  // end search

   user : any | null;
   exclude : boolean = false;
   frequencySelected : any []=[];
   nameFreq : any []=[];
   personalAlarms : any []=[];
   arrAlarms : any []=[];
   isLoading : boolean = false;
   showSuccess : boolean = false;
   show : boolean = false;
   msg : string = '';
   loggedUser:any;


  constructor(
              private alarmGroupService : AlarmGroupService,
              private errorService : ErrorService,
              private toastr: ToastrService,
              private dialog : MatDialog

  ) {

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

  this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));

  this.getAllAlarms();
}

getAllAlarms(){

  this.alarmGroupService.getAllAlarms().subscribe(
    ( {success, alarms} )=>{
      if(success){
        if(alarms && alarms.length > 0){
          this.dataSource.data = alarms;
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'name': return item.name;
              case 'alarmUser': return item.userAlarm.name;
              case 'group': return item.name;
              case 'user': return item.userNotif.Nome_Completo;
              case 'data': return item.alarmDate;
              case 'propulsoes': return item.propulsao_name;
              case 'action': return item.active;
              default: return '';
            }
          };
      setTimeout(()=>{ this.isLoading = false }, 700)
    }

        // if(alarms){
        //   this.arrAlarms = alarms.sort((a:any, b:any) => {
        //     return new Date(b.alarmDate).getTime() - new Date(a.alarmDate).getTime();
        //   });
        // }

        
      }
    })
}

onRemove( alarm:any ){

  if(alarm.propulsao_name  && alarm.propulsao_name !== 'webmaster'  ){
    this.showPropulsaoSwal();
    return;
  }

  console.log(alarm);
  let id = alarm.idalarm;

  this.openDeleteModal('delAlarm');
  
  this.authDelAlarmSubscription = this.alarmGroupService.authDelAlarm$.pipe(take(1)).subscribe(
    (auth)=>{
      if(auth){
        this.alarmGroupService.deleteAlarm( id ).subscribe(
          ( {success} )=>{
            if(success){
                this.successToast("Alarma eliminada com sucesso.");
                this.getAllAlarms();
            }
          })
      }else{
        this.authDelAlarmSubscription.unsubscribe();
      }
    })

}

editAlarm(alarm: any) {

  if(alarm.propulsao_name  && alarm.propulsao_name !== 'webmaster'  ){
    this.showPropulsaoSwal();
    return;
  }

  if(alarm.notifFrequency && alarm.notifFrequency.length > 0) {

    this.nameFreq = alarm.notifFrequency.map((day: number) => {

      switch (day) {
        // case 0:
        //         this.frequencySelected.push(0);
        //   return 'No mesmo dia';
        case 7:
                this.frequencySelected.push(7);
          return '7 dias antes';
        case 15:
                this.frequencySelected.push(15);
          return '15 dias antes';
        case 30:
                this.frequencySelected.push(30);
          return '30 dias antes';
        default:
          return 'Día Desconocido';
      }
    });

  }

  const dialogRef = this.dialog.open(EditGrupalalarmModalComponent,{
    maxWidth: (this.phone) ? "97vw": '800px',
    maxHeight: (this.phone) ? "90vh": '90vh',
    data: { alarm, nameFreq: this.nameFreq }
});

dialogRef.afterClosed().subscribe(result => {
  if (result) {
    if(result === 'closed'){
      this.getAllAlarms();
    }
  } 
});



}

activePauseAlarm( alarm:any, action:string ){

  this.alarmGroupService.activePauseAlarm( alarm.idalarm, action).subscribe( 
    ( {success})=>{
          if(success){

            if(action === 'active'){
              this.successToast("Alarme ativada com successo")
            }else if(action === "paused"){
              this.warningToast("Alarme pausada com successo")
            }
            this.getAllAlarms();
          }
    } )
}

showPropulsaoSwal( ) {

  Swal.fire({
    title: "Editar através das propulsões!",
    text: `Esta alarme está atribuída a uma propulsão`,
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

closeToast(){
  this.showSuccess = false;
  this.msg = '';
}

getUsersGroup( group:any, index:number ){

  // const groupID = group.grupos[index].idgroup;
  // console.log(groupID);

  // const modalRef = this.modalService.open(ViewGroupusersModalComponent,{
  //   backdrop: 'static', 
  //   // keyboard: false,  
  //   size: "lg"
  // });

  // modalRef.componentInstance.data = { groupID }

}

closeModal(){
  this.userViewModal = {};
  this.show = false;
  this.closeModalFicha.nativeElement.click();
}

ngOnDestroy(): void {
  
  if (this.authDelAlarmSubscription) {
    this.authDelAlarmSubscription.unsubscribe();
  }
}

onKeyUp(event: KeyboardEvent): void {
  if (event.key === 'Escape' || event.key === 'Esc') {
    this.closeModal();
  }
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
    data: { component: "alarms", action }
    });
}

openModalNewAlarm(){
    // const modalRef = this.modalService.open(NewAlarmModalComponent,{
    //   backdrop: 'static', 
    //   // keyboard: false,  
    //   size: "lg"
    // });

    // modalRef.result.then((result) => { if(result === 'closed')this.getAllAlarms() },
    // ).catch((reason) => {
    // });

}

openModalFichaCompleta( user:User ){

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

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  const savedPageSize = localStorage.getItem('alarmsPageSize');
  if (savedPageSize) {
    this.paginator.pageSize = +savedPageSize;
  }
  this.paginator.page.subscribe((event) => {
    localStorage.setItem('alarmsPageSize', event.pageSize.toString());
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

