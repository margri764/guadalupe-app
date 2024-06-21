import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject, debounceTime, delay } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { CongregatioService } from 'src/app/services/congregatio.service';
import { ErrorService } from 'src/app/services/error.service';
import { User } from 'src/app/shared/models/user.models';
import { ViewCongregatioModalComponent } from '../../modals/view-congregatio-modal/view-congregatio-modal/view-congregatio-modal.component';


@Component({
  selector: 'app-congregatio',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './congregatio.component.html',
  styleUrl: './congregatio.component.scss'
})
export class CongregatioComponent {
 // start search
 @Output() onDebounce: EventEmitter<string> = new EventEmitter();
 @Output() onEnter   : EventEmitter<string> = new EventEmitter();
 debouncer: Subject<string> = new Subject();
 @ViewChild('closebutton') closebutton! : ElementRef;

 myFormSearch!: FormGroup;
 success:any;

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

 isLoading : boolean = false;

 congregatio : any []=[];
 user! : User;
 show : boolean = false;
 userCongregatio : any;



 constructor(
             private fb : FormBuilder,
             private errorService : ErrorService,
             private congregatioService : CongregatioService,
             private dialog : MatDialog

 ) { 

  (screen.width <= 800) ? this.phone = true : this.phone = false;


   this.myFormSearch = this.fb.group({
     itemSearch:  [ '',  ],
   });   
 }

 ngOnInit(): void {

   this.errorService.closeIsLoading$.pipe(delay(100)).subscribe(emitted => emitted && (this.isLoading = false));


   this.myFormSearch.get('itemSearch')?.valueChanges.subscribe(newValue => {
     this.itemSearch = newValue;

     if(this.itemSearch !== ''){
        this.teclaPresionada();
     }else{
       this.congregatio = [];
       this.spinner= false;
     }
   });

   this.debouncer
   .pipe(debounceTime(1000))
   .subscribe( valor => {

     this.sugerencias(valor);
   });
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
   
   this.spinner = true;
   this.itemSearch = value;
   this.mostrarSugerencias = true;  
   this.isLoading = true;
   this.labelNoFound = false;
   this.congregatioService.searchUserCongregatio(value)
   .subscribe ( ( {users} )=>{
     if(users.length === 0){
         this.spinner = false;
         this.myFormSearch.get('itemSearch')?.setValue('');
         this.labelNoFound = true;
         this.isLoading = false;
         setTimeout(()=>{ this.labelNoFound = false; this.isLoading = false;  }, 1500)
     }else{
       this.isLoading = false;
       this.congregatio = users;
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


 selectUserCongregatio( user:any ){
    let userFichaCompleta: any;
    let origin: any;
  
    userFichaCompleta = user;
    origin = 'congregatio';

    setTimeout(()=>{
      this.dialog.open(ViewCongregatioModalComponent,{
        maxWidth: (this.phone) ? "98vw": '',
        panelClass: "custom-modal-picture",    
        data: { user: userFichaCompleta, origin  }
        });

    },300)

  }



 closeModalFichaCompleta(){
   this.show = false;
   this.userCongregatio = null;
  //  this.closebutton.nativeElement.click();
 }


}
