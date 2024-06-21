import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { DiocesisCidadeService } from 'src/app/services/diocesis-cidade.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-add-citydiocese-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './add-citydiocese-modal.component.html',
  styleUrl: './add-citydiocese-modal.component.scss'
})
export class AddCitydioceseModalComponent {

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
  selectedCities : any []=[];
  currentUserIndex: number = 0
  selectedImg : any [] = [];
  backClose : boolean = false;
  
  
    constructor(
                private fb : FormBuilder,
                private userService : UserService,
                private toastr: ToastrService,
                private diocesisCityService : DiocesisCidadeService,
                private dialogRef : MatDialogRef<AddCitydioceseModalComponent>,
                @Inject (MAT_DIALOG_DATA) public data:any

    ) { 
  
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
  
    selectCity(city: any){
  
      if (!this.selectedCities.some(selectedUser => selectedUser.idcity === city.idcity)) {
        this.selectedCities.push(city);
        this.selectedImg.push( {idcity: city.idcity, flag: city.flag } );
        this.myFormSearch.get('itemSearch')?.setValue('');
      }else{
        return
      }
    
    }
  
    removeUser(user: any){
  
      const index = this.selectedCities.indexOf(user);
      if (index >= 0) {
        this.selectedCities.splice(index, 1);
        this.selectedImg.splice(index, 1);
      }
       console.log(this.selectedCities);  
    }
  
    addCitiesToDiocese(){
      let body: any[] = []; 
      this.selectedCities.forEach((item)=>{body.push(item.idcity)})
      const arrayIds = {
        citiesIds: body
      }
      this.diocesisCityService.addCityToDiocese( this.data, arrayIds).subscribe( 
        ( {success} )=>{
          if(success){
            this.successToast("Cidade agregada com sucesso.");
            setTimeout(()=>{ this.dialogRef.close('addCity') }, 700)
          }
  
        })
  
    }
  
    successToast( msg:string){
      this.toastr.success(msg, 'Sucesso!!', {
        positionClass: 'toast-bottom-right', 
        timeOut: 3500, 
        messageClass: 'message-toast',
        titleClass: 'title-toast'
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
  this.loadindCongregatio = true;
  this.labelNoFound = false;
  this.diocesisCityService.searchCity(value).subscribe ( 
    ( {cities} )=>{
      if(cities.length === 0){
          this.spinner = false;
          this.myFormSearch.get('itemSearch')?.setValue('');
          this.labelNoFound = true;
          this.loadindCongregatio = false;
          setTimeout(()=>{ this.labelNoFound = false}, 1500)
      }else{
        this.loadindCongregatio = false;
        this.suggested = cities.slice(0, 5);
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
    this.backClose = true;
    setTimeout( ()=>{ this.dialogRef.close('exito') }, 400 )
  }
  
 
  
  }
  
