import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { ErrorService } from 'src/app/services/error.service';
import { saveDataSS } from 'src/app/storage';


@Component({
    selector: 'app-home-phone',
    standalone: true,
    templateUrl: './home-phone.component.html',
    styleUrl: './home-phone.component.scss',
    imports: [CommonModule, MaterialModule, RouterModule]
})
export class HomePhoneComponent implements OnInit {

  @ViewChild ('display' , {static: true} ) display! : ElementRef;

  phone : boolean = false;
  isLoading : boolean = false;
  


constructor(
            private errorService : ErrorService,
            private router : Router

          )
{

}

  ngOnInit(): void {

  }

  goToPayment(){
    saveDataSS('tabSelected', 'inscription');
    this.router.navigateByUrl('/formulario')
  }

  goToHotel(){
    saveDataSS('tabSelected', 'hotel');
    this.router.navigateByUrl('/formulario')
  }

  goToProfile(){
    saveDataSS('tabSelected', 'profile');
    this.router.navigateByUrl('/formulario')
  }



  logout(){
    this.errorService.logout();
   }

  goToTop(){
    setTimeout( () => {
      this.display.nativeElement.scrollIntoView(
      { 
        alignToTop: true,
        block: "center",
      });
     }
    )
  }



 

}
