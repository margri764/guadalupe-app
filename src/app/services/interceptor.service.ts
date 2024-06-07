import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorService } from './error.service';
// import { ErrorService } from '../error/error.service';


@Injectable({
  providedIn: 'root'
})
export class InterceptorService {

  user : boolean = false;
  token : any;
  
    constructor(
                private errorService : ErrorService
              )
  { }
  
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle( req.clone() )
    .pipe(
      catchError((error : HttpErrorResponse ) => this.errorHandle(error) )
    );
  }
  errorHandle( error: HttpErrorResponse ) {
  
    console.log(error);
  
    const errorMessage = this.errorService.getError(error);
  
    if (error.status === 200 && error.error && error.error.text === "Sesion finalizada") {
       this.errorService.logout();
    }
  
    return throwError( () => errorMessage)
  }
  
  }
  
  