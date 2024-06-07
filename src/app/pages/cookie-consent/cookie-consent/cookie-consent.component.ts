import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialogRef } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule, MaterialModule, MatBottomSheetModule],
  templateUrl: './cookie-consent.component.html',
  styleUrl: './cookie-consent.component.scss'
})
export class CookieConsentComponent implements OnInit {

  showMore:boolean = false;

  constructor(
                private cookieService : CookieService,
                private matBottomShhetRef : MatBottomSheetRef<CookieConsentComponent>


  ){}

  ngOnInit(): void {

  }


  
  acceptCookies(): void {
    this.cookieService.set('CookieConsent', 'accepted', 365);
    this.cookieService.set('EssentialCookie', 'true', 365, '/');
  }

  declineCookies(): void {
    this.cookieService.set('CookieConsent', 'declined', 365);
    this.removeNonEssentialCookies();
  }

  get consentGiven(): boolean {
    return this.cookieService.check('CookieConsent');
  }

  private removeNonEssentialCookies(): void {
    // Add logic to remove non-essential cookies
    this.cookieService.delete('NonEssentialCookie', '/'); // Example
  }

  close(){
    this.matBottomShhetRef.dismiss();
  }



}
