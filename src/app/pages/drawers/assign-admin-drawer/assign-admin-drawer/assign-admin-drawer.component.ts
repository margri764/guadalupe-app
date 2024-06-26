import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Subject, delay, map } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { DrawersService } from 'src/app/services/drawers.service';
import { ErrorService } from 'src/app/services/error.service';
import { PropulsaoService } from 'src/app/services/propulsao.service';
import { AppState } from 'src/app/shared/redux/app.reducer';
import * as authActions from 'src/app/shared/redux/auth.actions';
import { ImagenPathPipe } from "../../../../pipe/imagen-path.pipe";


@Component({
    selector: 'app-assign-admin-drawer',
    standalone: true,
    templateUrl: './assign-admin-drawer.component.html',
    styleUrl: './assign-admin-drawer.component.scss',
    imports: [CommonModule, MaterialModule, ImagenPathPipe]
})
export class AssignAdminDrawerComponent {

  displayedColumns: string[] = ['img','name', 'role', 'propulsao'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isLoading : boolean = false;
  admins : any []=[];
  propulsaoName : any;
  setResults : boolean = false;
  arrAdmins : any []=[];
  setAdmins : boolean = false;
  backClose : boolean = false;
  phone : boolean = false;


  
    constructor(
                private errorService : ErrorService,
                private propulsaoService : PropulsaoService,
                private store : Store<AppState>,
                 private drawerService : DrawersService,
                @Inject (MAT_DIALOG_DATA) public data:any
    ) { 
      (screen.width <= 800) ? this.phone = true : this.phone = false;
      this.dataSource = new MatTableDataSource();
    }
  
    ngOnInit(): void {
  
    this.errorService.closeIsLoading$.pipe(delay(700)).subscribe( (emitted) => {if(emitted){this.isLoading = false;}});

    console.log(this.data);
    this.propulsaoName = this.data;

    this.store.select('auth')
    .pipe(
      map(({ admins }) => (admins && admins.length > 0) ? [...admins] : [])
    ).subscribe(
      ( data:any )=>{
        if(data && data.length === 0){
          sessionStorage.removeItem('adminsPropulsao');
        }else{
          this.arrAdmins = data;
          this.setAdmins = true;
        }
      })
  
    this.getInitialData();
  
    }
  
    getInitialData(){
      this.isLoading = true;
  
      this.propulsaoService.getPropulsaoAdmins().subscribe( 
        ( {success, admins} )=>{
          setTimeout(()=>{this.isLoading = false },700)
          if(success){
              this.admins = admins;
            if(admins && admins.length > 0){
              this.dataSource.data = admins;
              this.dataSource.sortingDataAccessor = (item, property) => {
                switch (property) {
                  case 'name': return item.name;
                  case 'role': return item.role;
                  case 'propulsao': return item.propulsao_name;
                  default: return '';
                }
              };
            }
           
     } })
      
  
    }


    assignAdmin(admin: any ) {

      const isadminAlreadyAdded = this.isAdminSelected(admin);
    
      if (isadminAlreadyAdded) {
        console.log(this.arrAdmins);
        // Si la diócesis ya está seleccionada, quítala del array
        this.arrAdmins = this.arrAdmins.filter(existingAdmin => existingAdmin.iduser !== admin.iduser);
      } else {
        // Si la diócesis no está seleccionada, agrégala al array
        this.arrAdmins.push(admin);
      }
    
      this.store.dispatch(authActions.addAdminsToPropulsao({ admins: [...this.arrAdmins] }));
  
  
    }
    
    isAdminSelected(admin: any): boolean {
      return this.arrAdmins.some(existingAdmin => existingAdmin.iduser === admin.iduser);
    }
  
    selectAllAdmins(){
      this.setAdmins = true;
      this.arrAdmins = [];
      this.arrAdmins = this.admins;
      this.store.dispatch(authActions.unSetAdminsPropulsao());
      this.store.dispatch(authActions.addAdminsToPropulsao({ admins: [...this.arrAdmins] }));
  
    }
  
    deselectAllAdmins(){
      this.setAdmins = false;
      this.arrAdmins = [];
      this.store.dispatch(authActions.unSetAdminsPropulsao());
    }

    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      const savedPageSize = localStorage.getItem('assignAdminPageSize');
      if (savedPageSize) {
        this.paginator.pageSize = +savedPageSize;
      }
      this.paginator.page.subscribe((event) => {
        localStorage.setItem('assignAdminPageSize', event.pageSize.toString());
      });
    }
    
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  
    closeModal(){
      this.backClose = true;
      this.drawerService.closeDrawerAdmin();
    }

  
  }
