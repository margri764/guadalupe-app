import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, delay } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { AlarmGroupService } from 'src/app/services/alarm-group.service';
import { ErrorService } from 'src/app/services/error.service';
import { UserService } from 'src/app/services/user.service';
import { ImagenPathPipe } from "../../../../pipe/imagen-path.pipe";
import { ViewCongregatioModalComponent } from '../../view-congregatio-modal/view-congregatio-modal/view-congregatio-modal.component';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
    selector: 'app-new-alarm-modal',
    standalone: true,
    templateUrl: './new-alarm-modal.component.html',
    styleUrl: './new-alarm-modal.component.scss',
    imports: [CommonModule, MaterialModule, ReactiveFormsModule, ImagenPathPipe],
    providers: [provideNativeDateAdapter()],

})
export class NewAlarmModalComponent {


  @ViewChild('groupSelect') groupSelect! : ElementRef;

  @Input() data : any;

  // start search
  @Output() onDebounce: EventEmitter<string> = new EventEmitter();
  @Output() onEnter   : EventEmitter<string> = new EventEmitter();
  debouncer: Subject<string> = new Subject();
  debouncerUser: Subject<string> = new Subject();
  itemSearch : string = '';
  userSearch : string = '';
  mostrarSugerencias: boolean = false;
  mostrarSugerenciasUser: boolean = false;
  showSuggested : boolean = false;
  showSuggestedUser : boolean = false;
  suggested : any[] = [];
  suggestedUser : any[] = [];
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
  selectedUsers : any[]=[];

  // end search

  myForm!: FormGroup;
  myFormSearch!: FormGroup;
  myFormSearchUser!: FormGroup;
  frequencySelected : any []=[];
  nameFreq : any []=[];
  nameGroups : any [] =[];
  selectedGroups : any [] =[];
  groups : any []=[];
  user : any | null;
  isChecked : boolean = false;
  exclude : boolean = false;
  pessoal : boolean = false;
  grupal : boolean = false;
  isLoading : boolean = false;
  frequency = [  {id:7, name: '7 dias antes'}, {id:15, name: '15 dias antes'}, {id:30, name: '30 dias antes'}  ];
  isSendEmail : number = 0;
  repAnnually : number = 0;
  showUserInput : boolean = true;
  userAlarm : any;
  alarmUserNoFound : boolean = false;
  backClose : boolean = false;


  constructor(
              private fb : FormBuilder,
              private alarmGroupService : AlarmGroupService,
              private userService : UserService,
              private toastr: ToastrService,
              private errorService : ErrorService,
              private dialog : MatDialog,
              private dialogRef : MatDialogRef<NewAlarmModalComponent>,


             ) 
  { 

    (screen.width < 800) ? this.phone = true : this.phone = false;

    this.myForm = this.fb.group({
      name:     [ '', [Validators.required] ],
      iduser:  [ null ],
      idgroups:  [ null],
      alarmDate:  [ '', [Validators.required]],
      notifFrequency:  [ null],
      description: ['',[Validators.required]],
    });
    
    this.myFormSearch = this.fb.group({
      itemSearch:  [ '',  ],
    });   

    this.myFormSearchUser= this.fb.group({
      userSearch:  [ '',  ],
    });   


    this.alarmGroupService.getAllGroups().subscribe(
      ( {success, groups} )=>{
        if(success){
            this.groups = groups;
        }
      });
  
    
  }


  ngOnInit(): void {


    // si la alarma se crea desde el panel de edi-user no hace falta pedir el usuario en este formulario
    if(this.data && this.data.userAlarm.iduser){
      this.showUserInput = false;
      this.userAlarm = { iduser: this.data.userAlarm.iduser, name: this.data.userAlarm.Nome_Completo, Ruta_Imagen: this.data.userAlarm.Ruta_Imagen};
      console.log(this.userAlarm); 
    }

    this.errorService.closeIsLoading$.pipe(delay(100)).subscribe(emitted => emitted && (this.isLoading = false));


    this.myFormSearch.get('itemSearch')?.setValidators([Validators.required]);

    // usuario para agregar a la alarma

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
  
  }

