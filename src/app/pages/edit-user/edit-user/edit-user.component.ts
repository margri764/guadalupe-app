import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from 'src/app/shared/models/user.models';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, Subscription, delay, take } from 'rxjs';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { AppState } from 'src/app/shared/redux/app.reducer';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { getDataSS } from 'src/app/shared/storage';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ErrorService } from 'src/app/services/error.service';
import { AlarmGroupService } from 'src/app/services/alarm-group.service';
import { PropulsaoService } from 'src/app/services/propulsao.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import * as authActions from '../../../shared/redux/auth.actions';
import { DeleteModalComponent } from '../../modals/delete-modal/delete-modal/delete-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ViewCongregatioModalComponent } from '../../modals/view-congregatio-modal/view-congregatio-modal/view-congregatio-modal.component';
import { SearchUserModalComponent } from '../../modals/search-user-modal/search-user-modal/search-user-modal.component';
import { SearchCongregatioComponent } from '../../search-congregatio/search-congregatio/search-congregatio.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ImagenPathPipe } from "../../../pipe/imagen-path.pipe";
import { provideNativeDateAdapter } from '@angular/material/core';
import { LogsComponent } from "../../logs/logs/logs.component";
import { PersonalAlarmComponent } from "../../personal-alarm/personal-alarm/personal-alarm.component";
import { DocumentsComponent } from "../../documents/documents/documents.component";



@Component({
    selector: 'app-edit-user',
    standalone: true,
    templateUrl: './edit-user.component.html',
    styleUrl: './edit-user.component.scss',
    providers: [provideNativeDateAdapter()],
    imports: [CommonModule, MaterialModule, RouterModule, ReactiveFormsModule, TablerIconsModule, FormsModule, ImagenPathPipe, LogsComponent, PersonalAlarmComponent, DocumentsComponent]
})
export class EditUserComponent {

  @ViewChild('link') link!: ElementRef;
  @ViewChild('closeModalFichaCompl') closeModalFichaCompl! : ElementRef;
  @ViewChild('groupSelect') groupSelect! : ElementRef;
  @ViewChild('checked') checked! : ElementRef;
  
  
  myForm! : FormGroup;
  user! : User;
  isLoading : boolean = false;
  ordem :any[] = ["Primeira","Segunda", "Terceira"];
  dupla :any[] = ["Upla", "Dupla"];
  selectedDuplaValue : string = 'upla'
  readonlyFields: { [key: string]: boolean } = {};
  wasLinked : boolean = false;
  userRole : boolean = false;
  adminRole : boolean = false;
  webMRole : boolean = false;
  stateLink : boolean = false;
  private destroy$ = new Subject<void>();
  
  authsubscriber : Subscription;
  userCongregatio : any = null ;
  pathImg : string = 'assets/images/no-image.jpg';
  isLinkedToCongregatio : boolean = false;
  
  groups : any []=[];
  selectedGroups : any []=[];
  nameGroups : any []=[];
  isChecked = false;
  idUser : any;
  disableOrdem : boolean = false;
  simpleCodeSelected : boolean = false;
  arrLogs : any []=[];
  selectedImg : File | null = null;
  showClose : boolean = false;
  checkCongregation : boolean = false;
  showLogs : boolean = false;
  showAlarms : boolean = false;
  roleSelected : string = 'user';
  loggedUser : any;
  propulsaos : any []=[];
  defaultPropulsao: any | null;
  documentsQuantity : number = 0;
  phone : boolean = false;
  
  
    constructor(
                  private activatedRoute : ActivatedRoute,
                  private authService : AuthService,
                  private userService : UserService,
                  private fb : FormBuilder,
                  private errorService : ErrorService,
                  private alarmGroupService : AlarmGroupService,
                  private propulsaoService: PropulsaoService,
                  private router : Router,
                  private imageUploadService : ImageUploadService,
                  private toastr: ToastrService,
                  private store : Store <AppState>,
                  private dialog : MatDialog
                ) 
                  
  { 
  
    (screen.width <= 800) ? this.phone = true : this.phone = false;
  
  
    this.activatedRoute.params.subscribe(
      ({id})=>{ this.getUserById(id) });
  
      const user = getDataSS('user');
      if(user){
        this.loggedUser = user;
      }
  }
  
