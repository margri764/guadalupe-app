import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, take, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DeleteModalComponent } from '../../modals/delete-modal/delete-modal/delete-modal.component';
import { NewAlarmModalComponent } from '../../modals/new-alarm-modal/new-alarm-modal/new-alarm-modal.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { AlarmGroupService } from 'src/app/services/alarm-group.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EditGrupalalarmModalComponent } from '../../modals/edit-grupalalarm-modal/edit-grupalalarm-modal/edit-grupalalarm-modal.component';

@Component({
  selector: 'app-personal-alarm',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './personal-alarm.component.html',
  styleUrl: './personal-alarm.component.scss'
})
export class PersonalAlarmComponent {
  
  displayedColumns: string[] = ['name','description','date','action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() user:any;
  private authDelAlarmSubscription: Subscription;
 
  personalAlarms : any []=[];
  idUser:any;
  isLoading : boolean = false;
  nameFreq : any []=[];
  frequencySelected : any []=[];
  phone : boolean = false;



  constructor( 
                private alarmGroupService : AlarmGroupService,
                private toastr: ToastrService,
                private dialog : MatDialog
             ) 
  
  { 
    (screen.width <= 800) ? this.phone = true : this.phone = false;
    this.dataSource = new MatTableDataSource();

  }

  ngOnInit(): void {
    console.log(this.user);

    this.getAlarmByUser(this.user.iduser);
  }

  getAlarmByUser( id:any){

    this.alarmGroupService.getAlarmByUser(id).subscribe(
      ( {success, alarm, message} )=>{
        if(success){

          if(alarm){
            this.personalAlarms = alarm;
          }

          if(alarm && alarm.length > 0 || message){
            this.dataSource.data = alarm;
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'name': return item.name;
                case 'description': return item.description;
                case 'date': return item.alarmDate;
                default: return '';
              }
            };
          }
        }
      })
  }

  activePausePersonalAlarm( alarm:any, action:string ){

      this.alarmGroupService.activePauseAlarm( alarm.idalarm, action).subscribe( 
        ( {success})=>{
              if(success){
                this.getAlarmByUser( this.user.iduser);
                if(action === 'active'){
                  this.successToast("Alarme ativada com successo")
                }else if(action === "paused"){
                  this.warningToast("Alarme pausada com successo")
                }
              }
        } )
  }
  
  editAlarm(alarm: any) {

    this.nameFreq = alarm.notifFrequency.map((day: number) => {
      switch (day) {
        // case 0:
        //         this.frequencySelected.push(0);
        //   return 'No mesmo dia';
        case 7:
                this.frequencySelected.push(7);
          return '7 dia antes';
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
  
    
    this.isLoading = true;

    const dialogRef = this.dialog.open(EditGrupalalarmModalComponent,{
      maxWidth: (this.phone) ? "97vw": '800px',
      maxHeight: (this.phone) ? "90vh": '90vh',
      data: { alarm, nameFreq: this.nameFreq }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if(result === 'closed'){
          this.getAlarmByUser(this.user.iduser);
        }
      } 
    });
  }
  

  onRemoveAlarm( alarm:any ){

    const id = alarm.idalarm;
    this.openDeleteModal();

    this.authDelAlarmSubscription = this.alarmGroupService.authDelPersonalAlarm$.pipe(take(1)).subscribe(
      (auth)=>{
        if(auth){
          this.isLoading = true;
          this.alarmGroupService.deleteAlarm( id ).subscribe(
            ( {success} )=>{
          
              if(success){
                setTimeout(()=>{ 
                  this.isLoading = false 
                  this.personalAlarms = this.personalAlarms.filter(a => a.idalarm !== alarm.idalarm);
                  this.successToast("Alarma eliminada com sucesso.");
                },700)
              }
            })
        }else{
          this.authDelAlarmSubscription.unsubscribe();
        }
      })
  
  }

  successToast( msg:string){
    this.toastr.success(msg, 'Sucesso!!', {
      positionClass: 'toast-bottom-right', 
      timeOut: 2000, 
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
  
  openDeleteModal(  ){
    this.dialog.open(DeleteModalComponent,{
      maxWidth: (this.phone) ? "98vw": '',
      panelClass: "custom-modal-picture",    
      data: { component: "personal-alarm" }
      });
  }

  openModalNewAlarm(){
    const dialogRef = this.dialog.open(NewAlarmModalComponent,{
      maxWidth: (this.phone) ? "97vw": '800px',
      maxHeight: (this.phone) ? "90vh": '90vh',
      data: { userAlarm: this.user }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if(result === 'closed'){
          this.getAlarmByUser(this.user.iduser);
        }
      } 
    });

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    const savedPageSize = localStorage.getItem('personalAlarmPageSize');
    if (savedPageSize) {
      this.paginator.pageSize = +savedPageSize;
    }
    this.paginator.page.subscribe((event) => {
      localStorage.setItem('personalAlarmPageSize', event.pageSize.toString());
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
    if (this.authDelAlarmSubscription) {
      this.authDelAlarmSubscription.unsubscribe();
    }
  }

  

  

}

