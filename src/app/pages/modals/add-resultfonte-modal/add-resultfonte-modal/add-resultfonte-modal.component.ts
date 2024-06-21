import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { ResultFuenteService } from 'src/app/services/result-fuente.service';

@Component({
  selector: 'app-add-resultfonte-modal',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './add-resultfonte-modal.component.html',
  styleUrl: './add-resultfonte-modal.component.scss'
})
export class AddResultfonteModalComponent {

  displayedColumns: string[] = ['acronym','description'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Output() onCloseModal: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild ("result" , {static: true} ) result! : ElementRef;

  propulsaoName : any;
  results : any[]=[];
  isLoading : boolean = false;
  showSuccess : boolean = false;
  showSuccessCreateGroup : boolean = false;
  msg : string = '';

  private unsubscribe$: Subscription;
  phone : boolean = false;
  show : boolean = false;
  setResults : boolean = false;
  arrayResults: any [] = [];
  fonte : any;
  backClose : boolean = false;

  

  constructor(
              private resultFuenteService : ResultFuenteService,
              private toastr: ToastrService,
              private dialogRef : MatDialogRef<AddResultfonteModalComponent>,
              @Inject (MAT_DIALOG_DATA) public data : any,

  ) { 

    (screen.width <= 800) ? this.phone = true : this.phone = false;
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {


    this.getInitialResults();

    console.log(this.data);
    this.fonte = this.data.fonte;
  }


  getInitialResults(){

    this.resultFuenteService.getAllResults().subscribe(
        ( {success, results} )=>{
          if(success){
              this.results = results;
            if(results && results.length > 0){
              this.dataSource.data = results;
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

  onSave(){
      let body: any[] = []; 
      this.arrayResults.forEach((item)=>{body.push(item.idresult)})
      const resultIds = {
        resultIds: body
      }
      this.isLoading = true;

      this.resultFuenteService.addResultToFonte( this.fonte.idfonte, resultIds).subscribe( 
        ( {success} )=>{
          if(success){
            this.successToast("Resultado agregado com sucesso.");
            setTimeout(()=>{ 
              this.dialogRef.close();
              this.isLoading = false;
            }, 700)
            
          }
  
        })
  }

  assignResult(result: any ) {
   console.log(result);

    const isResultAlreadyAdded = this.isResultSelected(result);
  
    if (isResultAlreadyAdded) {
      // Si la diócesis ya está seleccionada, quítala del array
      this.arrayResults = this.arrayResults.filter(existingResult => existingResult.idresult !== result.idresult);
    } else {
      // Si la diócesis no está seleccionada, agrégala al array
      this.arrayResults.push(result);
      this.goToAddedResult();
    }
  
    // this.store.dispatch(authActions.addResultsToPropulsao({ results: [...this.arrayResults] }));


  }
  
  isResultSelected(result: any): boolean {
    return this.arrayResults.some(existingresult => existingresult.idresult === result.idresult);
  }

  removeResult( result: any ){
    const index = this.arrayResults.indexOf(result);
    if (index >= 0) {
      this.arrayResults.splice(index, 1);
    }
  }

  selectAllResults(){
    this.setResults = true;
    this.arrayResults = [];
    this.arrayResults = this.results;
    this.goToAddedResult();
  }

  deSelectAllResults(){
    this.setResults = false;
    this.arrayResults = [];
  }

  successToast( msg:string){
    this.toastr.success(msg, 'Sucesso!!', {
      positionClass: 'toast-bottom-right', 
      timeOut: 2000, 
      messageClass: 'message-toast',
      titleClass: 'title-toast'
    });
  }

  goToAddedResult(){

    setTimeout( () => {

      this.result.nativeElement.scrollIntoView(
      { 
        alignToTop: true,
        behavior: "smooth",
        block: "center",
      });
     }
    )
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    const savedPageSize = localStorage.getItem('addResultFontePageSize');
    if (savedPageSize) {
      this.paginator.pageSize = +savedPageSize;
    }
    this.paginator.page.subscribe((event) => {
      localStorage.setItem('addResultFontePageSize', event.pageSize.toString());
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
    setTimeout( ()=>{ this.dialogRef.close() }, 400 )
  }

  

  ngOnDestroy(): void {
    if(this.unsubscribe$){
      this.unsubscribe$.unsubscribe();
    }
  }
  

  

}