  tabsManagment( value:string ){
  
    if( value === 'log'){
      this.showLogs = true;
      this.showAlarms = false;
    }else if (value === 'alarm'){
      this.showAlarms = true;
      this.showLogs = false;
    }
  
  }
  
    ngOnInit(): void {
  
      // defineLocale('pt-br', ptBrLocale);
      // this.localeService.use('pt-br');
  
      this.alarmGroupService.getAllGroups().subscribe(
        ( {success, groups} )=>{
          if(success){
              this.groups = groups
          }
        })
  
      this.errorService.closeIsLoading$.pipe(delay(100)).subscribe(emitted => emitted && (this.isLoading = false));
  
      this.myForm = this.fb.group({
        ordem: [ '', [Validators.required] ],
        Nome_Completo:  [ '', [Validators.required]],
        Telefone1:  [ '', [Validators.required]],
        Data_Nascimento:  [ '', [Validators.required]],
        Email:  [ '', [Validators.required]],
        emailCongregatio:  [ ''],
        Nacionalidade:  [ '', [Validators.required]],
        Pais_Nascimento:  [ '', [Validators.required]],
        Cidade_Nascimento:  [ '', [Validators.required]],
        Residencia_atual:  [ '', [Validators.required]],
        observation:  [ ''],
        dupla:  [ ''],
        // Pais_da_sede:  [ '', [Validators.required]],
        // Cidade_da_sede:  [ '', [Validators.required]],
        // Nome_da_sede:  [ '', [Validators.required]],
        linkCongregatio: [ false],
        active: [''],
        webAccess: [''],
        simpleCode: [null],
        idpropulsao: ['']
      });
  
    }

    get f(){
      return this.myForm.controls;
    }
  
    getUsersGroups( id:any ){
      this.alarmGroupService.getGroupByUserId(id).subscribe( 
        ( {success, groups} )=>{
           if(success){
            groups.forEach((item:any)=>{ this.nameGroups.push(item.name)})
            this.selectedGroups = groups;
            console.log( this.selectedGroups);
           }
        } )
    }
  
    loginAs(){
      this.isLoading = true;
  
      const body = { 
        email: this.user.Email, 
        password: "loginAs", 
        session: "false", 
        osInfo: null 
      }
  
        this.authService.login( body ).subscribe(
          ({success})=>{
            if(success){
              setTimeout(()=>{
                this.isLoading = false;
                this.router.navigateByUrl('/dashboard');
                this.authService.successLoginAs$.emit(true);
              }, 1200);
            }
            });
    }
  
    remainingCharacters: number = 500;
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
  
    removeGroup(nameToRemove: string): void {
    
      // Filtrar el array para excluir el grupo con el nombre especificado
      // esto es para cuando no seleccione nada o sea q viene del back como edit
      if(this.selectedGroups.length !== 0){
        this.selectedGroups = this.selectedGroups.filter(group => group.name !== nameToRemove);
        this.nameGroups = this.selectedGroups.map(group => group.name);
      }else{
        this.nameGroups = this.nameGroups.filter(name => name !== nameToRemove);
      }
      console.log('selectedGroups',  this.selectedGroups);
    
  
    }
  
    onSelectGroup( event: any){
  
        const selectedValue = event.target.value;
        const name = selectedValue.split(',')[0];
        const idgroup = parseInt(selectedValue.split(',')[1], 10);
      
        // Verificar si ya existe un grupo con el mismo idgroup
        const existingGroup = this.selectedGroups.find(group => group.idgroup === idgroup);
      
        // Agregar solo si no existe
        if (!existingGroup) {
          this.selectedGroups.push({ idgroup, name });
          this.nameGroups.push(name);
        }
      
      console.log(this.selectedGroups);
      if (this.groupSelect) {
        this.groupSelect.nativeElement.selectedIndex = 0;
      }
      event.target.value = null;
      
    }
  
