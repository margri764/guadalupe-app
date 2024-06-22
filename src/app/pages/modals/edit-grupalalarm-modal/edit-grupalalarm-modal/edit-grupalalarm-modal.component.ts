import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgbActiveModal, NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, delay } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { AlarmGroupService } from 'src/app/services/alarm-group.service';
import { ErrorService } from 'src/app/services/error.service';
import { UserService } from 'src/app/services/user.service';
import { ViewCongregatioModalComponent } from '../../view-congregatio-modal/view-congregatio-modal/view-congregatio-modal.component';
import { ImagenPathPipe } from "../../../../pipe/imagen-path.pipe";
import { provideNativeDateAdapter } from '@angular/material/core';


export interface Alarm {

  idalarm: string,
  alarmDate: string,
  name: string,
  description: string,
  notifFrequency : object,
  userAlarm : any,
  sendEmail: number,
  idUsersNotifications: object | null,
  repeatAnnually : number,
  idpropulsao:any,
  status? : string,
  grupos? : object | null

}


@Component({
    selector: 'app-edit-grupalalarm-modal',
    standalone: true,
    templateUrl: './edit-grupalalarm-modal.component.html',
    styleUrl: './edit-grupalalarm-modal.component.scss',
    imports: [CommonModule, MaterialModule, ReactiveFormsModule, ImagenPathPipe, MatSlideToggleModule],
    providers: [provideNativeDateAdapter()],

})
export class EditGrupalalarmModalComponent {


  @ViewChild('groupSelect') groupSelect! : ElementRef;

  // start search
  @Output() onDebounce: EventEmitter<string> = new EventEmitter();
  @Output() onEnter   : EventEmitter<string> = new EventEmitter();
  debouncer: Subject<string> = new Subject();
  itemSearch : string = '';
  mostrarSugerencias: boolean = false;
  showSuggested : boolean = false;
  suggested : any[] = [];
  spinner : boolean = false;
  fade : boolean = false;
  search : boolean = true;
  product  : any[] = [];
  clients : any []=[];
  arrClient : any []=[];
  clientFound : any = null;
  isClientFound : boolean = false;
  labelNoFinded : boolean = false;
  phone : boolean = false;
  suggestedUser : any[] = [];
  userSearch : string = '';
  mostrarSugerenciasUser: boolean = false;
  showSuggestedUser : boolean = false;
  selectedUsers : any[]=[];

  // end search

  myForm!: FormGroup;
  myFormSearch!: FormGroup;
  myFormSearchUser!: FormGroup;

  selectedGroups : any [] =[];
  nameGroups : any [] =[];
  frequencySelected : any []=[];
  groups : any []=[];
  nameFreq : any []=[];
  isLoading : boolean = false;
  exclude : boolean = false;
  alarm:any;
  user:any | null;
  isChecked : boolean = false;
  iduser: any= null;
  userSelection : boolean = false;
  frequency = [ {id:7, name: '7 dias antes'}, {id:15, name: '15 dias antes'}, {id:30, name: '30 dias antes'}  ];
  groupSelection : boolean = false;
  enableUserInput : boolean = false;
  backClose : boolean = false;
  visibility : boolean = false;
  isSendEmail : number = 0;
  arrIdsUserNotifications : any []=[];
  debouncerUser: Subject<string> = new Subject();
  repAnnually : number = 0;


  constructor(
                private fb : FormBuilder,
                private alarmGroupService : AlarmGroupService,
                private userService : UserService,
                private toastr: ToastrService,
                private errorService : ErrorService,
                private dialog : MatDialog,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private dialogRef : MatDialogRef<EditGrupalalarmModalComponent>


  ) { 

  


    this.myForm = this.fb.group({
      name:     [ '', [Validators.required] ],
      alarmDate:  [ '', [Validators.required] ],
      notifFrequency:  [ null ],
      description: [ '', [Validators.required] ],
    });

    this.myFormSearch = this.fb.group({
      itemSearch:  [ '',  ],
    });   

    this.myFormSearchUser= this.fb.group({
      userSearch:  [ '',  ],
    });   

    (screen.width < 800) ? this.phone = true : this.phone = false;


  }

