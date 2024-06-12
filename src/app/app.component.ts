import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './services/auth.service';
import { ActivationEnd, Router } from '@angular/router';
import { getDataSS, saveDataSS } from './storage';
import { Subscription, filter, take } from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialogRef } from '@angular/material/dialog';
import { LocalstorageService } from './services/localstorage.service';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  
})

export class AppComponent implements OnInit {

  title = 'Guadalupe';
  isLoading : boolean = false;
  user: any;
  msg : string = '';
  phone : boolean = false; 
  remainingAttemps : number = 0;
  
  show400 : boolean = false;
  show401 : boolean = false;
  show404 : boolean = false;
  show429 : boolean = false;
  show500 : boolean = false;
  showBackDown : boolean = false;

  constructor(
                public router : Router,
                private localStorageService : LocalstorageService,

){


  
  (screen.width <= 800) ? this.phone = true : this.phone = false;


  
  this.router.events.pipe(
    filter(event => event instanceof ActivationEnd),
    take(1)
    ).subscribe((event) => {
      const activationEndEvent = event as ActivationEnd; 
      const url = activationEndEvent.snapshot.url.toString(); // Obtener la URL como string
      const user = getDataSS('user');
    
    if (!url.includes('verificar-email')) {
      if (!user) {
        this.router.navigateByUrl('/login');
      }
    } 
  });


}

@ViewChild('drawer') drawer!: MatDrawer;
private drawerSubscription!: Subscription;

openDrawer() {
  this.drawer.open();
}


ngOnInit(): void {

  this.localStorageService.loadInitialState();
}  



}
