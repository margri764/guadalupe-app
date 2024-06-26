import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Subject, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AlarmGroupService {

  // private openDrawerSource = new Subject<void>();
  // openDrawer$ = this.openDrawerSource.asObservable();

  // openDrawer() {
  //   this.openDrawerSource.next();
  // }


  private baseUrl = environment.baseUrl;

  authDelGroup$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelUserGroup$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelAlarm$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelPersonalAlarm$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelGrupalAlarm$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  successDelUserGroup$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  successAssignUserGroup$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  successCreatedAlarm$ : EventEmitter<boolean> = new EventEmitter<boolean>; 

  constructor(
              private http : HttpClient,

  )       

  {  }


  createGroup( body:any ){
    
    return this.http.post<any>(`${this.baseUrl}api/group/createGroup`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from createGroup service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  createAlarm( body:any ){
    
    return this.http.post<any>(`${this.baseUrl}api/alarm/createAlarm`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from createAlarm service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  getUsersFromGroup( id:any ){
    
    return this.http.get<any>(`${this.baseUrl}api/group/getUsersFromGroup/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getUsersFromGroup service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  searchUserInGroup( id:any, query:any ){
    
    return this.http.get<any>(`${this.baseUrl}api/group/searchUserInGroup/${id}?querySearch= ${query}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from searchUserInGroup service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

 

  getAllAlarms(){
    
    return this.http.get<any>(`${this.baseUrl}api/alarm/getAllAlarms`) 
    .pipe(
      tap( ( res) =>{
                    console.log("from getAllAlarms service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  getUpcomingAlarms(){
    return this.http.get<any>(`${this.baseUrl}api/alarm/getUpcomingAlarms`) 
    .pipe(
      tap( ( res) =>{ console.log("from getUpcomingAlarms service: ",res) }  
      ),            
      map( res => res )
    )
  }

  getAlarmByUser( id:any ){
    
    return this.http.get<any>(`${this.baseUrl}api/alarm/getAlarmByUser/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getAlarmByUser service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  getAlarmById( id:any ){
    
    return this.http.get<any>(`${this.baseUrl}api/alarm/getAlarmById/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getAlarmById service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  deleteAlarm( id:any ){
    
    return this.http.delete<any>(`${this.baseUrl}api/alarm/deleteAlarm/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from deleteAlarm service: ",res);
                }  
      ),            
      map( res => res )
    )

  }


  
  activePauseAlarm( id:any, action:any ){
    return this.http.patch<any>(`${this.baseUrl}api/alarm/activePauseAlarm/${id}?action=${action}`, null) 
    .pipe(
      tap( ( res) =>{
                    console.log("from activePauseAlarm service: ",res);
                }  
      ),            
      map( res => res )
    )
  }
  
  deleteUserFromGroup( id:any ){
    
    return this.http.patch<any>(`${this.baseUrl}api/group/deleteUserFromGroup/${id}`, null) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from deleteUserFromGroup service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  setUserGroups( id:any, body:any ){
    
    return this.http.post<any>(`${this.baseUrl}api/group/setUserGroups/${id}`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from setUserGroups service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  getAllGroups(){
    
    return this.http.get<any>(`${this.baseUrl}api/group/getAllGroups`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getAllGroups service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  getGroupByUserId( id:any ){
    
    return this.http.get<any>(`${this.baseUrl}api/group/getGroupByUserId/${id}`) 
    .pipe(
      tap( ( res) =>{
                    console.log("from getGroupByUserId service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  editGroupById( id:any, body:any ){
    
    return this.http.put<any>(`${this.baseUrl}api/group/updateGroupById/${id}`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from editGroupById service: ",res);
                }  
      ),            
      map( res => res )
    )

  }


  editAlarm( id:any, body:any ){
    
    return this.http.put<any>(`${this.baseUrl}api/alarm/editAlarm/${id}`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from editAlarm service: ",res);
                }  
      ),            
      map( res => res )
    )

  }



  deleteGroup( id:any ){
    
    return this.http.delete<any>(`${this.baseUrl}api/group/deleteGroup/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from deleteGroup service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

}
