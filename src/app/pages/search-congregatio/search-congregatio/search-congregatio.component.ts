import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, debounceTime } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { CongregatioService } from 'src/app/services/congregatio.service';

@Component({
  selector: 'app-search-congregatio',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './search-congregatio.component.html',
  styleUrl: './search-congregatio.component.scss'
})
export class SearchCongregatioComponent {


// start search
@Output() onDebounce: EventEmitter<string> = new EventEmitter();
@Output() onEnter   : EventEmitter<string> = new EventEmitter();

debouncer: Subject<string> = new Subject();

// start search
itemSearch : string = '';
mostrarSugerencias: boolean = false;
sugested : string= "";
suggested : any[] = [];
spinner : boolean = false;
fade : boolean = false;
search : boolean = true;
product  : any[] = [];
clients : any []=[];
arrClient : any []=[];
clientFound : any = null;
isClientFound : boolean = false;
labelNoFound : boolean = false;
phone : boolean = false;
// end search

myFormSearch! : FormGroup;
loadindCongregatio : boolean = false;


  constructor(
              private fb : FormBuilder,
              private congregatioService : CongregatioService,
              private dialogRef : MatDialogRef<SearchCongregatioComponent>

  ) { 

    (screen.width < 800) ? this.phone = true : this.phone = false;

    this.myFormSearch = this.fb.group({
      itemSearch:  [ '',  ],
    });   
    
  }

  ngOnInit(): void {

    this.myFormSearch.get('itemSearch')?.valueChanges.subscribe(newValue => {
      this.itemSearch = newValue;

      if(this.itemSearch !== ''){
         this.teclaPresionada();
      }else{
        this.suggested = [];
        this.spinner= false;
      }
    });

    this.debouncer
    .pipe(debounceTime(700))
    .subscribe( valor => {

      this.sugerencias(valor);
    });
  }

  selectUser(user: any){
      this.dialogRef.close(user);      
  
  }
  

  // search

close(){
  this.mostrarSugerencias = false;
  this.itemSearch = '';
  this.suggested = [];
  this.spinner= false;
  // this.noMatches = false;
  this.clientFound= null;
  this.isClientFound = false;
}

teclaPresionada(){
// this.noMatches = false;
this.debouncer.next( this.itemSearch );  
};

sugerencias(value : string){

  if(value ){
    if(value.length < 3){
      return;
    }
  }else{
    return;
  }
  
  this.itemSearch = value;
  this.labelNoFound = false;
  this.mostrarSugerencias = true;  
  this.loadindCongregatio = true;
  this.congregatioService.searchUserCongregatio(value).subscribe ( 
    ( {users} )=>{
      if(users.length === 0){
          this.myFormSearch.get('itemSearch')?.setValue('');
          this.labelNoFound = true;
          this.loadindCongregatio = false;
          setTimeout(()=>{ this.labelNoFound = false}, 1500)
      }else{
          setTimeout(()=>{ 
              this.loadindCongregatio = false; 
              this.suggested = users;
            }, 1000)
      }
    }
  )
}

Search( item: any ){
  setTimeout(()=>{
    this.mostrarSugerencias = true;
    this.spinner = false;
    this.fade = false;
    this.clientFound = item;
    this.isClientFound = true;
    this.myFormSearch.get('itemSearch')?.setValue('');
    this.suggested = [];
    // this.noMatches = false;
  },500)
}
// search

  closeModal(){

    this.dialogRef.close('exito');

  }

}