  ngOnInit(): void {

    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));

    this.alarmGroupService.getAllGroups().subscribe(
      ( {success, groups} )=>{
        if(success){
            this.groups = groups;
        }
      });


    this.getInitAlarms();
    
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

     // busqueda de usuarios para recibir la notificacion
     this.myFormSearchUser.get('userSearch')?.valueChanges.subscribe(newValue => {
      this.userSearch = newValue;
  
      if(this.userSearch !== ''){
          this.teclaPresionadaUser();
      }else{
        this.suggestedUser = [];
        this.spinner= false;
      }
    });
  
    this.debouncerUser.pipe(debounceTime(700)).subscribe( valor => {
  
      this.sugerenciasUser(valor);
    });

    
  this.myForm.patchValue({
    name: this.alarm.name,
    alarmDate: this.alarm.alarmDate,
    description: this.alarm.description,
    idalarm: this.alarm.idalarm
  });

  this.myForm.get('name')?.setValidators([Validators.required]);
  this.myForm.get('alarmDate')?.setValidators([Validators.required]);
  this.myForm.get('description')?.setValidators([Validators.required]);

}

get f(){
  return this.myForm.controls;
}
get f2(){
  return this.myFormSearch.controls;
}

getInitAlarms(){

    console.log(this.data);
    this.alarm = this.data.alarm;
    this.user = this.alarm.userAlarm;
    this.nameFreq = this.data.nameFreq;
    this.frequencySelected = (!this.alarm.notifFrequency) ? [] : this.alarm.notifFrequency ; 
    this.selectedUsers = this.alarm.idUsersNotifications;
    this.suggested.push({Ruta_Imagen: this.alarm.userAlarm.Ruta_Imagen, iduser: this.alarm.userAlarm.iduser, Nome_Completo: this.alarm.userAlarm.name });
    this.showSuggested = true;
    this.mostrarSugerencias = true;
    this.enableUserInput = true;


    if(this.alarm.grupos && this.alarm.grupos.length > 0){
      this.selectedGroups = this.alarm.grupos;
    }else{
     this.selectedGroups = [];
    }
    
    this.repAnnually = this.alarm.repeatAnnually;
    this.isSendEmail = this.alarm.sendEmail;

}


editAlarm(){

  if ( this.myForm.invalid ) {
    this.myForm.markAllAsTouched();
    return;
  }

  if ( this.myFormSearch.invalid && !this.user) {
    this.myFormSearch.markAllAsTouched();
    return;
  }

    // es para marcar el error de no seleccionar grupos o usuarios
    if(this.isSendEmail === 1 ){

      if( (this.selectedUsers.length === 0) &&  (this.selectedGroups.length === 0) ){
        this.errorToast('Selecione um grupo ou um usuário a fim de notificar')
        return
      };

    }

  let groups : any [] | null= [];
  let userNotifi : any [] | null= [];


  if(this.selectedGroups && this.selectedGroups.length > 0){

    this.selectedGroups.forEach( (element:any)=>{
      groups?.push(element.idgroup)
    })
  }

  if( this.selectedUsers && this.selectedUsers.length > 0){
    this.selectedUsers.forEach( (element:any)=>{
      userNotifi?.push(element.iduser)
    })
  }


  let userAlarm = null;


  if(this.user.name && this.user.name !== ''){ // quiere decir q se dejo el mismo user alarm
      userAlarm = {
        iduser: this.data.alarm.userAlarm.iduser, 
        name: this.data.alarm.userAlarm.name,
        Ruta_Imagen: this.data.alarm.userAlarm.Ruta_Imagen,
      } 
  }else{
      userAlarm = {
        iduser: this.user.iduser, 
        name: this.user.Nome_Completo,
        Ruta_Imagen: this.user.Ruta_Imagen,
      } 
  }

  console.log(this.frequencySelected);

  const body : Alarm = {
                  name : this.myForm.get('name')?.value,
                  // alarmDate : formattedDate,
                  alarmDate : this.myForm.get('alarmDate')?.value,
                  notifFrequency : this.frequencySelected,
                  description : this.myForm.get('description')?.value,
                  userAlarm,
                  idalarm : this.data.alarm.idalarm,
                  grupos: groups.length > 0 ? groups : null,
                  idUsersNotifications:  userNotifi.length > 0  ? userNotifi : null,
                  idpropulsao: this.data.alarm.idpropulsao,
                  sendEmail: this.isSendEmail,
                  repeatAnnually: this.repAnnually
  }

  console.log(body);

  this.isLoading = true;
 
  this.alarmGroupService.editAlarm(body.idalarm, body).subscribe(
    ( {success} )=>{
            if(success){
              setTimeout(()=>{ 
                this.isLoading = false
                this.dialogRef.close('closed')
                this.successToast("Alarme editada com sucesso");
              }, 1100);

                
            }
    })

}

