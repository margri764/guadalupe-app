import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog } from '@angular/material/dialog';
import { ContactusModalComponent } from '../pages/authentication/modals/contactus-modal/contactus-modal/contactus-modal.component';

interface response  {
  emmited: boolean,
  msg: string
}

interface response401Credentials  {
  emmited: boolean,
  msg: string,
  remainingAttempts: number
}

interface response400Credentials  {
  emmited: boolean,
  msg: string,
  remainingAttempts: number
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private baseUrl = environment.baseUrl;
  phone : boolean = false;
  
  close$ = new BehaviorSubject<boolean>(false) ;//quiero a ce cierren todos los modals cuando se produce un error de servidor 
  authDelTempOrder$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  closeIsLoading$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  closeNotAnswerLogin$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  noVerifiedError$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  noRoleError$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  labelInvalidCredential$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  status429Error$ : EventEmitter<response> = new EventEmitter<response>; 
  status500Error$ : EventEmitter<response> = new EventEmitter<response>; 
  status400VerifyError$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  repitedPayment$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  status401Credentials$ : EventEmitter<response401Credentials> = new EventEmitter<response401Credentials>; 
  status401WronCode$ : EventEmitter<response> = new EventEmitter<response>; 
  backIsDown$ : EventEmitter<response> = new EventEmitter<response>; 
  
  constructor(
              private router : Router,
              public toastr: ToastrService,
              private cookieService : CookieService,
              private dialog : MatDialog


  ) { 
  }

  getError(error : any) {
    console.log(error);

    if(error){
      this.closeNotAnswerLogin$.emit(true);
    }

    if (error.statusText === "Unknown Error" ) {
      const title = 'Erro Interno do Servidor';
      const msg = 'Desculpe, algo deu errado em nosso servidor.';
      const footer = 'Por favor, tente novamente mais tarde';
      this.showErrorSwal( title, msg, footer )
      this.closeIsLoading$.emit(true);
      return of(null);
    }




    if (error.status === 401 && error.error.message === "Você precisa de um papel de super role para concluir esta ação") {
      const title = 'Ação de Segurança';
      const msg = 'Você precisa de um papel de super role para concluir esta ação';
      const footer = 'Esta ação está restrita';
      this.showErrorSwal( title, msg, footer )
      this.closeIsLoading$.emit(true);
      return of(null);
    }

    if (error.status === 401 && error.error.message === "Você precisa de um papel de web master para concluir esta ação") {
      const title = 'Ação de Segurança';
      const msg = 'Você precisa de um papel de web master para concluir esta ação';
      const footer = 'Esta ação está restrita';
      this.showErrorSwal( title, msg, footer )
      this.closeIsLoading$.emit(true);
      return of(null);
    }

    if (error.status === 401 && error.error.message === "Você precisa de um papel de admin o super admin para concluir esta ação") {
      const title = 'Ação de Segurança';
      const msg = error.error.message;
      const footer = 'Esta ação está restrita';
      this.showErrorSwal( title, msg, footer )
      this.closeIsLoading$.emit(true);
      return of(null);
    }

    // if (error.status === 401 && error.error.message === "Invalid Token") {
    //     this.logoutInvalidToken();
    //     this.close$.next(true);
    //     this.close$.next(false);
    //     this.closeIsLoading$.emit(true);
    //   return of(null);
    // }

    if (error.status === 401 && error.error.message === "Código de autenticação incorreto") {
      this.closeIsLoading$.emit(true);
      this.status401WronCode$.emit({emmited: true, msg:error.error.message});
      this.errorToast(error.error.message);
      return of(null);
  }

    
  if (error.status === 401 && error.error.message === "O código de autenticação expirou. É necessário um novo código") {
    this.closeIsLoading$.emit(true);
    this.status401WronCode$.emit({emmited: true, msg:error.error.message});
    this.errorToast(error.error.message)
    return of(null);
  }


    if (error.status === 401 && error.error.message === "Credenciais incorretas") {
      let customMessage : any;

      //si el erro es por email no tiene el attemp
      if(error.error.remainingAttempts){
        customMessage = `Credenciais incorretas! Você tem mais ${error.error.remainingAttempts} tentativas para inserir a senha corretamente`;
      }else{
        customMessage = error.error.message
      }
      
      this.errorToast(customMessage)
  
      this.closeIsLoading$.emit(true);
       return of(null);
    }


    if (error.status === 400 && error.error.message === 'Usuário não encontrado' ) {
      this.errorToast(error.error.message)
      this.closeIsLoading$.emit(true);
     return of(null);
   }

 
    if (error.status === 400 && error.error.message === 'Sua conta não está ativa.' ) {
      this.errorToast(error.error.message);

      this.showErrorSwal( "Restrição"  , "Sua conta não está ativa.","Entre em contato com um administrador")
   
      this.closeIsLoading$.emit(true);
     return of(null);
   }


if (error.status === 500 && error.error.error === 'Ocorreu um erro fora do nosso sistema, por favor, tente novamente mais tarde'){
  this.closeIsLoading$.emit(true);
  this.errorToast(error.error.error);
  return of(null);
}

                                                    
  if (error.status === 500 && error.error.error === 'Usuário não encontrado' ) {
    this.toastr.error(error.error.error, 'Erro!', {
      positionClass: 'toast-bottom-right', 
      closeButton: true,
      timeOut: 3500, 
    });
     this.closeIsLoading$.emit(true);
    //  this.status500Error$.emit({emmited:true, msg: error.error.error });
    return of(null);
  }

 //errores de eliminar
  if (error.status === 500 && error.error.message.includes('Falha ao eliminar')){
    this.closeIsLoading$.emit(true);
    this.errorUpRightToast(error.error.message);
  return of(null);
  }

  if (error.status === 429 && error.error.message.includes("Você excedeu o limite de tentativas de login") ) {
    this.toastr.error(error.error.message, 'Erro!', {
      positionClass: 'toast-bottom-right', 
      closeButton: true,
      timeOut: 3500, 
    });
      this.closeIsLoading$.emit(true);
      return of(null);
  }
    
  if (error.status === 500) {
    this.closeIsLoading$.emit(true);
      alert("Error en el back")
      // this.openDialogBackendDown();
      return of(null);
  }

  if (error.status === 403 && error.error.message==="Credenciales invalidas." ) {
      this.closeIsLoading$.emit(true);
      this.labelInvalidCredential$.emit(true);
      return of(null);
  }

  if (error.status === 404 ) {
       this.showErrorSwal('Não foi possível concluir a ação', 'No foram encontrados resultados na base de dados', ''  )
      this.closeIsLoading$.emit(true);
      return of(null);
  }



    if (error.status === 400 && error.error.message === "E-mail já em uso. Por favor, escolha um diferente" ) {
     this.closeIsLoading$.emit(true);
     this.errorToast(error.error.message)
      return of(null);
    }



    if (error.status === 400 && error.error.message === "E-mail já em uso. Por favor, escolha um diferente" ) {
     this.closeIsLoading$.emit(true);
     this.errorToast(error.error.message)
      return of(null);
    }

    
    if (error.status === 400 && error.error.message.includes("Repita o pagamento" )) {
      this.closeIsLoading$.emit(true);
       this.repitedPayment$.emit(true);
       this.errorToast(error.error.message)
       return of(null);
     }
    

    if (error.status === 400 && error.error.message === "Usuário não verificado" ) {
      this.status400VerifyError$.emit(true);
      this.closeIsLoading$.emit(true);
       return of(null);
     }
       
    if (error.status === 400  ) {
      const customMessage = "Ops! Algo deu errado, por favor, tente novamente";
        this.errorToast(error.error.message)
        this.closeIsLoading$.emit(true);
        return of(null);
    }
  
    // Devuelve un observable que emite el error original
    return throwError(() => error);

  }

