import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, OnInit, Renderer2 } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Observable, map, tap } from 'rxjs';
import * as authActions from 'src/app/shared/redux/auth.actions'
import Swal from 'sweetalert2';
import { User } from '../shared/models/user.models';
import { AppState } from '../shared/redux/app.reducer';
import { LocalstorageService } from './localstorage.service';
import { saveDataSS } from '../shared/storage';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  closeLoginWebmaster$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  editNameInBradcrumb$ : EventEmitter<any> = new EventEmitter<any>; 
  successLoginAs$ : EventEmitter<any> = new EventEmitter<any>; 


  token : string = '';
  user! : User;
  private baseUrl = environment.baseUrl;
  notAnswer : boolean = true;
  private gMapKey = environment.googleMaps;


  constructor(
                private http : HttpClient,
                private store : Store <AppState>,
                private cookieService: CookieService,
                private localStorageService : LocalstorageService,
                private router : Router
  ) { }



  getUserLogs( id:any ){
  
    return this.http.get<any>(`${this.baseUrl}api/auth/getUserLogs/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from ipgetUserLogsInfo service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  setUserLogs( body:any ){
  
    return this.http.post<any>(`${this.baseUrl}api/auth/setUserLogs`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from setUserLogs service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  simpleCode( body : any){
  
    return this.http.patch<any>(`${this.baseUrl}api/auth/simpleCode`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from simpleCode service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  login( body:any){

    const intervalId = setInterval(() => {
      if (this.notAnswer) {
          this.showErrorSwal("Está demorando muito, por favor aguarde...", "O serviço de mensagens está demorando muito para enviar o e-mail","")
      }
      clearInterval(intervalId); 
    }, 10000); 


    return this.http.post<any>(`${this.baseUrl}api/auth/login`, body) 
    
    .pipe(
      tap( ( {user, token, success, firstlogin, webmaster}) =>{

              this.notAnswer = false;

            //si es el primer login el back devuelve el user sino no lo devuelve xq espera q se autentique con el codigo
            if(success && firstlogin === "true"){

              if (this.cookieService.check('token')) {
                this.cookieService.delete('token', '/');    
              }
              if (this.cookieService.check('token')) {
                const title = 'Erro interno do navegador';
                const msg = 'No foi possível concluir esta ação, tente novamente';
                const footer = 'Por favor, tente novamente';
                this.showErrorSwal( title, msg, footer );
              }else{
                  this.token = token;
                  this.cookieService.set('token', token, {path:'/'});
                  this.user = user;
                  this.store.dispatch(authActions.setUser({user}));
                  const userToSS = { name: user.Nome_Completo, role:user.role, email: user.Email, Ruta_Imagen: user.Ruta_Imagen, iduser:user.iduser, idpropulsao: user.idpropulsao};
                  saveDataSS('user', userToSS);

                }
                          
            }
                    
       }  
      ),            
      map( res => {console.log("from login Service: ",res);return res} )
    )
  }

  doubleAuth( body:any ){
  
    return this.http.post<any>(`${this.baseUrl}api/auth/doubleAuth`, body) 
    
    .pipe(
      tap( ( {user, token, success}) =>{
                      if(success){
                        if (this.cookieService.check('token')) {
                          this.cookieService.delete('token', '/');    
                        }
                        if (this.cookieService.check('token')) {
                          const title = 'Erro interno do navegador';
                          const msg = 'No foi possível concluir esta ação, tente novamente';
                          const footer = 'Por favor, tente novamente';
                          this.showErrorSwal( title, msg, footer );
                        }else{
                            this.token = token;
                            this.cookieService.set('token', token, {path:'/'});
                            this.user = user;
                            this.store.dispatch(authActions.setUser({user}));
                            const userToSS = { name: user.Nome_Completo, role:user.role, email: user.Email, Ruta_Imagen: user.Ruta_Imagen, iduser:user.iduser, idpropulsao: user.idpropulsao};
                            saveDataSS('user', userToSS);
          
                          }
                      }
                }  
      ),            
      map( res => {console.log("from doubleAuth Service: ",res);return res} )
    )
  }

  signUp(body:User){
    
    return this.http.post<any>(`${this.baseUrl}api/auth/signUp`, body) 
    
    .pipe(
      tap( ( res) =>{
                     
                    console.log("from signUp Service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  resendPasword(email: string){
    const body = {email}
  
    return this.http.post<any>(`${this.baseUrl}api/auth/resendPassword`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from resendPasword service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  contactUs(body: string){

    return this.http.post<any>(`${this.baseUrl}api/auth/adminContactUs`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from contactUs service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  validateEmail(body: any){

    return this.http.post<any>(`${this.baseUrl}api/auth/validateEmail`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from validateEmail service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  verifyEmail( email: string){

    const body = { email}

    return this.http.post<any>(`${this.baseUrl}api/auth/verifyEmail`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from verifyEmail service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  activeAccount(email:string, active:string){

    const body = { email }

    return this.http.post<any>(`${this.baseUrl}api/auth/activeAccount?active=${active}`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from activeAccount service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  

  userWebAccess(email:string, webAccess:string){

    const body = { email }

    return this.http.patch<any>(`${this.baseUrl}api/auth/userWebAccess?access=${webAccess}`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from userWebAccess service: ",res);
                }  
      ),            
      map( res => res )
    )
  }


  getRequestedPermissions(){

    return this.http.get<any>(`${this.baseUrl}api/auth/checkRegistrationPermission`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getRequestedPermissions service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  onOffPropulsaoWebmaster( propulsao:any ){
    
    return this.http.patch<any>(`${this.baseUrl}api/webmaster/onOffPropulsaoWebmaster?propulsao=${propulsao}`, null) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from onOffPropulsaoWebmaster service: ",res);
                }  
      ),            
      map( res => res )
    )

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
      }
    });
  }

  getAddressByCoords ( lat: string, lng : string) {

    return this.http.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.gMapKey}`)
    .pipe(
     map( res =>  res)
         );
   }
   
  

  getToken(){
    return this.token
  }
  
  getCookieToken() {
    return this.cookieService.get('token');
  }
}