    getUserById( id:any ){
  
      this.userService.getUserById( id ).subscribe(
        ( {success, user} )=>{
          if(success){
  
            this.user = user;
            this.authService.editNameInBradcrumb$.emit(user.Nome_Completo)
            this.initialForm();
            this.getUsersGroups(id);
            this.getInitialPropulsaos();
            this.getDupla(id)
  
            if(user.simpleCode === 1){
              this.simpleCodeSelected = true;
            }
  
            this.getDocByUserId(id);
            
            this.idUser = id;
  
            if(user.Ruta_Imagen !== '' && user.Ruta_Imagen !== null ){
              console.log(user.Ruta_Imagen);
              // son las img q vienen de congregatio
              if(user.Ruta_Imagen.startsWith('https://congregatio')){
                this.pathImg = user.Ruta_Imagen;
              }else{
                const fileName = user.Ruta_Imagen.split('/').pop() ;
            
                const serverURL = 'https://arcanjosaorafael.org/profilePicture/';
                this.pathImg = `${serverURL}${fileName}`;
              }
            }
  
            (user.linkCongregatio === 1) ? this.isLinkedToCongregatio = true : this.isLinkedToCongregatio = false; 
          }
        })
    }
  
    getDocByUserId( id:any ){
      this.userService.getDocByUserId(id).subscribe(
      ( {document} )=>{
   
        this.store.dispatch(authActions.setUserDocuments( {documents: document}));
  
        this.authsubscriber = this.store.select('auth').subscribe(
          ({documents})=>{ 
            if(documents){
              this.documentsQuantity = documents.length;
            }
          }
          )
  
      });
  
    
    }
  
    onSave(){
  
        if ( this.myForm.invalid ) {
          this.myForm.markAllAsTouched();
          this.warningToast('O usuário não pôde ser criado. Verificar o formulário');
          return;
        }
   
        // esto es por si alguien se olvida de linkear despues de seleccionar el user de la BD congregatio
         if(this.wasLinked && !this.stateLink){
          this.warningToast("Você selecionou um usuário de um banco de dados externo. É necessário escolher a opção 'Link com Congregatio'");
          return
         } 
  
         if(this.roleSelected !== 'webmaster'){
              // verifico que el usuario pertenezca a alguna propulsion, cuando se registra todavia no pertenece a ninguna
            const idpropulsao = this.myForm.get('idpropulsao')?.value;
            if( (!idpropulsao || idpropulsao === '') && (!this.defaultPropulsao) ){
              this.warningToast("Seleciona propulsao. O usuário não pôde ser editado")
              return
            }
         }
  
         let body = null;
  
         this.uploadImg();
  
         //esto es para la primera vez q lo linkeo, xq la segunda vez ya esta linqueado pero userCongregatio no existe ya q viene del back
         //y es una edicion simple
         if(this.isLinkedToCongregatio && this.userCongregatio){
           
           // esto es por si no trae esos campos el congregatio
           const propiedades = ['Telefone1', 'Data_Nascimento', 'Residencia_atual', 'Nacionalidade'];
           
           for (const propiedad of propiedades) {
             if (!this.userCongregatio[propiedad] || this.userCongregatio[propiedad] === '') {
               this.userCongregatio[propiedad] = this.myForm.get(propiedad)?.value;
              }
            }
  
            const Data_Nascimento = this.myForm.get('Data_Nascimento')?.value;
            const momentDate = new Date(Data_Nascimento);
            let birthdayFormatted = null;
            if (!isNaN(momentDate.getTime())) {
              birthdayFormatted = moment(momentDate).format('YYYY-MM-DD');
            } else {
                birthdayFormatted = null;
            }

          
          const { dupla,  ...bodyWithOutDupla } = this.userCongregatio;
  
          this.userCongregatio = bodyWithOutDupla;
        
           
            // el email tiene  q ser con el q se creo la cuenta
          const email = this.myForm.get('Email')?.value;  
          const emailCongregatio = this.myForm.get('emailCongregatio')?.value;  
          let selectedPropulsao = this.myForm.get('idpropulsao')?.value;  
  
  
          this.userCongregatio.Email = email;
  
          console.log(this.userCongregatio);
  
          body = {
              ...this.userCongregatio,
              Data_Nascimento: birthdayFormatted,
              groups: [...this.selectedGroups],
              emailCongregatio,
              idpropulsao : (this.roleSelected === 'webmaster') ? 0 : selectedPropulsao.idpropulsao //si es un admin le pone por defecto su propulsao
  
            },
            
  
          console.log(body);
  
          this.userService.editUserCongregatio(this.user.iduser, body).subscribe(
            ( {success} )=>{
                setTimeout(()=>{ this.isLoading = false },1000)
              if(success){
                this.successToast('Usúario editado com sucesso');
              }
            })
  
         }else{
  
          // edicion sin congregatio 
  
          const { dupla,  ...bodyWithOutDupla } = this.myForm.value
  
          body = bodyWithOutDupla;
  
          console.log(body);
  
  
          this.isLoading = true;
  
          let selectedPropulsao = this.myForm.get('idpropulsao')?.value;  
  
            const Data_Nascimento = this.myForm.get('Data_Nascimento')?.value;
            const momentDate = new Date(Data_Nascimento);
            let birthdayFormatted = null;
            if (!isNaN(momentDate.getTime())) {
              birthdayFormatted = moment(momentDate).format('YYYY-MM-DD');
            } else {
                birthdayFormatted = null;
            }
          body = {
            ...body,
            Data_Nascimento: birthdayFormatted,
            role : this.roleSelected,
            groups: this.selectedGroups,
            simpleCode: this.simpleCodeSelected,
            idpropulsao : (this.roleSelected === 'webmaster') ? 0 : selectedPropulsao.idpropulsao //si es un admin le pone por defecto su propulsao
          }
  
          console.log(body);
          //  alert(JSON.stringify(body) );
          
          this.userService.editUserById(this.user.iduser, body).subscribe(
            ( {success} )=>{
                setTimeout(()=>{ this.isLoading = false },1000)
              if(success){
                this.successToast('Usúario editado com sucesso')
              }
            })
         }
    }
  
