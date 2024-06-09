import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, filter, map, tap } from 'rxjs';
import { User } from '../shared/models/user.models';
import { AppState } from '../shared/redux/app.reducer';
import { LocalstorageService } from './localstorage.service';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  authDelDocument$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelBulkDocument$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelUploadDocument$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelBulkUploadDocument$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelUser$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authAddRole$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  closeDocumentModal$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  resetDocumentUpload$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  reloadDocuments$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  selectAllDocuments$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  deSelectAllDocuments$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  deleteSelectedDocuments$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  downloadSelectedDocuments$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  
  changeMenuStates$ = new BehaviorSubject(null)
  



  token : string = '';
  user! : User;
  private baseUrl = environment.baseUrl;

  constructor(
                private http : HttpClient,
                private store : Store <AppState>,
                private cookieService: CookieService,
                private localStorageService : LocalstorageService,
                private router : Router
  ) { }



  getUserById( id:any ){

    return this.http.get<any>(`${this.baseUrl}api/user/getUserById/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getUserById service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  createUser( body:User ){

    return this.http.post<any>(`${this.baseUrl}api/user/createUser`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from createUser service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  getAllUsers( ){

    return this.http.get<any>(`${this.baseUrl}api/user/getAllUsers`) 
    .pipe(
      tap( ( res) =>{
                    console.log("from getAllUsers service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  createDupla( body:any ){

    return this.http.post<any>(`${this.baseUrl}api/user/createDupla`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from createDupla service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  getDupla( id:any){

    return this.http.get<any>(`${this.baseUrl}api/user/getDupla/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getDupla service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  deleteDupla( id:any){
    return this.http.delete<any>(`${this.baseUrl}api/user/deleteDupla/${id}`) 
    .pipe(
      tap( ( res) =>{
                    console.log("from deleteDupla service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  getAllDuplas( ){

    return this.http.get<any>(`${this.baseUrl}api/user/getAllDuplas`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getAllDuplas service: ",res);
                }  
      ),            
      map( res => res )
    )
  }



  getAllActiveUsers( ){

    return this.http.get<any>(`${this.baseUrl}api/user/getAllActiveUsers`) 
    .pipe(
      tap( ( res) =>{
                    console.log("from getAllActiveUsers service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  getAllDeactiveUsers( ){

    return this.http.get<any>(`${this.baseUrl}api/user/getAllDeactiveUsers`) 
    .pipe(
      tap( ( res) =>{
                    console.log("from getAllDeactiveUsers service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  getWebmasters( ){

    return this.http.get<any>(`${this.baseUrl}api/user/getWebmasters`) 
    .pipe(
      tap( ( res) =>{
                    console.log("from getWebmasters service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  getAdmins( ){

    return this.http.get<any>(`${this.baseUrl}api/user/getAdmins`) 
    .pipe(
      tap( ( res) =>{
                    console.log("from getAdmins service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  getAllUsersQuantity( ){

    return this.http.get<any>(`${this.baseUrl}api/user/getAllUsersQuantity`) 
    .pipe(
      tap( ( res) =>{
                    console.log("from getAllUsersQuantity service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  getDocByUserId( id:any ){

    return this.http.get<any>(`${this.baseUrl}api/document/getDocByUserId/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getDocByUserId service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  getDocumentById( id:any ){

    return this.http.get<any>(`${this.baseUrl}api/document/getDocumentById/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getDocumentById service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  uploadDocument( id:any , file:any){

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.baseUrl}api/document/uploadDocument/${id}`, formData) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from uploadDocument service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  bulkUploadDocuments( id:any , files:any){

    console.log(files);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    console.log(formData);

    return this.http.post<any>(`${this.baseUrl}api/document/bulkUploadDocuments/${id}`, formData) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from bulkUploadDocuments service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  deleteDocById( id:any ){

    return this.http.patch<any>(`${this.baseUrl}api/document/deleteDocById/${id}`, null) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from deleteDocById service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  deleteUser( id:any ){

    return this.http.patch<any>(`${this.baseUrl}api/user/deleteUser/${id}`, null) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from deleteUser service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  editUserById( id:any, body:any ){

    return this.http.put<any>(`${this.baseUrl}api/user/updateUser/${id}`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from editUserById service: ",res);
                }  
      ),            
      map( res => res )
    )
  }
  
  editUserCongregatio( id:any, body:any ){

    return this.http.put<any>(`${this.baseUrl}api/user/updateUserCongregatio/${id}`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from editUserCongregatio service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  setRole( body:any,id:any  ){

    return this.http.patch<any>(`${this.baseUrl}api/user/setRole/${id}`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from setRole service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  downloadZip(selectedIds: any) {
    
    const options = {
      responseType: 'blob' as const,
    };
  
    return this.http.post(`${this.baseUrl}api/document/generateAndDownloadZIP`, { selectedIds }, options)
      .pipe(
        filter((res: Blob) => res.size > 0),
        tap((res: Blob) => {
          // La respuesta contiene datos
          console.log("from downloadZip service:", res);
  
          // Crea un enlace (link) para descargar el archivo
          const downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(res);
          downloadLink.download = 'archivo.zip';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          
        }),
        map((res: Blob) => {
          return { success: true };
        })
      );
  }


  searchUser( query:any ){

    return this.http.get<any>(`${this.baseUrl}api/user/searchUser?querySearch=${query}`) 
    
    .pipe(
      tap( ( {users}) =>{
                    console.log("from searchUser service: ", users);
                }  
      ),            
      map( res => res )
    )
  }





}