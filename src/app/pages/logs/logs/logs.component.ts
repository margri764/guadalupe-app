import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})
export class LogsComponent {

  displayedColumns: string[] = ['date', 'city','country', 'ip'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  @Input () user:any;
  arrLogs : any []=[];
  phone : boolean = false;


 constructor( private authService : AuthService)

 { 

  (screen.width <= 800) ? this.phone = true : this.phone = false;
  this.dataSource = new MatTableDataSource();
 }

  ngOnInit(): void {

    this.getUserLogs();
  }

  getUserLogs(){

console.log(this.user.iduser);
    this.authService.getUserLogs( this.user.iduser ).subscribe(
      ( {success, logs} )=>{
        if(success){
            this.arrLogs = logs;
          if(logs && logs.length > 0){
            this.dataSource.data = logs;
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'date': return item.date;
                case 'city': return item.city;
                case 'country': return item.country;
                case 'ip': return item.ip;
                default: return '';
              }
            };
          }
        
        }
      })
  }

  
ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  const savedPageSize = localStorage.getItem('logPageSize');
  if (savedPageSize) {
    this.paginator.pageSize = +savedPageSize;
  }
  this.paginator.page.subscribe((event) => {
    localStorage.setItem('logPageSize', event.pageSize.toString());
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

