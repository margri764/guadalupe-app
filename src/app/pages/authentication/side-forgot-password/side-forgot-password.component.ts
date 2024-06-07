import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { ValidateService } from 'src/app/services/validate.service';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { delay } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-forgot-password.component.html',
})

export class AppSideForgotPasswordComponent implements OnInit {

  options = this.settings.getOptions();
  isLoading : boolean = false;
  showLabel : boolean = false;
  phone : boolean = false;

  constructor(
                private settings: CoreService, 
                private router: Router,
                private validatorService : ValidateService,
                private authService : AuthService,
                private errorService : ErrorService

              ) 
  {
    (screen.width < 800) ? this.phone = true : this.phone = false;


   }

   form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(this.validatorService.emailPattern)]),
  });



  ngOnInit(): void {
    this.errorService.closeIsLoading$.pipe(delay(700)).subscribe( (emitted) => { if(emitted){this.isLoading = false}});
  
  }


  get f() {
    return this.form.controls;
  }

  submit() {
    this.isLoading = true;
    const email = this.form.get('email')?.value;
    this.authService.resendPasword(email).subscribe(
      ( {success} )=>{
        if(success){
          setTimeout(()=>{ this.isLoading = false },1000)
          this.showLabel = true;
        }
      })
  }
}
