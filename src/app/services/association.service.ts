import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssociationService {


  private baseUrl = environment.baseUrl;
    
  authDelAssociation$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelFonte$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelAssociationFonte$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelCreditardFromAsso$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  successDelAssociationFonte$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  successAddAssociationToFonte$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  successAddCardToAssociation$ : EventEmitter<boolean> = new EventEmitter<boolean>; 


  constructor(
              private http : HttpClient,

  )       

  {  }


  createAssociation( body:any,  file:File ){

    const JSONbody = JSON.stringify(body)
    const formData = new FormData();
    formData.append("file", file )
    formData.append("body", JSONbody )
    
    return this.http.post<any>(`${this.baseUrl}api/association/createAssociation`, formData) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from createAssociation service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  getAllAssociations(  ){
    
    return this.http.get<any>(`${this.baseUrl}api/association/getAllAssociations`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getAllAssociations service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  searchAssociation(  query:any ){
    
    return this.http.get<any>(`${this.baseUrl}api/association/searchAssociation?querySearch= ${query}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from searchAssociation service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  getAssociationById( id:any ){
    
    return this.http.get<any>(`${this.baseUrl}api/association/getAssociationById/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getAssociationById service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  deleteAssociationById( id:any ){
    
    return this.http.delete<any>(`${this.baseUrl}api/association/deleteAssociationById/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from deleteAssociationById service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  editAssociationById( id:any, body:any, file:File){

      const JSONbody = JSON.stringify(body)
      const formData = new FormData();
      formData.append("file", file )
      formData.append("body", JSONbody )
    
    return this.http.put<any>(`${this.baseUrl}api/association/editAssociationById/${id}`, formData) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from editAssociationById service: ",res);
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

    return this.http.patch<any>(`${this.baseUrl}api/fonte/deleteFonteById/${id}`, null) 
    .pipe(
      tap( ( res) =>{
                    console.log("from deleteFonteById service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  getAssociationsFromFonte( id:any ){
    
    return this.http.get<any>(`${this.baseUrl}api/fonte/getAssociationsFromFonte/${id}`) 
    .pipe(
      tap( ( res) =>{
                    console.log("from getAssociationsFromFonte service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  deleteAssociationFromFonte( id:any ){
    
    return this.http.patch<any>(`${this.baseUrl}api/fonte/deleteAssociationFromFonte/${id}`, null) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from deleteAssociationFromFonte service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  addAssociationToFonte( id:any, body:any ){
    
    return this.http.post<any>(`${this.baseUrl}api/fonte/addAssociationToFonte/${id}`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from addAssociationToFonte service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  activePauseAssociationado( id:any, action:any ){
    return this.http.patch<any>(`${this.baseUrl}api/association/activePauseAssociationado/${id}?action=${action}`, null) 
    .pipe(
      tap( ( res) =>{
                    console.log("from activePauseAssociationado service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

    
  getAllUnits( ){
    return this.http.get<any>(`${this.baseUrl}api/unit/getAllUnits`) 
    .pipe(
      tap( ( res) =>{
                    console.log("from getAllUnits service: ",res);
                }  
      ),            
      map( res => res )
    )
  }
  getUnitsTimestamp( ){
    return this.http.get<any>(`${this.baseUrl}api/unit/getUnitsTimestamp`) 
    .pipe(
      tap( ( res) =>{
                    console.log("from getUnitsTimestamp service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  sincroUnitsGoogleSheet( ){
    return this.http.post<any>(`${this.baseUrl}api/unit/sincroUnitsGoogleSheet`, null) 
    .pipe(
      tap( ( res) =>{
                    console.log("from getAllUnsincroUnitsGoogleSheetits service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  deleteCardFromAssociation( id:any ){
  
    return this.http.delete<any>(`${this.baseUrl}api/association/deleteCardFromAssociation/${id}`) 
    .pipe(
      tap( ( res) =>{  console.log("from deleteCardFromAssociation service: ",res) }  
      ),            
      map( res => res )
    )
  }

  getCardsFromAssociation( id:any ){

    return this.http.get<any>(`${this.baseUrl}api/association/getCardsFromAssociation/${id}`) 
    .pipe(
      tap( ( res) =>{  console.log("from getCardsFromAssociation service: ",res) }  
      ),            
      map( res => res )
    )
  }

  addCardToAssociation( id:any, body:any ){

    return this.http.post<any>(`${this.baseUrl}api/association/addCardToAssociation/${id}`, body) 
    .pipe(
      tap( ( res) =>{  console.log("from addCardToAssociation service: ",res) }  
      ),            
      map( res => res )
    )
  }



}
