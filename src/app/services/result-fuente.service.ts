import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ResultFuenteService {


  private baseUrl = environment.baseUrl;
  
  authDelResult$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelFonte$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelResultFonte$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  successDelResultFonte$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  successAddResultToFonte$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  


  constructor(
              private http : HttpClient,

  )       

  {  }


  createResult( body:any ){
    
    return this.http.post<any>(`${this.baseUrl}api/result/createResult`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from createResult service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  getAllResults(  ){
    
    return this.http.get<any>(`${this.baseUrl}api/result/getAllResults`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getAllResults service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  // searchResult(  query:any ){
    
  //   return this.http.get<any>(`${this.baseUrl}api/result/searchResult?querySearch= ${query}`) 
    
  //   .pipe(
  //     tap( ( res) =>{
  //                   console.log("from searchResult service: ",res);
  //               }  
  //     ),            
  //     map( res => res )
  //   )

  // }

  // getResultById( id:any ){
    
  //   return this.http.get<any>(`${this.baseUrl}api/result/getResultById/${id}`) 
    
  //   .pipe(
  //     tap( ( res) =>{
  //                   console.log("from getResultById service: ",res);
  //               }  
  //     ),            
  //     map( res => res )
  //   )

  // }

  deleteResultById( id:any ){
    
    return this.http.delete<any>(`${this.baseUrl}api/result/deleteResultById/${id}`) 
    .pipe(
      tap( ( res) =>{
                    console.log("from deleteResultById service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  editResultById( id:any, body:any ){
    
    return this.http.put<any>(`${this.baseUrl}api/result/editResultById/${id}`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from editResultById service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  createFonte( body:any ){
    
    return this.http.post<any>(`${this.baseUrl}api/fonte/createFonte`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from createFuente service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  getAllFuentes(  ){
    
    return this.http.get<any>(`${this.baseUrl}api/fonte/getAllFontes`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getAllFuentes service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  editFonteById( id:any, body:any ){
    
    return this.http.put<any>(`${this.baseUrl}api/fonte/editFonteById/${id}`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from editFonteById service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  deleteFonteById( id:any ){

    return this.http.delete<any>(`${this.baseUrl}api/fonte/deleteFonteById/${id}`) 
    .pipe(
      tap( ( res) =>{
                    console.log("from deleteFonteById service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  getResultsFromFonte( id:any ){
    
    return this.http.get<any>(`${this.baseUrl}api/fonte/getResultsFromFonte/${id}`) 
    .pipe(
      tap( ( res) =>{
                    console.log("from getResultsFromFonte service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  deleteResultFromFonte( id:any ){
    
    return this.http.delete<any>(`${this.baseUrl}api/fonte/deleteResultFromFonte/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from deleteResultFromFonte service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  addResultToFonte( id:any, body:any ){
    
    return this.http.post<any>(`${this.baseUrl}api/fonte/addResultToFonte/${id}`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from addResultToFonte service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  activePauseResultado( id:any, action:any ){
    return this.http.patch<any>(`${this.baseUrl}api/result/activePauseResultado/${id}?action=${action}`, null) 
    .pipe(
      tap( ( res) =>{
                    console.log("from activePauseResultado service: ",res);
                }  
      ),            
      map( res => res )
    )
  }



}
