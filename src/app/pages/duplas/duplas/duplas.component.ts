import { CommonModule } from '@angular/common';
import {  Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { ErrorService } from 'src/app/services/error.service';
import { UserService } from 'src/app/services/user.service';
import { getDataSS } from 'src/app/shared/storage';
import { DuplaImgPipe } from "../../../pipe/dupla-img.pipe";
import { RouterModule } from '@angular/router';
import { delay } from 'rxjs';


@Component({
    selector: 'app-duplas',
    standalone: true,
    templateUrl: './duplas.component.html',
    styleUrl: './duplas.component.scss',
    imports: [CommonModule, MatSortModule, MaterialModule, DuplaImgPipe, RouterModule]
})
export class DuplasComponent  {

  displayedColumns: string[] = ['img1','img2','propulsao'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  duplas : any[]=[];
  isLoading : boolean = false;

  phone : boolean = false;
  loggedUser : any;

  constructor(
              private errorService : ErrorService,
              private userService : UserService
    
              ) 

  {

    (screen.width <= 800) ? this.phone = true : this.phone = false;

    const user = getDataSS('user');
    if(user){
      this.loggedUser = user;
    }
  
   }

  ngOnInit(): void {

    this.getInitialDuplas();
    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));
    this.dataSource = new MatTableDataSource();
    
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  
    const savedPageSize = localStorage.getItem('duplaPageSize');
    if (savedPageSize) {
      this.paginator.pageSize = +savedPageSize;
    }
  
    this.paginator.page.subscribe((event) => {
      localStorage.setItem('duplaPageSize', event.pageSize.toString());
    });
  }


getInitialDuplas(){

  this.isLoading = true;

  this.userService.getAllDuplas().subscribe(
      ( {success, duplas} )=>{
        if(success){

          if(duplas && duplas.length > 0){
            this.dataSource.data = duplas;
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'img1': return item.Nome_Completo_1;
                case 'img2': return item.Nome_Completo_2;
                case 'propulsao': return item.propulsao_name;
               
                default: return '';
              }
            };
          }
          setTimeout(()=>{ this.isLoading = false }, 700)
        }
      })
}


}