  get f(){
    return this.myForm.controls;
  }
  get f2(){
    return this.myFormSearch.controls;
  }

  onSave(){

    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return;
    }

    if ( this.myFormSearch.invalid ) {
      this.myFormSearch.markAllAsTouched();
      return;
    }

    // es para marcar el error de no seleccionar grupos o usuarios
    if(this.isSendEmail === 1 ){

      if( this.selectedUsers.length === 0 && this.selectedGroups.length === 0){
        this.errorToast('Selecione um grupo ou um usuário a fim de notificar')
        return
      };

    }

   
    const alarmDate = this.myForm.get('alarmDate')?.value;
    // const momentDate = new Date( alarmDate.year, alarmDate.month - 1, alarmDate.day );
  
    // let formattedDate = null;
    let groups : any [] | null= [];
  
    // if(alarmDate !== null && alarmDate !== ''){
    //   formattedDate = moment(momentDate).toISOString();
    // }
  
    this.selectedGroups.forEach( (element:any)=>{
      groups?.push(element.idgroup)
    })

        const body = {
                        ...this.myForm.value,
                        alarmDate: alarmDate,
                        groups: (this.selectedGroups && this.selectedGroups.length > 0) ? this.selectedGroups : null,
                        userAlarm: (this.showUserInput) ? { iduser: this.user.iduser, name:this.user.Nome_Completo, Ruta_Imagen: this.user.Ruta_Imagen}: this.userAlarm,
                        idUsersNotifications: this.arrIdsUserNotifications.length !== 0 ? this.arrIdsUserNotifications : null ,
                        notifFrequency: this.frequencySelected,
                        sendEmail: this.isSendEmail,
                        repeatAnnually: this.repAnnually

                     }
      console.log(body);

      this.isLoading = true;
      this.alarmGroupService.createAlarm(body).subscribe(
        ( {success} )=>{
          setTimeout(()=>{ this.isLoading = false },1800)
          if(success){
            setTimeout(()=>{   
              this.successToast("Alarme criado com sucesso");
              this.pessoal = false;
              this.grupal = false;
              this.isChecked = false;
            },1000);
            setTimeout(()=>{this.dialogRef.close('closed')},1500)

          }
        })
  
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


closeModal(){
  
  this.backClose = true;
  setTimeout( ()=>{ this.dialogRef.close() }, 400 )
}
removeGroup(grupo: any): void {

  if(this.selectedGroups.length !== 0){
    this.selectedGroups = this.selectedGroups.filter(idgroup => idgroup !== grupo.idgroup);
    this.nameGroups = this.nameGroups.filter(group => group.idgroup !== grupo.idgroup);
  }else{
    this.nameGroups = this.nameGroups.filter(group => group.idgroup !== grupo.idgroup);
  }

}

onSelectGroup( event: any){

  const selectedValue = event.target.value;
  const name= selectedValue.split(',')[0];
  const idgroup = parseInt(selectedValue.split(',')[1], 10);

  // Verificar si ya existe un grupo con el mismo idgroup
    const existingGroup = this.selectedGroups.find(group => group === idgroup);
  
    // Agregar solo si no existe
    if (!existingGroup) {
      // this.selectedGroups.push({ idgroup, name });
      this.selectedGroups.push(idgroup);
      this.nameGroups.push({name, idgroup});
    }

    if (this.groupSelect) {
      this.groupSelect.nativeElement.selectedIndex = 0;
    }
  
    event.target.value = null;
 console.log( this.selectedGroups);

}

onSelectFreq( event: any){
  const selectedValue = event.target.value;
  let id= selectedValue.split(',')[0];
  id = parseInt(id);
  const name = selectedValue.split(',')[1];

  console.log(this.frequencySelected);

    const existingFreq = this.frequencySelected.find(item => item === id);
   
    if (!existingFreq) {
      this.frequencySelected.push(id);
      this.nameFreq.push(name);
    }
    event.target.value = null;
  console.log(this.frequencySelected);


}

removeFreq(nameToRemove: string): void {

  console.log(this.frequencySelected);

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

  }else{
    this.nameFreq = this.nameGroups.filter(name => name !== nameToRemove);
  }
  console.log('selectedGroups',  this.frequencySelected);


}

