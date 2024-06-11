import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {


  authDelCurrency$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  // authDelFonte$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  // authDelAssociationFonte$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  // successDelAssociationFonte$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  // successAddAssociationToFonte$ : EventEmitter<boolean> = new EventEmitter<boolean>; 

  private baseUrl = environment.baseUrl;

  constructor (
                private http : HttpClient
              )
  {

  }



  createCurrency( body:any ){
      
    return this.http.post<any>(`${this.baseUrl}api/currency/createCurrency`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from createCurrency service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  getAllCurrencies(  ){
    
    return this.http.get<any>(`${this.baseUrl}api/currency/getAllCurrencies`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getAllCurrencies service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  searchCurrency(  query:any ){
    
    return this.http.get<any>(`${this.baseUrl}api/currency/searchCurrency?querySearch= ${query}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from searchcursearchCurrencyrency service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  getCurrencyById( id:any ){
    
    return this.http.get<any>(`${this.baseUrl}api/currency/getCurrencyById/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getCurrencyById service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  deleteCurrencyById( id:any ){
    
    return this.http.delete<any>(`${this.baseUrl}api/currency/deleteCurrencyById/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from deleteCurrencyById service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  editCurrencyById( id:any, body:any ){
    
    return this.http.put<any>(`${this.baseUrl}api/currency/editCurrencyById/${id}`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from editcueditCurrencyByIdrrencyById service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  

}