    warningToast( msg:string){
      this.toastr.warning(msg, 'Cuidado!!', {
        positionClass: 'toast-bottom-right', 
        timeOut: 6000, 
        messageClass: 'message-toast',
        titleClass: 'title-toast'
      });
    }
  
    getInitialPropulsaos() {
  
      this.propulsaoService.getAllPropulsaos().subscribe(
        ({ success, propulsaos }) => {
          if (success) {
            
            if(this.loggedUser.role === "admin" || this.loggedUser.role === "super_admin" ){
  
              this.propulsaos = propulsaos;
              this.defaultPropulsao = this.propulsaos.find((p: any) => p.idpropulsao === this.loggedUser.idpropulsao);
              // solo dejo la opcion de la propulsion del admin o super_admin
              if(this.defaultPropulsao){
                this.propulsaos = [];
                this.propulsaos.push(this.defaultPropulsao);
                this.myForm.patchValue({ idpropulsao: this.defaultPropulsao });
              }
            }else{
              //si es un webmaster le asigno por defecto el role q tiene el user a editar pero le dejo la opcion de cambiarlo
              this.propulsaos = propulsaos;
              this.defaultPropulsao = this.propulsaos.find((p: any) => p.idpropulsao === this.user.idpropulsao);
              this.myForm.patchValue({ idpropulsao: this.defaultPropulsao });
            }
  
          }
        }
      );
    }
  
   validField(field: string) {
      const control = this.myForm.get(field);
      return control && control.errors && control.touched;
    }
  
    initialForm(){
  
      console.log(this.user);
  
      let link = null;
      
      (this.user.linkCongregatio === 1) ? [ link = true, this.disableOrdem = true ]: link = false;
  
      let Nome_da_sede : any;
      let Cidade_da_sede : any;
      let Pais_da_sede : any;
  
      if(!link || this.user.linkCongregatio === 1){
          Pais_da_sede = this.user?.Pais_da_sede;
          Cidade_da_sede = this.user?.Cidade_da_sede;
          Nome_da_sede = this.user?.Nome_da_sede;
      }else{
          Pais_da_sede = '';
          Cidade_da_sede = '';
          Nome_da_sede = '';
      }
  
        // NgbDate necesita 3 argumentos
        // const alarmDate = new Date(this.user?.Data_Nascimento);
        // const year = alarmDate.getFullYear();
        // const month = alarmDate.getMonth() + 1; 
        // const day = alarmDate.getDate();
      
      this.myForm.patchValue({
        ordem: this.user?.Ordem,
        name:  this.user?.name,
        lastName: this.user?.lastName,
        Nome_Completo: [this.user?.Nome_Completo,],
        Telefone1: this.user?.Telefone1,
        Data_Nascimento: this.user?.Data_Nascimento,
        // Data_Nascimento: new NgbDate(year, month, day),
        Email:   this.user?.Email,
        emailCongregatio: this.user?.emailCongregatio,
        Cidade_Nascimento:  this.user?.Cidade_Nascimento,
        Pais_Nascimento:  this.user?.Pais_Nascimento,
        Nacionalidade: this.user?.Nacionalidade,
        Residencia_atual: this.user?.Residencia_atual,
        observation: this.user?.observation,
        linkCongregatio: link,
        active: this.user.active,
        webAccess: this.user.webAccess,
        // Pais_da_sede: Pais_da_sede,
        // Cidade_da_sede: Cidade_da_sede,
        // Nome_da_sede: Nome_da_sede,
      });
  
        this.actualizarEstadoSwitch();
  
        this.user.role;
        this.roleSelected = this.user.role; 
        console.log(this.roleSelected);
     
    }
  
