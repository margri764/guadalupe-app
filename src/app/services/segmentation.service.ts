import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SegmentationService {


  authDelEmailSegmentation$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelAddressSegmentation$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelPhoneSegmentation$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authLoadLStorage$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelTratamento$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelProfession$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelRelationship$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authRemplaceTitularRelacao$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  


  private baseUrl = environment.baseUrl;

  constructor(
                private http : HttpClient,
  ) { }


  
  getAllEmailSegmentation(  ){

    return this.http.get<any>(`${this.baseUrl}api/user/getAllEmailSegmentation`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getAllEmailSegmentation service: ", res);
                }  
      ),            
      map( res => res )
    )
  }

  createEmailSegmentation( body:any  ){

    return this.http.post<any>(`${this.baseUrl}api/user/createEmailSegmentation`, body) 
    
    .pipe(
      tap( res =>{
                    console.log("from createEmailSegmentation service: ", res);
                }  
      ),            
      map( res => res )
    )
  }

  editEmailSegmentationById( id:any, body:any  ){

    return this.http.put<any>(`${this.baseUrl}api/user/editEmailSegmentationById/${id}`, body) 
    
    .pipe(
      tap( res =>{
                    console.log("from createEmailSegeditEmailSegmentationByIdmentation service: ", res);
                }  
      ),            
      map( res => res )
    )
  }

  deleteEmailSegmentationById( id:any  ){

    return this.http.patch<any>(`${this.baseUrl}api/user/deleteEmailSegmentationById/${id}`, null) 
    
    .pipe(
      tap( res =>{
                    console.log("from deleteEmailSegmentationById service: ", res);
                }  
      ),            
      map( res => res )
    )
  }


  getAllAddressSegmentation(  ){

    return this.http.get<any>(`${this.baseUrl}api/user/getAllAddressSegmentation`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getAllAddressSegmentation service: ", res);
                }  
      ),            
      map( res => res )
    )
  }

  createAddressSegmentation( body:any  ){

    return this.http.post<any>(`${this.baseUrl}api/user/createAddressSegmentation`, body) 
    
    .pipe(
      tap( res =>{
                    console.log("from createAddressSegmentation service: ", res);
                }  
      ),            
      map( res => res )
    )
  }

  editAddressSegmentationById( id:any, body:any  ){

    return this.http.put<any>(`${this.baseUrl}api/user/editAddressSegmentationById/${id}`, body) 
    
    .pipe(
      tap( res =>{
                    console.log("from editAddressSegmentationById service: ", res);
                }  
      ),            
      map( res => res )
    )
  }

  deleteAddressSegmentationById( id:any  ){

    return this.http.patch<any>(`${this.baseUrl}api/user/deleteAddressSegmentationById/${id}`, null) 
    
    .pipe(
      tap( res =>{
                    console.log("from deleteAddressSegmentationById service: ", res);
                }  
      ),            
      map( res => res )
    )
  }


    
  getAllPhoneSegmentation(  ){

    return this.http.get<any>(`${this.baseUrl}api/user/getAllPhoneSegmentation`) 
    
    .pipe(
      tap( ( {users}) =>{
                    console.log("from getAllPhoneSegmentation service: ", users);
                }  
      ),            
      map( res => res )
    )
  }

  createPhoneSegmentation( body:any  ){

    return this.http.post<any>(`${this.baseUrl}api/user/createPhoneSegmentation`, body) 
    
    .pipe(
      tap( res =>{
                    console.log("from createPhoneSegmentation service: ", res);
                }  
      ),            
      map( res => res )
    )
  }

  editPhoneSegmentationById( id:any, body:any  ){

    return this.http.put<any>(`${this.baseUrl}api/user/editPhoneSegmentationById/${id}`, body) 
    
    .pipe(
      tap( res =>{
                    console.log("from editPhoneSegmentationById service: ", res);
                }  
      ),            
      map( res => res )
    )
  }

  deletePhoneSegmentationById( id:any  ){

    return this.http.patch<any>(`${this.baseUrl}api/user/deletePhoneSegmentationById/${id}`, null) 
    
    .pipe(
      tap( res =>{
                    console.log("from deletePhoneSegmentationById service: ", res);
                }  
      ),            
      map( res => res )
    )
  }

  
  createTratamento( body:any ){
    
    return this.http.post<any>(`${this.baseUrl}api/tratamentoProfession/createTratamento`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from createTratamento service: ", res);
                }  
      ),            
      map( res => res )
    )
  }

  editTratamentoById( id:any, body:any ){
    
    return this.http.put<any>(`${this.baseUrl}api/tratamentoProfession/editTratamentoById/${id}`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from editTratamentoById service: ", res);
                }  
      ),            
      map( res => res )
    )
  }

  getAllTratamentos( ){
    
    return this.http.get<any>(`${this.baseUrl}api/tratamentoProfession/getAllTratamentos`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getAllTratamentos service: ", res);
                }  
      ),            
      map( res => res )
    )
  }

  deleteTratamentoById( id: any){
    
    return this.http.delete<any>(`${this.baseUrl}api/tratamentoProfession/deleteTratamentoById/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from deleteTratamentoById service: ", res);
                }  
      ),            
      map( res => res )
    )
  }
  
  createProfession( body:any ){
    
    return this.http.post<any>(`${this.baseUrl}api/tratamentoProfession/createProfession`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from createProffesion service: ", res);
                }  
      ),            
      map( res => res )
    )
  }

  editProfessionById( id:any, body:any ){
    
    return this.http.put<any>(`${this.baseUrl}api/tratamentoProfession/editProfessionById/${id}`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from editProfessionById service: ", res);
                }  
      ),            
      map( res => res )
    )
  }

  getAllProfessions( ){
    
    return this.http.get<any>(`${this.baseUrl}api/tratamentoProfession/getAllProfessions`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getAllProfessions service: ", res);
                }  
      ),            
      map( res => res )
    )
  }

  deleteProfessionById( id: any){
    
    return this.http.delete<any>(`${this.baseUrl}api/tratamentoProfession/deleteProfessionById/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from deleteProfessionById service: ", res);
                }  
      ),            
      map( res => res )
    )
  }

  createRelationship( body:any ){
    
    return this.http.post<any>(`${this.baseUrl}api/tratamentoProfession/createRelationship`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from createRelationship service: ", res);
                }  
      ),            
      map( res => res )
    )
  }

  editRelationshipById( id:any, body:any ){
    
    return this.http.put<any>(`${this.baseUrl}api/tratamentoProfession/editRelationshipById/${id}`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from editRelationshipById service: ", res);
                }  
      ),            
      map( res => res )
    )
  }

  getAllRelationships( ){
    
    return this.http.get<any>(`${this.baseUrl}api/tratamentoProfession/getAllRelationships`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getAllRelationships service: ", res);
                }  
      ),            
      map( res => res )
    )
  }

  deleteRelationshipById( id: any){
    
    return this.http.delete<any>(`${this.baseUrl}api/tratamentoProfession/deleteRelationshipById/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from deleteRelationshipById service: ", res);
                }  
      ),            
      map( res => res )
    )
  }


}
