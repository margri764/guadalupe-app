import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { ValidateService } from 'src/app/services/validate.service';
import { ErrorService } from 'src/app/services/error.service';
import { delay } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-side-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './side-register.component.html',
})

export class AppSideRegisterComponent implements OnInit {

  options = this.settings.getOptions();
  showLabel : boolean = false;
  isLoading : boolean = false;
  phone : boolean = false;

  constructor(
                private settings: CoreService, 
                private router: Router,
                private authService : AuthService,
                private validatorService : ValidateService,
                private errorService : ErrorService,
                
             )
  {
  (screen.width < 800) ? this.phone = true : this.phone = false;

    this.errorService.closeIsLoading$.pipe(delay(700)).subscribe( (emitted) => { if(emitted){this.isLoading = false}});
    
  }
  
  
  ngOnInit(): void {
  }

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(this.validatorService.emailPattern)]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {

    if (this.form.invalid) {
      this.form.markAllAsTouched(); 
      return;
    }

    this.isLoading = true;

    this.authService.signUp(this.form.value).subscribe( 
      ( {success} )=>{
        if(success){
          this.showLabel = true;
          this.isLoading = false;
          this.showAskAlert();
          
        }
      })
  }

  showAskAlert(){

    Swal.fire({
      icon: "info",
      title: "Verifique seu email",
      text: "Verifique seu email, enviamos uma senha para você. Vá em Login para inserir seu e-mail e senha!",
    }).then((result) => {
      if (result.isConfirmed) {
       
        this.router.navigateByUrl('/login')
      }
    });;
  }

  }