removeGroup(nameToRemove: string): void {

  console.log('selectedGroups',  this.selectedGroups);
  console.log('nameToRemove',  nameToRemove);

  // Filtrar el array para excluir el grupo con el nombre especificado
  // esto es para cuando no seleccione nada o sea q viene del back como edit
  if(this.selectedGroups.length !== 0){
    this.selectedGroups = this.selectedGroups.filter(group => group.name !== nameToRemove);
    this.nameGroups = this.selectedGroups.map(group => group.name);
    if(this.selectedGroups.length === 0) {this.selectedGroups = []} //reseteo el input
    
  }else{
    this.nameGroups = this.nameGroups.filter(name => name !== nameToRemove);
  }
}

selectUser( user:any ){
  console.log(user);
  this.myFormSearch.get('itemSearch')?.setValue(user.Nome_Completo);
  this.user = user;
  this.suggested = [];
  this.showSuggested = false;
  this.userSelection = true;
}

unSelectSelectedUser( user:any ){

  console.log(user.iduser);
  
  console.log(this.suggested)
  this.enableUserInput = false;
  this.data.alarm.iduser = undefined;

  this.suggested = this.suggested.filter( (item)=>item.iduser !== user.iduser);
  console.log(this.suggested);
  this.myFormSearch.get('itemSearch')?.setValue('');
  this.user = null;
  this.userSelection = false;
}

viewUser( user:any ){
  this.visibility = true;
  setTimeout(()=>{
    const origin = 'group'
    this.dialog.open(ViewCongregatioModalComponent,{
      maxWidth: (this.phone) ? "98vw": '',
      panelClass: "custom-modal-picture",    
      data: { user, origin  }
      });

  },300)
}

onSelectFreq( event: any){

  const selectedValue = event.target.value;
  let id = selectedValue.split(',')[0];
  id = parseInt(id);
  const name = selectedValue.split(',')[1];

  const existingFreq = this.frequencySelected.find(item => item === id);

  if (existingFreq === undefined && existingFreq !== 0) {
    this.frequencySelected.push(id);
    this.nameFreq.push(name);
  }
    event.target.value = null;
}

removeFreq(nameToRemove: string): void {

  console.log(this.frequencySelected);
  console.log(nameToRemove);

  if(this.frequencySelected.length !== 0){

    switch (nameToRemove) {

      // case "No mesmo dia":
      //           this.frequencySelected = this.frequencySelected.filter(freq => freq !== 0);
      //   break;

      case "7 dias antes":
          this.frequencySelected = this.frequencySelected.filter(freq => freq !== 7);
        break;

      case "15 dias antes":
          this.frequencySelected = this.frequencySelected.filter(freq => freq !== 15);
        break;

      case "30 dias antes":
        this.frequencySelected = this.frequencySelected.filter(freq => freq !== 30);
      break;
    
      default:
        break;
    }
    
    this.nameFreq = this.nameFreq.filter(freq => freq !== nameToRemove);

    console.log( this.frequencySelected);
  }
}

remainingCharacters: number = 250;
limitCharacters(event: any) {
  const maxLength = 250;
  const textarea = event.target as HTMLTextAreaElement;
  const currentLength = textarea.value.length;
  const remaining = maxLength - currentLength;
  if (remaining >= 0) {
    this.remainingCharacters = remaining;
  } else {
    textarea.value = textarea.value.substring(0, maxLength);
  }
}

successToast( msg:string){
  this.toastr.success(msg, 'Sucesso!!', {
    positionClass: 'toast-bottom-right', 
    timeOut: 3500, 
    messageClass: 'message-toast',
    titleClass: 'title-toast'
  });
}

