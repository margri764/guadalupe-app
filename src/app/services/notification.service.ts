import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient,  } from '@angular/common/http';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {


    authDeleteAllNotifications$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  
    private baseUrl = environment.baseUrl;
  
    constructor(
                  private http : HttpClient,
                  private errorService : ErrorService,
               ) 
    {
  
     }
  
    getAllNotifications( ){

      return this.http.get<any>(`${this.baseUrl}api/notification/getAllNotifications`,) 
      .pipe(
        map( res => {console.log("from getAllNotifications Service: ",res); return res} )
      )
    }

    getAllNotificationsUnread( ){

      return this.http.get<any>(`${this.baseUrl}api/notification/getAllNotificationsUnread`,) 
      .pipe(
        map( res => {console.log("from getAllNotificationsUnread Service: ",res); return res} )
      )
    }

    deleteNotificationById( id:any){
      return this.http.delete<any>(`${this.baseUrl}api/notification/deleteNotificationById/ ${id}`,) 
      .pipe(
        map( res => {console.log("from deleteNotificationById Service: ",res); return res} )
      )
    }
   
    deleteAllNotifications( ){
      return this.http.delete<any>(`${this.baseUrl}api/notification/deleteAllNotifications`,) 
      .pipe(
        map( res => {console.log("from deleteAllNotifications Service: ",res); return res} )
      )
    }
   
    markNotificationRead( id:any){
      return this.http.patch<any>(`${this.baseUrl}api/notification/markNotificationRead/ ${id}`, null) 
      .pipe(
        map( res => {console.log("from markNotificationRead Service: ",res); return res} )
      )
    }

    bulkMarkNotificationRead( ){
      return this.http.patch<any>(`${this.baseUrl}api/notification/bulkMarkNotificationRead`, null) 
      .pipe(
        map( res => {console.log("from bulkMarkNotificationRead Service: ",res); return res} )
      )
    }
   

}