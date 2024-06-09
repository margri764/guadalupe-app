import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs';
import { AppState } from '../shared/redux/app.reducer';
import { LocalstorageService } from './localstorage.service';
import { User } from '../shared/models/user.models';


@Injectable({
  providedIn: 'root'
})
export class CongregatioService {



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



  searchUserCongregatio( query:any ){

    return this.http.get<any>(`${this.baseUrl}api/congregatio/searchUserCongregatio?querySearch=${query}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from searchUserCongregatio service: ", res);
                }  
      ),            
      map( res => res )
    )
  }

  getUserCongregatioById( id:any ){

    return this.http.get<any>(`${this.baseUrl}api/congregatio/getUserByIdCongregatio/${id}`) 
    
    .pipe(
      tap( ( {users}) =>{
                    console.log("from getUserCongregatioById service: ", users);
                }  
      ),            
      map( res => res )
    )
  }

  
  getCongregatioTimestamp(  ){

    return this.http.get<any>(`${this.baseUrl}api/congregatio/getCongregatioTimestamp`) 
    
    .pipe(
      tap( ( res) =>{
        console.log("from getCongregatioTimestamp service: ", res);
    }  
),  
     
      map( res => res )
    )
  }




}
