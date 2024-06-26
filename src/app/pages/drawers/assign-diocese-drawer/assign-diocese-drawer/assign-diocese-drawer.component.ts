import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Subscription, map } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { DiocesisCidadeService } from 'src/app/services/diocesis-cidade.service';
import { DrawersService } from 'src/app/services/drawers.service';
import { PropulsaoService } from 'src/app/services/propulsao.service';
import { AppState } from 'src/app/shared/redux/app.reducer';
import * as authActions from 'src/app/shared/redux/auth.actions';

@Component({
  selector: 'app-assign-diocese-drawer',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './assign-diocese-drawer.component.html',
  styleUrl: './assign-diocese-drawer.component.scss'
})
export class AssignDioceseDrawerComponent implements OnInit {
  
  displayedColumns: string[] = ['number', 'name'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  propulsaoName : any;
  dioceses : any[]=[];
  isLoading : boolean = false;
  showSuccess : boolean = false;
  showSuccessCreateGroup : boolean = false;
  msg : string = '';
  private unsubscribe$: Subscription;
  phone : boolean = false;
  show : boolean = false;
  setDioceses : boolean = false;
  backClose : boolean = false;
  arrayDioceses: any [] = [];


  constructor(
              private diocesisCityService : DiocesisCidadeService,
              private store : Store<AppState>,
              @Inject (MAT_DIALOG_DATA) public data :any,
              private drawerService : DrawersService


  ) 
  {
    (screen.width <= 800) ? this.phone = true : this.phone = false;
    this.dataSource = new MatTableDataSource();
   }

  ngOnInit(): void {



    console.log(this.data);
    this.propulsaoName = this.data;
    this.getInitialDioceses();

    this.store.select('auth')
    .pipe(
      // filter(({ dioceses }) => dioceses && dioceses.length > 0)
      map(({ dioceses }) => (dioceses && dioceses.length > 0) ? [...dioceses] : [])
    ).subscribe(
      ( data:any )=>{
        if(data && data.length === 0){
          sessionStorage.removeItem('diocesesPropulsao');
        }else{
          this.arrayDioceses = data;
          this.setDioceses = true;
        }
      })
  }

  getInitialDioceses(){

    this.diocesisCityService.getAllDioceses().subscribe(
        ( {success, dioceses} )=>{
          if(success){
            this.dioceses = dioceses;
            if(dioceses && dioceses.length > 0){
              this.dataSource.data = dioceses;
              this.dataSource.sortingDataAccessor = (item, property) => {
                switch (property) {
                  case 'number': return item.number;
                  case 'name': return item.name;
                  default: return '';
                }
              };
            }
            setTimeout(()=>{ this.isLoading = false }, 700)
          }
        })
  }

  assignDiocese(diocese: any ) {

    const isDioceseAlreadyAdded = this.isDioceseSelected(diocese);
  
    if (isDioceseAlreadyAdded) {
      // Si la diócesis ya está seleccionada, quítala del array
      this.arrayDioceses = this.arrayDioceses.filter(existingDiocese => existingDiocese.iddiocese !== diocese.iddiocese);
    } else {
      // Si la diócesis no está seleccionada, agrégala al array
      this.arrayDioceses.push(diocese);
    }
  
    this.store.dispatch(authActions.addDiocesesToPropulsao({ dioceses: [...this.arrayDioceses] }));


  }
  
  isDioceseSelected(diocese: any): boolean {
    return this.arrayDioceses.some(existingDiocese => existingDiocese.iddiocese === diocese.iddiocese);
  }

  selectAllDioceses(){
    this.setDioceses = true;
    this.arrayDioceses = [];
    this.arrayDioceses = this.dioceses;
    this.store.dispatch(authActions.unSetDiocesesPropulsao());
    this.store.dispatch(authActions.addDiocesesToPropulsao({ dioceses: [...this.arrayDioceses] }));

  }

  deSelectAllDioceses(){
    this.setDioceses = false;
    this.arrayDioceses = [];
    this.store.dispatch(authActions.unSetDiocesesPropulsao());
  }


  ngOnDestroy(): void {
    if(this.unsubscribe$){
      this.unsubscribe$.unsubscribe();
    }
  }

  resetDrawer(){
    this.setDioceses = false;
    this.arrayDioceses = [];
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    const savedPageSize = localStorage.getItem('assignDiocesePageSize');
    if (savedPageSize) {
      this.paginator.pageSize = +savedPageSize;
    }
    this.paginator.page.subscribe((event) => {
      localStorage.setItem('assignDiocesePageSize', event.pageSize.toString());
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
    this.drawerService.closeDrawerDiocese();
  }
  
  
  

}