validField( field: string ) {
  const control = this.myForm.controls[field];
  return control && control.errors && control.touched;
}

validFieldSearch( field: string ) {
  const control = this.myFormSearch.controls[field];
  return control && control.errors && control.touched;
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
    this.debouncer.next( this.itemSearch );  
    this.showSuggested = true;
 };

 teclaPresionadaUser(){
  this.debouncerUser.next( this.userSearch );  
  this.showSuggestedUser = true;
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
  this.alarmUserNoFound = false;
  this.mostrarSugerencias = true;  
  this.userService.searchUser(value)
  .subscribe ( ( {users} )=>{
    if(users.length === 0){
        this.myForm.get('itemSearch')?.setValue(''); 
        this.alarmUserNoFound = true;
        setTimeout(()=>{ this.alarmUserNoFound = false}, 1500)
    }else{
      this.suggested = users.splice(0,3);

    }
    }
  )
 }

 sugerenciasUser(value : string){

  if(value ){
    if(value.length < 3){
      return;
    }
  }else{
    return;
  }
  this.labelNoFound = false;
  this.userSearch = value;
  this.mostrarSugerenciasUser = true;  
  this.userService.searchUser(value)
  .subscribe ( ( {users} )=>{
    if(users.length === 0){
        this.myForm.get('userSearch')?.setValue(''); 
        this.labelNoFound = true;
        setTimeout(()=>{ this.labelNoFound = false}, 1500)
    }else{
      this.suggestedUser = users.splice(0,3);

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
      this.myForm.get('itemSearch')?.setValue(''); 
      this.suggested = [];
    },500)
 }
// search

selectUser( user:any ){
  this.myFormSearch.get('itemSearch')?.setValue(user.Nome_Completo);
  this.user = user;
  this.suggested = [];
  this.showSuggested = false;

}

arrIdsUserNotifications : any []=[];

selectUserNotif(user: any): void {
  this.myFormSearchUser.get('userSearch')?.setValue('');
  this.suggestedUser = [];
  this.showSuggestedUser = false;

  if (!this.selectedUsers.some(selectedUser => selectedUser.iduser === user.iduser)) {
    this.selectedUsers.push( {iduser: user.iduser, email: user.Email, Nome_Completo: user.Nome_Completo, Ruta_Imagen: user.Ruta_Imagen } );
    // this.arrIdsUserNotifications.push( {iduser: user.iduser, email: user.Email, Nome_Completo: user.Nome_Completo } );
    this.arrIdsUserNotifications.push( user.iduser );

  }
  console.log( this.arrIdsUserNotifications);
}

removeUser(user: any){

  const index = this.selectedUsers.indexOf(user);
  if (index >= 0) {
    this.selectedUsers.splice(index, 1);
    this.arrIdsUserNotifications.splice(index, 1);
  }
  console.log(this.arrIdsUserNotifications);

}


sendEmail($event : MatSlideToggleChange){
  const isChecked = $event.checked;

  (isChecked) ? this.isSendEmail = 1 : this.isSendEmail = 0
}

repeatAnnually($event : MatSlideToggleChange){
  const isChecked = $event.checked;

  (isChecked) ? this.repAnnually = 1 : this.repAnnually = 0
}

errorToast( error:string){
this.toastr.error(error, 'Erro!', {
  positionClass: 'toast-bottom-right', 
  closeButton: true,
  timeOut: 3500, 
});
}

viewUser( user:any ){


  setTimeout(()=>{
    const origin = 'group'
    this.dialog.open(ViewCongregatioModalComponent,{
      maxWidth: (this.phone) ? "98vw": '',
      panelClass: "custom-modal-picture",    
      data: { user, origin  }
      });

  },300)

}

// viewUser( user:any ){

//     const modalRef = this.modalService.open(ViewCongregatiComponent,{
//       keyboard: true, 
//       backdrop: 'static',
//       size: 'xl',
//       scrollable: true
//     });
//     const origin = 'group'
//     modalRef.componentInstance.data = { user, origin  }
// }


}

