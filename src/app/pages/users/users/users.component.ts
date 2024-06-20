import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { delay } from 'rxjs';
import { User } from 'src/app/shared/models/user.models';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { ErrorService } from 'src/app/services/error.service';
import { getDataSS } from 'src/app/storage';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ImagenPathPipe } from "../../../pipe/imagen-path.pipe";
import { RolePipe } from "../../../pipe/role.pipe";
import { RouterModule } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { NewUserModalComponent } from '../../modals/new-user-modal/new-user-modal/new-user-modal.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
    selector: 'app-users',
    standalone: true,
    imports: [CommonModule, MatSortModule, MaterialModule, RouterModule, ImagenPathPipe, RolePipe, ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss',
})

export class UsersComponent implements OnInit, AfterViewInit  {

  displayedColumns: string[] = ['img','fullName','email','propulsao','role','ativo'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  users : User[]=[];
  isLoading : boolean = false;
  phone : boolean = false;
  loggedUser : any;
 

  constructor(
              private userService : UserService,
              private errorService : ErrorService,
              private toastr: ToastrService,
              private dialog : MatDialog
  ) { 

    this.dataSource = new MatTableDataSource();
    (screen.width < 800) ? this.phone = true : this.phone = false;
  }


  ngOnInit(): void {

    this.initialUsers();
    this.errorService.closeIsLoading$.pipe(delay(700)).subscribe(emitted => emitted && (this.isLoading = false));

    const user = getDataSS('user');
    if(user){
      this.loggedUser = user;
    }
  }

  initialUsers(){
    this.isLoading = true;
    this.userService.getAllUsers().subscribe(
      ( {success, users} )=>{
          if(success){
            if(users && users.length > 0){
              this.dataSource.data = users;
              this.dataSource.sortingDataAccessor = (item, property) => {
                switch (property) {
                  case 'fullName': return item.Nome_Completo;
                  case 'email': return item.Email;
                  case 'propulsao': return item.propulsao_name;
                  case 'role': return item.role;
                  case 'ativo': return item.active;
                  default: return '';
                }
              };
            }
            setTimeout(()=>{ this.isLoading = false }, 1000)
          }
      })

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  
    const savedPageSize = localStorage.getItem('userPageSize');
    if (savedPageSize) {
      this.paginator.pageSize = +savedPageSize;
    }
  
    this.paginator.page.subscribe((event) => {
      localStorage.setItem('userPageSize', event.pageSize.toString());
    });
  }
  
  openModalNewUser(){

    const dialogRef = this.dialog.open(NewUserModalComponent,{
      maxWidth: (this.phone) ? "97vw": '800px',
      maxHeight: (this.phone) ? "90vh": '90vh',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
  
        if(result === 'new-user'){
                this.initialUsers();
              }
      } else {
        console.log('El modal se cerró sin devolver datos');
      }
    });
  }


}



