import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrawersService {

  private openDrawerDioceseSubject = new BehaviorSubject<boolean>(false);
  openDrawerDiocese$: Observable<boolean> = this.openDrawerDioceseSubject.asObservable();
  private closeDrawerDioceseSubject = new BehaviorSubject<boolean>(false);
  closeDrawerDiocese$: Observable<boolean> = this.closeDrawerDioceseSubject.asObservable();

  private openDrawerFonteSubject = new BehaviorSubject<boolean>(false);
  openDrawerFonte$: Observable<boolean> = this.openDrawerFonteSubject.asObservable();
  private closeDrawerFonteSubject = new BehaviorSubject<boolean>(false);
  closeDrawerFonte$: Observable<boolean> = this.closeDrawerFonteSubject.asObservable();

  private openDrawerAdminSubject = new BehaviorSubject<boolean>(false);
  openDrawerAdmin$: Observable<boolean> = this.openDrawerAdminSubject.asObservable();
  private closeDrawerAdminSubject = new BehaviorSubject<boolean>(false);
  closeDrawerAdmin$: Observable<boolean> = this.closeDrawerAdminSubject.asObservable();



  

  openDrawerDiocese() {
    this.openDrawerDioceseSubject.next(true);
  }

  closeDrawerDiocese() {
    this.closeDrawerDioceseSubject.next(true);
  }

  openDrawerFonte() {
    this.openDrawerFonteSubject.next(true);
  }

  closeDrawerFonte() {
    this.closeDrawerFonteSubject.next(true);
  }

  openDrawerAdmin() {
    this.openDrawerAdminSubject.next(true);
  }

  closeDrawerAdmin() {
    this.closeDrawerAdminSubject.next(true);
  }



  constructor() { }


}