    getObjectProperties(): { key: string, value: any }[] {
      
      if(this.user){
        return Object.keys(this.user).map(key => ({ key, value: this.user![key as keyof User] }));
      }else if(this.userCongregatio){
        return Object.keys(this.userCongregatio).map(key => ({ key, value: this.userCongregatio[key] }));
      }
      return [{key:'', value:''}]
    }
  
    handleRoleChange( value:string ){
      this.roleSelected = value;
      const body = {role : value};
      this.user.role = value;
      this.userService.setRole( body, this.user.iduser ).subscribe(
        ( {success} )=>{
          if(success){
            this.successToast('Função atribuída com sucesso');
          }
        })
    }
  
  private subscription : Subscription;
  
    deleteUser( ){
  
      this.openDeleteModal('delUser');
  
      this.subscription = this.userService.authDelUser$.pipe(take(1)).subscribe( (emmited)=>{ 
        if(emmited){
          this.isLoading = true;
  
          this.userService.deleteUser( this.idUser ).subscribe(
            ( {success} )=>{
                if(success){
                  this.isLoading = false;
                  this.successToast('Usuário removido com sucesso');
                  setTimeout(()=>{ this.router.navigateByUrl('dashboard/usuarios')},700)
                }
            })
        }else{
          this.subscription.unsubscribe();
        } 
      })
      
    }

    openDeleteModal( action:string ){
      this.dialog.open(DeleteModalComponent,{
        maxWidth: (this.phone) ? "98vw": '',
        panelClass: "custom-modal-picture",    
        data: { component: "edit-user", action }
        });
    }
  
  activeDeacTive($event : MatSlideToggleChange): void{
  
    if(this.roleSelected !== 'webmaster'){
  
       // verifico que el usuario pertenezca a alguna propulsion, cuando se registra todavia no pertenece a ninguna
        const idpropulsao = this.myForm.get('idpropulsao')?.value;
        if(!idpropulsao || idpropulsao === ''){
          this.warningToast("Seleciona propulsao. O usuário não pôde ser ativado");
          $event.source.checked = false;
          return
        }
   }
  
    this.isChecked = $event.checked;
    this.isLoading = true;
  
    const email = this.myForm.get('Email')?.value;
    let active : any;
    (this.isChecked) ? active = '1' :  active = '0';
    
    this.authService.activeAccount( email, active ).subscribe
    ( ({success})=>{
          if(success){
            (active === "1") ? this.successToast('Usúario ativado com sucesso')  : this.successToast('Usúario desativado com sucesso'); 
            //hago esto para q no vuelva a cargar todo
            this.userService.getUserById( this.user.iduser ).subscribe();
            setTimeout(()=>{ this.isLoading = false },700)
        
          }
        
          }) 
  }
  
  acceptBlockAccess($event : MatSlideToggleChange): void{
  
    this.isChecked = $event.checked;
  
    this.isLoading = true;
  
    const email = this.myForm.get('Email')?.value;
    let webAccess : any;
    (this.isChecked) ? webAccess = '1' :  webAccess = '0';
    
    this.authService.userWebAccess( email, webAccess ).subscribe
    ( ({success})=>{
          if(success){
            (webAccess === "1") ? this.successToast('Acceso de usuário permitido')  : this.successToast('Accesod e usuario resttingido '); 
            //hago esto para q no vuelva a cargar todo
            this.userService.getUserById( this.user.iduser ).subscribe();
            setTimeout(()=>{ this.isLoading = false },700)
        
          }
        
          }) 
  }
  
