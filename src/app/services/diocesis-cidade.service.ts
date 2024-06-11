import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class DiocesisCidadeService {


  
  private baseUrl = environment.baseUrl;
  
  authDelCity$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelDiocese$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelCityDiocese$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  successDelCityDiocese$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  successAddCityToDiocese$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  reloadCitiesDiocese$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  


  constructor(
              private http : HttpClient,

  )       

  {  }


  postCity( body:any ){
    
    return this.http.post<any>(`${this.baseUrl}api/city/postCity`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from postCity service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  getAllCities(  ){
    
    return this.http.get<any>(`${this.baseUrl}api/city/getAllCities`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getAllCities service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  searchCity(  query:any ){
    
    return this.http.get<any>(`${this.baseUrl}api/city/searchCity?querySearch= ${query}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from searchCity service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  getCityById( id:any,  ){
    
    return this.http.get<any>(`${this.baseUrl}api/city/getCityById/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getCityById service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  deleteCityById( id:any){
    
    return this.http.delete<any>(`${this.baseUrl}api/city/deleteCityById/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from deleteCityById service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  editCityById( id:any, body:any ){
    
    return this.http.put<any>(`${this.baseUrl}api/city/editCityById/${id}`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from editCityById service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  createDiocese( body:any ){
    
    return this.http.post<any>(`${this.baseUrl}api/diocese/createDiocese`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from createDiocese service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  getAllDioceses(  ){
    
    return this.http.get<any>(`${this.baseUrl}api/diocese/getAllDioceses`) 
    
    .pipe(
      tap( ( res) => { console.log("from getAllDioceses service: ", res); } ),            
      map( res => res )
    )

  }
  
  editDioceseById( id:any, body:any ){
    
    return this.http.put<any>(`${this.baseUrl}api/diocese/editDioceseById/${id}`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from editDioceseById service: ",res);
                }  
      ),            
      map( res => res )
    )

  }


  deleteDioceseById( id:any ){
    
    return this.http.delete<any>(`${this.baseUrl}api/diocese/deleteDioceseById/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from deleteDioceseById service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  getCitiesFromDiocese( id:any ){
    
    return this.http.get<any>(`${this.baseUrl}api/diocese/getCitiesFromDiocese/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getCitiesFromDiocese service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  deleteCityFromDiocese( id:any ){
    
    return this.http.patch<any>(`${this.baseUrl}api/diocese/deleteCityFromDiocese/${id}`, null) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from deleteCityFromDiocese service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  addCityToDiocese( id:any, body:any ){
    
    return this.http.post<any>(`${this.baseUrl}api/diocese/addCityToDiocese/${id}`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from addCityToDiocese service: ",res);
                }  
      ),            
      map( res => res )
    )

  }
}
