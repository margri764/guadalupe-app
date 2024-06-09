import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropulsaoService {



  private baseUrl = environment.baseUrl;
  
  // authDelCity$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelPropulsao$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  resetDioceseDrawer$ : EventEmitter<boolean> = new EventEmitter<boolean>;
  authNewPropulsaoCreation$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  // successDelCityDiocese$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  // successAddCityToDiocese$ : EventEmitter<boolean> = new EventEmitter<boolean>; 


  constructor(
              private http : HttpClient,

  )       

  {  }


  createPropulsao( body:any ){
    
    return this.http.post<any>(`${this.baseUrl}api/propulsao/createPropulsao`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from createPropulsao service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  getAllPropulsaos(  ){
    
    return this.http.get<any>(`${this.baseUrl}api/propulsao/getAllPropulsaos`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getAllPropulsaos service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  deletePropulsaoById( id:any ){
    
    return this.http.patch<any>(`${this.baseUrl}api/propulsao/deletePropulsaoById/${id}`, null) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from deletePropulsaoById service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

 editPropulsaoById( id:any, body:any ){
    
    return this.http.put<any>(`${this.baseUrl}api/propulsao/editPropulsaoById/${id}`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from editPropulsaoById service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  configPropulsaoById( id:any, body: any ){
    
    return this.http.post<any>(`${this.baseUrl}api/propulsao/configPropulsaoById/${id}`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from configPropulsaoById service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  getPropulsaoAdmins(  ){
    
    return this.http.get<any>(`${this.baseUrl}api/propulsao/getPropulsaoAdmins`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getPropulsaoAdmins service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  addPropulsao( body:any ){

    return this.http.post<any>(`${this.baseUrl}api/propulsao/addPropulsao`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from addPropulsao service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  


}