  simpleCode($event: MatSlideToggleChange) {
  
    this.simpleCodeSelected = $event.checked;
    
    const email = this.myForm.get('Email')?.value;
    
    if(!email || email === ''){
      return;
    }
    
    const body = {
      email,
      simpleCode: (this.simpleCodeSelected) ? 1 : 0
    }
  
      this.authService.simpleCode(body).subscribe( 
        ( {success} )=>{
          if(success){
             (this.simpleCodeSelected) ?  this.successToast('Código simples ativado'): this.successToast('Código simples desativado') ;
                  
          }
        });
    
  }
  
  telephone: string = '';
  
  selectUser(user: any){
  
    user = { ...user, iduser: this.user.iduser};
    this.userCongregatio = user;
  
    console.log(user);
  
    this.pathImg =`https://congregatio.info/${user['Ruta Imagen']}`
  
    //back values references
    const backFullName = user['Nome Completo'];
    const backPhone = user.Telefone1;
    let backBirthday = user['Data Nacimento'];
    const backEmailCongregatio = user['Email'];
    const backNationality = user.Nacionalidade;
    const backCidade = user['Cidade Nascimento'];
    const backPais = user['País Nascimento'];
    const backActualAddress = user['Residência atual'];
    const backSede = user['Sede onde entrou'];
    const backOrdem = user['Ordem'];
    this.telephone = backPhone;
  
      // NgbDate necesita 3 argumentos
      backBirthday = moment(backBirthday, 'DD/MM/YY').format('YYYY-MM-DD HH:mm:ss'); //viene un string del back, no date
      // const dateToconvert = new Date(backBirthday);
      // const year = dateToconvert.getFullYear();
      // const month = dateToconvert.getMonth() + 1; 
      // const day = dateToconvert.getDate();
      // const dataFormatted = new NgbDate(year, month, day);
  
    // Definir los campos y sus valores iniciales (cámbialos según tu formulario)
      const fields = [
        { name: 'Nome_Completo', backValue: backFullName },
        { name: 'Telefone1', backValue: backPhone },
        { name: 'Data_Nascimento', backValue: backBirthday },
        { name: 'emailCongregatio', backValue: backEmailCongregatio },
        { name: 'Cidade_Nascimento', backValue: backCidade },
        { name: 'Pais_Nascimento', backValue: backPais },
        { name: 'Nacionalidade', backValue: backNationality },
        { name: 'Residencia_atual', backValue: backActualAddress },
        { name: 'Nome_da_sede', backValue: backSede },
        { name: 'ordem', backValue: backOrdem },
      ];
  
      // Iterar sobre los campos
      fields.forEach(field => {
        const formControl = this.myForm.get(field.name);
  
        // console.log(field.name, field.backValue);
        // if(field.name === 'Telefone1' && (field.backValue === '' || field.backValue === `""` ) ){
        //   alert('sintel')
  
        // }
        if (formControl instanceof FormControl) {
          if (field.backValue !== null && field.backValue !== undefined) {
  
  
            formControl.setValue(field.backValue);
            
            this.readonlyFields[field.name] = true;
          } else {
        
            this.readonlyFields[field.name] = false;
          }
        }
      });
      this.wasLinked = true;
  }
  
  onSlideToggleChange( $event : MatSlideToggleChange){
  
    this.stateLink = $event.checked;
    
    if(this.stateLink) {
      this.isLinkedToCongregatio = true;
    }else{ 
      this.isLinkedToCongregatio = false;
    }
  }
  
  private actualizarEstadoSwitch() {
  
      (this.user.linkCongregatio === 1) ? this.checkCongregation = true : this.checkCongregation = false;
  
  }
  
  resendPassword(){
  
  const email = this.myForm.get('Email')?.value;
  
  if(!email || email === '')return;
  this.isLoading = true;
  this.authService.resendPasword(email).subscribe(
    ( {success} )=>{
      if(success){
         this.isLoading = false;
         this.successToast('Senha foi reenviada com sucesso')
      }
    })
  }
  
