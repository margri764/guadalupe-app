import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import * as moment from 'moment';
import { User } from 'src/app/shared/models/user.models';
import { Subject, debounceTime, delay, take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { getDataLS, getDataSS } from 'src/app/shared/storage';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';
import { ErrorService } from 'src/app/services/error.service';
import { CongregatioService } from 'src/app/services/congregatio.service';
import { ValidateService } from 'src/app/services/validate.service';
import { PropulsaoService } from 'src/app/services/propulsao.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { TablerIconsModule } from 'angular-tabler-icons';
import {provideNativeDateAdapter} from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter'
import { SearchCongregatioComponent } from 'src/app/pages/search-congregatio/search-congregatio/search-congregatio.component';



@Component({
  selector: 'app-new-user-modal',
  standalone: true,
  imports: [ CommonModule, MaterialModule, RouterModule, ReactiveFormsModule, FormsModule, TablerIconsModule, MatMomentDateModule],
  templateUrl: './new-user-modal.component.html',
  styleUrl: './new-user-modal.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class NewUserModalComponent {

  @ViewChild('link') link!: ElementRef;

    // start search
    @Output() onDebounce: EventEmitter<string> = new EventEmitter();
    @Output() onEnter   : EventEmitter<string> = new EventEmitter();
    debouncer: Subject<string> = new Subject();

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
    backClose : boolean = false;

    // end search

    myFormSearch!: FormGroup;
    success:any;

    myForm! : FormGroup;
    ordem :any[] = ["Primeira","Segunda", "Terceira" ];
    isLoading : boolean = false;
    showSuccess : boolean = false;
    showLabelNoRole : boolean = false;
    roleSelected : any;

    dtTrigger: Subject<any> = new Subject();
    userCongregatio : any = null ;
    pathImg : string = '';
    loadindCongregatio : boolean = false;
    isLinkedToCongregatio : boolean = false;
    user! : User;
    readonlyFields: { [key: string]: boolean } = {};
    @ViewChild('closebutton') closebutton! : ElementRef;
    disableOrdem:boolean = false;
    showDatePicker:boolean = true;
    linkCongregatio : any = 0;
    loggedUser :any;
    propulsaos : any []=[];
    role : any | null; 

  
    constructor(
                private fb : FormBuilder,
                private userService : UserService,
                private errorService : ErrorService,
                private congregatioService : CongregatioService,
                private validatorService : ValidateService,
                private toastr: ToastrService,
                private propulsaoService : PropulsaoService,
                private dialogRef : MatDialogRef<NewUserModalComponent>,
                private dialog : MatDialog
    ) {

      (screen.width <= 800) ? this.phone = true : this.phone = false;

      this.myForm = this.fb.group({
        ordem: [ '', [Validators.required] ],
        Nome_Completo:  [ '', [Validators.required] ],
        Telefone1:  [ '', [Validators.required]],
        Data_Nascimento:  [null, [Validators.required]],
        Email:     [ '', [Validators.required, Validators.pattern(this.validatorService.emailPattern)] ],
        emailCongregatio:  [ null ],
        Nacionalidade:  [ '', [Validators.required] ],
        Residencia_atual:  [ '', [Validators.required] ],
        Pais_da_sede:  [ '', [Validators.required] ],
        Cidade_da_sede:  [ '', [Validators.required] ],
        Nome_da_sede:  [ '', [Validators.required] ],
        idpropulsao: ['']
      });

      this.myFormSearch = this.fb.group({
        itemSearch:  [ '',  ],
      });   

      const user = getDataSS('user');
      if(user){
        this.loggedUser = user;
      }

      
     }


    ngOnInit(): void {

      this.errorService.closeIsLoading$.pipe(delay(700)).subscribe(emitted => emitted && (this.isLoading = false));

      this.getInitialPropulsaos();

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

    get f(){
      return this.myForm.controls;
    }



getInitialPropulsaos() {

  this.propulsaoService.getAllPropulsaos().subscribe(
    ({ success, propulsaos }) => {
      if (success) {
        this.propulsaos = propulsaos;
      }
    }
  );
}

onSave(){

      if ( this.myForm.invalid ) {
        this.myForm.markAllAsTouched();
        this.warningToast('O usuário não pôde ser criado. Verificar o formulário');
        return;
      }
      
      const selectedPropulsao = this.myForm.get('idpropulsao')?.value;  

      if(this.role !== "webmaster"){
        if(!selectedPropulsao || selectedPropulsao === ''){
          this.warningToast('Seleciona propulsao. O usuário não pôde ser criado');
          return
        }
      }

      this.showSuccess = false;
      this.showLabelNoRole = false;
   
      const Data_Nascimento = this.myForm.get('Data_Nascimento')?.value;
      const momentDate = new Date(Data_Nascimento);
      let birthdayFormatted = null;
      if (!isNaN(momentDate.getTime())) {
        birthdayFormatted = moment(momentDate).format('YYYY-MM-DD');
      } else {
          birthdayFormatted = null;
      }

      let body: User;

      // si es un usuario linkeado a congregatio
      if(this.linkCongregatio === 1){
        const email = this.myForm.get('Email')?.value;  
        const emailCongregatio = this.myForm.get('emailCongregatio')?.value;  
        this.userCongregatio.Email = email;

        body  = {
          ...this.userCongregatio,
          Telefone1:this.myForm.get('Telefone1')?.value,
          Data_Nascimento: birthdayFormatted,
          linkCongregatio: this.linkCongregatio,
          Ruta_Imagen: (this.pathImg==='') ? null : this.pathImg,
          emailCongregatio,
          Nome_da_sede :    this.myForm.get('Nome_da_sede')?.value,
          Pais_da_sede :   this.myForm.get('Pais_da_sede')?.value,
          Cidade_da_sede: this.myForm.get('Cidade_da_sede')?.value,
          idpropulsao : (!selectedPropulsao && !selectedPropulsao.idpropulsao) ? null : selectedPropulsao.idpropulsao,
          role : this.role
        }

      }else{
      // usuario sin congregatio
      body  = {
        ...this.myForm.value,
        Data_Nascimento: birthdayFormatted,
        linkCongregatio: this.linkCongregatio,
        Ruta_Imagen: (this.pathImg==='') ? null : this.pathImg,
        idpropulsao : (!selectedPropulsao && !selectedPropulsao.idpropulsao) ? null : selectedPropulsao.idpropulsao,
        role : this.role
      }

      }

      console.log(body);

      this.isLoading = true;

      this.userService.createUser(body).subscribe(
        ( {success} )=>{
          if( success ){
            setTimeout(()=>{ this.isLoading = false }, 700);
            this.showSuccess = true;
            this.isLinkedToCongregatio = false;
            this.userCongregatio = null;
            this.myForm.reset();
            this.myForm.clearValidators(); 
            this.disableOrdem = false;
            this.resetReadonlyFields();
            this.successToast('Usuário criado com successo');
            this.dialogRef.close('new-user')

          }
        })
}
   

handleRoleChange( value:string ){
    this.roleSelected = value;
    this.role = this.roleSelected;
}

validField( field: string ) {
  const control = this.myForm.get(field);
  return control && control.errors && control.touched;
}

closeToast(){
  this.showSuccess = false;
}

searchCongregatio(){

  
  const dialogRef = this.dialog.open(SearchCongregatioComponent,{
    maxWidth: (this.phone) ? "97vw": '800px',
    maxHeight: (this.phone) ? "90vh": '95vh',
  });

  dialogRef.afterClosed().subscribe(user => {
    if (user) {

            if(user.Ordem === 'Falecido' || user.Ordem === 'falecido'){
              const title = 'Usúario falecido';
              const msg = '';
              const footer = 'Por favor, tente com outro usuário';
              this.showErrorSwal( title, msg, footer )
            }else{
              this.selectUser(user);
            }
          }
  });
 

}

showErrorSwal( title : string, msg : string, footer : string) {
  Swal.fire({
    icon: 'error',
    title: title,
    text: msg,
    footer: footer,
    allowOutsideClick: false,  
    allowEscapeKey: false,
  }).then((result) => {
    if (result.isConfirmed && footer === 'Por favor, tente novamente mais tarde') {
      // this.router.navigateByUrl('/login')
    }else{
      this.isLoading = false;
    }
  });
}

selectUser(user: any){

  console.log(user);

  this.userCongregatio = user;
  this.linkCongregatio = 1;
  this.isLinkedToCongregatio = true;
  
  this.pathImg =`https://congregatio.info/${user['Ruta Imagen']}`

  //back values references
  const backFullName = user['Nome Completo'];
  const backPhone = user.Telefone1;
  let backBirthday = user['Data Nacimento'];
  const backNationality = user.Nacionalidade;
  const backActualAddress = user['Residência atual'];
  const backSede = user['Sede onde entrou'];
  const backOrdem = user['Ordem'];
  const backEmailCongregatio = user['Email'];

  this.telephone = backPhone;
  
  // Definir los campos y sus valores iniciales (cámbialos según tu formulario)
  const fields = [
    { name: 'Nome_Completo', backValue: backFullName },
    { name: 'Telefone1', backValue: backPhone },
    { name: 'Data_Nascimento', backValue: backBirthday },
    { name: 'emailCongregatio', backValue: backEmailCongregatio },
    { name: 'Nacionalidade', backValue: backNationality },
    { name: 'Residencia_atual', backValue: backActualAddress },
    { name: 'Nome_da_sede', backValue: backSede },
    { name: 'ordem', backValue: backOrdem },

  ];

  if(backOrdem && backOrdem !== ''){

  this.disableOrdem = true;
  }

  // Iterar sobre los campos
  fields.forEach(field => {
    const formControl = this.myForm.get(field.name);

    if (formControl instanceof FormControl) {
      if (field.backValue !== null && field.backValue !== undefined && field.backValue !== '') {
          //esto lo necesita el date picker
        if(field.name === 'Data_Nascimento'){
          const serializedDate = new Date(field.backValue).toISOString();
          formControl.setValue(serializedDate);
        }else{
          formControl.setValue(field.backValue);
          }
        this.readonlyFields[field.name] = true;
      } else {
        this.readonlyFields[field.name] = false;
      }
    }
  });
  this.suggested = [];
  this.myFormSearch.get('itemSearch')?.setValue('');

}

telephone:any;

warningToast( msg:string){
  this.toastr.warning(msg, 'Rever!!', {
    positionClass: 'toast-bottom-right', 
    timeOut: 6000, 
    messageClass: 'message-toast',
    titleClass: 'title-toast'
  });
}

// despues de hacer la peticion pero enviando el user congregatio, vacio los formularios
resetReadonlyFields() {
  Object.keys(this.readonlyFields).forEach(fieldName => {
    this.readonlyFields[fieldName] = false;
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
    this.userCongregatio = null;
    this.resetReadonlyFields();
    this.myForm.reset();
    this.congregatioService.searchUserCongregatio(value)
    .subscribe ( ( {users} )=>{
      if(users.length === 0){
          this.spinner = false;
          this.myForm.get('itemSearch')?.setValue('');
      }else{
        // this.loadindCongregatio = false;
        this.spinner = false;
        this.suggested = users;
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
    // this.noMatches = false;
  },500)
}
// search
  
closeModal(){
  this.backClose = true;
  setTimeout( ()=>{ this.dialogRef.close() }, 400 )
  
}

successToast( msg:string){
  this.toastr.success(msg, 'Sucesso!!', {
    positionClass: 'toast-bottom-right', 
    timeOut: 3500, 
    messageClass: 'message-toast',
    titleClass: 'title-toast'
  });
}

  

    
     
  }