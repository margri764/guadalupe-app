import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Subject, Subscription, map } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { DrawersService } from 'src/app/services/drawers.service';
import { ResultFuenteService } from 'src/app/services/result-fuente.service';
import { AppState } from 'src/app/shared/redux/app.reducer';
import * as authActions from 'src/app/shared/redux/auth.actions';


@Component({
  selector: 'app-assign-fonte-drawer',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './assign-fonte-drawer.component.html',
  styleUrl: './assign-fonte-drawer.component.scss'
})
export class AssignFonteDrawerComponent {

  
  displayedColumns: string[] = ['acronym', 'description'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  propulsaoName : any;
  fonts : any[]=[];
  isLoading : boolean = false;
  showSuccess : boolean = false;
  showSuccessCreateGroup : boolean = false;
  msg : string = '';
  private unsubscribe$: Subscription;
  phone : boolean = false;
  show : boolean = false;
  setFonts : boolean = false;
  arrayFonts: any [] = [];
  backClose : boolean = false;

  constructor(
              private store : Store<AppState>,
              private resultFuenteService : ResultFuenteService,
              @Inject (MAT_DIALOG_DATA) public data :any,
              private drawerService : DrawersService


  ) { 
    (screen.width <= 800) ? this.phone = true : this.phone = false;
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {


    this.propulsaoName = this.data;
    this.getInitialFonts();

    this.store.select('auth')
    .pipe(
      map(({ fonts }) => (fonts && fonts.length > 0) ? [...fonts] : [])
    ).subscribe(
      ( data:any )=>{
        if(data && data.length === 0){
          sessionStorage.removeItem('fontsPropulsao');
        }else{
          this.arrayFonts = data;
           // si vengo de un reload pierdo el estado del setFonts para mostrar el boton de "seleccionar" o "deseleccionar"
          this.setFonts = true;
        }
      })
  }



  getInitialFonts(){

    this.resultFuenteService.getAllFuentes().subscribe(
        ( {success, fontes} )=>{
          if(success){
            this.fonts = fontes;
            if(fontes && fontes.length > 0){
              this.dataSource.data = fontes;
              this.dataSource.sortingDataAccessor = (item, property) => {
                switch (property) {
                  case 'acronym': return item.acronym;
                  case 'description': return item.description;
                  default: return '';
                }
              };
            }

           
            setTimeout(()=>{ this.isLoading = false }, 700)
          }
        })
    }

  assignFont(font: any ) {

    const isFontAlreadyAdded = this.isFontSelected(font);
  
    if (isFontAlreadyAdded) {
      // Si la diócesis ya está seleccionada, quítala del array
      this.arrayFonts = this.arrayFonts.filter(existingFont => existingFont.idfonte !== font.idfonte);
    } else {
      // Si la diócesis no está seleccionada, agrégala al array
      this.arrayFonts.push(font);
    }
  
    this.store.dispatch(authActions.addFontsToPropulsao({ fonts: [...this.arrayFonts] }));


  }
  
  isFontSelected(font: any): boolean {
    return this.arrayFonts.some(existingfont => existingfont.idfonte === font.idfonte);
  }

  selectAllFonts(){
    this.setFonts = true;
    this.arrayFonts = [];
    this.arrayFonts = this.fonts;
    this.store.dispatch(authActions.unSetFontsPropulsao());
    this.store.dispatch(authActions.addFontsToPropulsao({ fonts: [...this.arrayFonts] }));

  }

  deselectAllFonts(){
    this.setFonts = false;
    this.arrayFonts = [];
    this.store.dispatch(authActions.unSetFontsPropulsao());
  }


  ngOnDestroy(): void {
    if(this.unsubscribe$){
      this.unsubscribe$.unsubscribe();
    }
  }

  resetDrawer(){
    this.setFonts = false;
    this.arrayFonts = [];
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    const savedPageSize = localStorage.getItem('assignFontePageSize');
    if (savedPageSize) {
      this.paginator.pageSize = +savedPageSize;
    }
    this.paginator.page.subscribe((event) => {
      localStorage.setItem('assignFontePageSize', event.pageSize.toString());
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
    this.drawerService.closeDrawerFonte();
  }
  
  

}