onSelectGroup( event: any){

  const value = event.target.value;
  const id = parseInt(value, 10);
  
  const selected = this.groups.find(group => group.idgroup === id);
  
  
  this.groupSelection = false;
  
  // Verificar si ya existe un grupo con el mismo idgroup
  const existingGroup = this.selectedGroups.find(group => group.idgroup === id);
  
  // Agregar solo si no existe
  if (!existingGroup) {
    this.selectedGroups.push( {name: selected.name, idgroup: selected.idgroup} );
    this.nameGroups.push( {name: selected.name, idgroup: selected.idgroup} );
  }
  
  if (this.groupSelect) {
    this.groupSelect.nativeElement.selectedIndex = 0;
  }
  console.log(this.selectedGroups);
  event.target.value = null;
}

// search
close(){
  this.mostrarSugerencias = false;
  this.itemSearch = '';
  this.suggested = [];
  this.spinner= false;
  this.showSuggested = false;
  this.myFormSearch.get('itemSearch')?.setValue('');
  this.clientFound= null;
  this.isClientFound = false;
 }

 teclaPresionada(){
// this.noMatches = false;
    this.debouncer.next( this.itemSearch );  
    this.showSuggested = true;
 };

 sugerencias(value : string){

  if(value ){
    if(value.length < 3){
      return;
    }
  }else{
    return;
  }
  
  // this.spinner = true;
  this.itemSearch = value;
  this.mostrarSugerencias = true;  
  this.userService.searchUser(value)
  .subscribe ( ( {users} )=>{
    if(users.length === 0){
        this.spinner = false;
        this.myFormSearch.get('itemSearch')?.setValue(''); 
    }else{
      this.suggested = users.splice(0,3);
      this.spinner = false;

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
    },500)
 }

 sugerenciasUser(value : string){

  if(value ){
    if(value.length < 3){
      return;
    }
  }else{
    return;
  }
  
  this.userSearch = value;
  this.mostrarSugerenciasUser = true;  
  this.userService.searchUser(value)
  .subscribe ( ( {users} )=>{
    if(users.length === 0){
        this.spinner = false;
        this.myForm.get('userSearch')?.setValue(''); 
    }else{
      this.suggestedUser = users.splice(0,3);
      this.spinner = false;

    }
    }
  )
 }

 teclaPresionadaUser(){
  this.debouncerUser.next( this.userSearch );  
  this.showSuggestedUser = true;
};


selectUserNotif(user: any): void {

  this.myFormSearchUser.get('userSearch')?.setValue('');
  this.suggestedUser = [];
  this.showSuggestedUser = false;

  console.log( this.selectedUsers);

  if(!this.selectedUsers ){this.selectedUsers = [] };
  

  if ( !this.selectedUsers.some(selectedUser => selectedUser.iduser === user.iduser)) {
    this.selectedUsers.push( {iduser: user.iduser, email: user.Email, Nome_Completo: user.Nome_Completo, Ruta_Imagen: user.Ruta_Imagen } );
  }

  console.log( this.selectedUsers);
}

removeUser(user: any){

  const index = this.selectedUsers.indexOf(user);
  if (index >= 0) {
    this.selectedUsers.splice(index, 1);
    // this.arrIdsUserNotifications.splice(index, 1);
  }
  // console.log(this.arrIdsUserNotifications);
  console.log(this.selectedUsers);

}

closeModal(){
  
  this.backClose = true;
  setTimeout( ()=>{ this.dialogRef.close(); this.resetEdition(); }, 400 )
}

resetEdition(){

  this.frequencySelected = [];
  this.nameFreq = [];
  this.myForm.reset();
  this.suggested = [];
  this.isChecked = false;
  this.mostrarSugerencias = false;
  this.selectedGroups = [];
  this.nameGroups = [];
  this.exclude = false;
}

eventSendEmail($event : MatSlideToggleChange):void{
  const isChecked = $event.checked;

  if (isChecked) {
    this.isSendEmail = 1;
  } else {
    this.isSendEmail = 0;
    this.repAnnually = 0;
  }
}

repeatAnnually($event : MatSlideToggleChange){
  const isChecked = $event.checked;

  (isChecked) ? this.repAnnually = 1 : this.repAnnually = 0
}

validField( field: string ) {
  const control = this.myForm.controls[field];
  return control && control.errors && control.touched;
}

validFieldSearch( field: string ) {
  const control = this.myFormSearch.controls[field];
  return control && control.errors && control.touched;
}

errorToast( error:string){
  this.toastr.error(error, 'Erro!', {
    positionClass: 'toast-bottom-right', 
    closeButton: true,
    timeOut: 3500, 
  });
  }


  

}

