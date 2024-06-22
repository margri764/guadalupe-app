import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { delay } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { AppState } from 'src/app/shared/redux/app.reducer';
import { getDataSS } from 'src/app/shared/storage';

@Component({
  selector: 'app-lockscreen',
  standalone: true,
  templateUrl: './lockscreen.component.html',
  imports:[ CommonModule, ReactiveFormsModule],
  styleUrls: ['./lockscreen.component.scss']
})
export class LockscreenComponent implements OnInit {

  myForm! : FormGroup
  isLoading : boolean = false;
  phone : boolean = false;
  profilePicture : string = "assets/no-image.jpg";
  name : string = "";
  
    constructor(
                private fb : FormBuilder,
                private authService : AuthService,
                private router : Router,
                private errorService : ErrorService,
                private store : Store <AppState>
    ) {

    (screen.width <= 800) ? this.phone = true : this.phone = false;

      
      this.myForm = this.fb.group({
        email:  [ '', [Validators.required]],
        password:  [ '', [Validators.required]],
      });
      
      this.isLoading = false;
  
    }
  
    ngOnInit(): void {
  
      this.errorService.closeIsLoading$.pipe(delay(1200)).subscribe( (emitted) => { if(emitted){this.isLoading = false}}) ;
  
  
      const user = getDataSS('user');
      if(user.email){
        this.name = user.name;
        this.getImage(user.Ruta_Imagen);
  
        this.myForm = this.fb.group({
          email:  [ user.email ],
          password:  [ '', [Validators.required]],
        });
      }
    }
  
    login(){
  
  
      if ( this.myForm.invalid ) {
        this.myForm.markAllAsTouched();
        return;
      }
  
      const email = this.myForm.get('email')?.value;
      const password = this.myForm.get('password')?.value;
      this.isLoading = true;
    
        const body = { 
          email: email, 
          password: password, 
          session: "true", 
          osInfo: null 
        }
    
          this.authService.login( body ).subscribe(
            ({success})=>{
              if(success){
                setTimeout(()=>{
                  this.isLoading = false;
                  this.router.navigateByUrl('/dashboard');
                }, 1200);
              }
              });
      }
    
      // this.authService.login( email, password, session ).subscribe(
      //   ({success})=>{
  
      //     if(success ){
      //       saveDataLS('logged', true);
      //       setTimeout(()=>{ 
      //           saveDataLS("shouldReloadPage", "true")
      //           this.router.navigateByUrl('/');
      //         },1700)
                
      //     }
      //     });
  
    getImage( path:string ){
      if(path.startsWith('/var/www/propulsao')){
        const fileName = path.split('/').pop();
        const serverURL = 'https://arcanjosaorafael.org/profilePicture/';
        this.profilePicture = `${serverURL}${fileName}`;
      }else{
        this.profilePicture= path;
      }
    }
  
  
    validField(field: string) {
      const control = this.myForm.get(field);
      return control && control.errors && control.touched;
    }
  
  
  }
  