import { Component, OnDestroy, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { getDataSS, saveDataSS } from './storage';
import { Subscription } from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CookieConsentComponent } from './pages/cookie-consent/cookie-consent/cookie-consent.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  
})

export class AppComponent implements OnInit {

  title = 'Modernize Angular Admin Tempplate';
  
  constructor(
              private cookieService : CookieService,
              private authService : AuthService,
              private router : Router,
              private _bottomSheet: MatBottomSheet,

             )
  
  {

  }
  
  ngOnInit(): void {


    this.initCookies()
  const token = this.cookieService.get('token');
  const session = getDataSS('session')

  //quiere decir q tiene la opcion de guardar las credenciales y que no esta en la misma session
    if (token &&  !session) {
        this.authService.checkJsonWebToken(token).subscribe(
          ({message, user})=>{
            if(message === 'Token válido.' && user.role === 'admin'){
              this.router.navigateByUrl('dashboards/dashboard1');
              saveDataSS('session', 'true')
            }else if(message === 'Token válido.' && user.role === 'user'){
              saveDataSS('user', user )
              this.router.navigateByUrl('formulario');
            }
          })
    }

   

  }

 initCookies(): void {
    const consent = this.cookieService.get('CookieConsent');
    console.log(consent);
    if (consent === 'accepted') {
      this.cookieService.set('NonEssentialCookie', 'value', 365, '/'); // Set non-essential cookies
    }else if(!consent){
      this._bottomSheet.open(CookieConsentComponent),{
        panelClass: 'full-screen-bottom-sheet'
      };

    
    }
  }




}