  errorToast( error:string){
    this.toastr.error(error, 'Erro!', {
      positionClass: 'toast-bottom-right', 
      closeButton: true,
      timeOut: 3500, 
    });
  }

  errorUpRightToast( error:string){
    this.toastr.error(error, 'Erro!', {
      positionClass: 'toast-top-right', 
      closeButton: true,
      timeOut: 3500, 
    });
  }

  infoToast( error:string){
    this.toastr.info(error, 'Info!', {
      positionClass: 'toast-bottom-right', 
      closeButton: true,
      timeOut: 3500, 
      messageClass: 'toast-custom',
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
      if (result.isConfirmed && footer === 'Entre em contato com um administrador') {
        this.openDialogContactUs()
      }
    });
  }

  warningToast( msg:string){
    this.toastr.warning(msg, 'Verificar!!', {
      positionClass: 'toast-bottom-right', 
      timeOut: 3500, 
      messageClass: 'message-toast',
      titleClass: 'title-toast'
    });
  }

  openDialogContactUs() {
    this.dialog.open(ContactusModalComponent, {
      width: '500px',
    });
  }
 

  logout(){
          localStorage.removeItem("logged");
          localStorage.removeItem("user");
          sessionStorage.removeItem("user");
          sessionStorage.removeItem('session');

          if (this.cookieService.check('token')) {
            this.cookieService.delete('token', '/');    
          }
          this.router.navigateByUrl('/autenticacao/login'); 
  }

 
  


  

}
