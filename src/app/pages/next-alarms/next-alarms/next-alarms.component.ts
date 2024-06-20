import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, delay } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewGroupusersModalComponent } from '../../modals/view-groupusers-modal/view-groupusers-modal/view-groupusers-modal.component';
import { AlarmGroupService } from 'src/app/services/alarm-group.service';
import { ErrorService } from 'src/app/services/error.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SevenDaysAlarmsComponent } from "../../new-alarms/seven-days-alarms/seven-days-alarms/seven-days-alarms.component";
import { getDataLS } from 'src/app/storage';
import { FifteenDaysAlarmsComponent } from "../../new-alarms/fifteen-days-alarms/fifteen-days-alarms/fifteen-days-alarms.component";
import { ThirtyDaysAlarmsComponent } from "../../new-alarms/thirty-days-alarms/thirty-days-alarms/thirty-days-alarms.component";


@Component({
    selector: 'app-next-alarms',
    standalone: true,
    templateUrl: './next-alarms.component.html',
    styleUrl: './next-alarms.component.scss',
    imports: [CommonModule, MaterialModule, RouterModule, MatSortModule, SevenDaysAlarmsComponent, FifteenDaysAlarmsComponent, ThirtyDaysAlarmsComponent]
})

export class NextAlarmsComponent implements AfterViewInit{

  displayedColumns: string[] = ['name','userAlarm','group','users','data'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isLoading : boolean = false;
  phone : boolean = false;
  arrAlarms : any []=[];
  todayAlarms : any []=[];
  sevenDaysBeforeAlarms : any []=[];
  fifteenDaysBeforeAlarms : any []=[];
  thirtyDaysBeforeAlarms : any []=[];

  constructor(
                private alarmGroupService : AlarmGroupService,
                private errorService : ErrorService,
                private dialog : MatDialog ,
             ) 
   {

    (screen.width < 800) ? this.phone = true : this.phone = false;
    this.dataSource = new MatTableDataSource();

   }

  ngOnInit(): void {

  this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));
  this.getInitData();
  }


  getInitData(){
    this.alarmGroupService.getUpcomingAlarms().subscribe(
      ( {success, todayAlarms,sevenDaysBeforeAlarms, fifteenDaysBeforeAlarms, thirtyDaysBeforeAlarms} )=>{
        if(success){
          this.todayAlarms = todayAlarms;
          this.sevenDaysBeforeAlarms = sevenDaysBeforeAlarms;
          this.fifteenDaysBeforeAlarms = fifteenDaysBeforeAlarms;
          this.thirtyDaysBeforeAlarms = thirtyDaysBeforeAlarms;

          if(todayAlarms && todayAlarms.length > 0){
            this.dataSource.data = todayAlarms;
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'name': return item.name;
                case 'userAlarm': return item.userAlarm;
                case 'group': return item.grupos.length > 0 ? item.grupos[0].name : '';
                case 'users': return item.idUsersNotifications;
                case 'data': return item.data;
                default: return '';
            };
          }
        setTimeout(()=>{ this.isLoading = false }, 700)
      }
  
        }
      })
  }

  getUsersGroup( group:any, index:number ){

    const groupID = group.grupos[index].idgroup;

    this.dialog.open(ViewGroupusersModalComponent,{
      maxWidth: (this.phone) ? "97vw": '800px',
      maxHeight: (this.phone) ? "90vh": '90vh',
      data: {groupID}
  });
  
  }

  
ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;

  const savedPageSize = getDataLS('nextAlarmPageSize');
  console.log(savedPageSize);
  if (savedPageSize) {
    this.paginator.pageSize = +savedPageSize;
  }
  this.paginator.page.subscribe((event) => {
    localStorage.setItem('nextAlarmPageSize', event.pageSize.toString());
  });
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
  console.log(filterValue);
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

  

}

