import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { AlarmGroupService } from 'src/app/services/alarm-group.service';
import { ErrorService } from 'src/app/services/error.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ViewGroupusersModalComponent } from 'src/app/pages/modals/view-groupusers-modal/view-groupusers-modal/view-groupusers-modal.component';

@Component({
  selector: 'app-fifteen-days-alarms',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule, MatSortModule],
  templateUrl: './fifteen-days-alarms.component.html',
  styleUrl: './fifteen-days-alarms.component.scss'
})
export class FifteenDaysAlarmsComponent {


  @Input() data: any[] = [];

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
                private dialog : MatDialog
             ) 
   {

    (screen.width < 800) ? this.phone = true : this.phone = false;

    this.dataSource = new MatTableDataSource();
   }

   ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.getInitData();
    }
  }


  getInitData(){
          if(this.data && this.data.length > 0){
            this.dataSource.data = this.data;
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'name': return item.name;
                case 'userAlarm': return item.userAlarm.name;
                case 'group': return item.grupos.length > 0 ? item.grupos[0].name : '';;
                case 'users': return item.idUsersNotifications;
                case 'data': return item.data;
                default: return '';
            }}
          }
  }    
  

  getUsersGroup( group:any, index:number ){

    const groupID = group.grupos[index].idgroup;
    console.log(groupID);

    this.dialog.open(ViewGroupusersModalComponent,{
      maxWidth: (this.phone) ? "97vw": '800px',
      maxHeight: (this.phone) ? "90vh": '90vh',
      data: {groupID}
  });
  
  }

  
ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;

  const savedPageSize = localStorage.getItem('next7AlarmPageSize');
  if (savedPageSize) {
    this.paginator.pageSize = +savedPageSize;
  }
  this.paginator.page.subscribe((event) => {
    localStorage.setItem('next7AlarmPageSize', event.pageSize.toString());
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