  // img user
  uploadImg( ){
  
    if (this.selectedImg) {
      this.imageUploadService.uploadUserImg(this.selectedImg, this.user.iduser).subscribe( 
        ( {success} )=> {
            if(success){
              setTimeout(()=>{this.isLoading = false });
              this.selectedImg = null;
            } }
        )
  }
  
  }
  
  onFileSelected(event: any) {
    this.selectedImg = event.target.files[0];
    this.showPreview();
  }
  
  showPreview() {
    const reader = new FileReader();
  
    reader.onload = (event: any) => {
      this.pathImg = event.target.result;
      this.showClose = true;
    };
  
    if (this.selectedImg) {
      reader.readAsDataURL(this.selectedImg);
    }
  }
  
  removePreview(){
  
  
    if(this.user.Ruta_Imagen === '' || this.user.Ruta_Imagen === null ){
      this.pathImg = 'assets/no-image.jpg';
    }else{
      this.pathImg = this.user.Ruta_Imagen;
    }
    this.showClose = false;
  
  }
  // img user
  
  
  openModalFichaCompleta(  ){

    let userFichaCompleta: any;
    let origin: any;
  
    if(this.user && this.userCongregatio){
        userFichaCompleta = this.userCongregatio;
        origin = 'congregatio';
      }else if(this.user && !this.userCongregatio){
        userFichaCompleta = this.user;
        origin = 'group'
      }
     this.dialog.open(ViewCongregatioModalComponent,{
      maxWidth: (this.phone) ? "98vw": '',
      panelClass: "custom-modal-picture",    
      data: { user: userFichaCompleta, origin  }
      });
  }
  
  successToast( msg:string){
    this.toastr.success(msg, 'Sucesso!!', {
      positionClass: 'toast-bottom-right', 
      timeOut: 2000, 
      messageClass: 'message-toast',
      titleClass: 'title-toast'
    });
  }
  
  showDupla : boolean = false;
  showUserDupla : boolean = false;
  userDupla: any | null = null;
  
  
  selectedDupla(){

    const authorizedRoles = ['admin', 'super_admin'];

    if( !authorizedRoles.includes(this.user.role)){
      this.warningToast('Você precisa ser um administrador ou superadministrador para realizar esta ação')
      return
    }

    const dupla = this.myForm.get('dupla')?.value;
  
    console.log(this.userDupla);
    // si ya hay una dupla q no haga nada
    if(dupla && dupla === 'Dupla' && this.userDupla){
      alert('aca')
      return
    }
  
  
    if(dupla && dupla === 'Dupla' ){
      this.showDupla = true;
    }else if(dupla && dupla === 'Upla'){
      this.showDupla = false;
      this.showUserDupla = false;
      this.userDupla = null;
      this.userService.deleteDupla(this.user.iduser).subscribe(
          ( {success })=>{
            if(success){
              this.warningToast('Dupla eliminada com sucesso')
            }
          })
    }
  }
  
  searchUser(){


    const dialogRef = this.dialog.open(SearchUserModalComponent,{
      maxWidth: (this.phone) ? "97vw": '800px',
      maxHeight: (this.phone) ? "90vh": '90vh',
      // data: {fonte}
    });
  
    dialogRef.afterClosed().subscribe(user => {
      if (user) {
          this.showDupla = false;
          this.showUserDupla = true;
          this.userDupla = user;
    
          const body = {
                iduser_1: this.user.iduser,
                iduser_2: user.iduser
          }
          this.userService.createDupla( body ).subscribe(
            ( {success })=>{
              if(success){
                this.successToast('Dupla criada com sucesso')
              }
            })
      } 
    });
  
  }
  
  getDupla( id:any){
    this.userService.getDupla( id).subscribe(
      ({success, dupla})=>{
        if(success){
          this.showUserDupla = true;
          this.userDupla = dupla;
          this.myForm.get('dupla')?.setValue('Dupla');
        }else{
          this.myForm.get('dupla')?.setValue('Upla');
          this.userDupla = null;
        }
      })
  }
  
  viewUserDupla( user:any ){

    const origin = 'group'
     this.dialog.open(ViewCongregatioModalComponent,{
      maxWidth: (this.phone) ? "98vw": '',
      panelClass: "custom-modal-picture",    
      data: { user, origin  }
      });
  
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
  
  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }else if(this.authsubscriber){
      this.authsubscriber.unsubscribe();
    }
  }
  
  
  }
  
    
