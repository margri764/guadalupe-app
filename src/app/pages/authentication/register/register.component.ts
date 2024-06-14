import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from 'src/app/shared/models/user.models';
import * as moment from 'moment';
import { delay } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { NgbDate, NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { ValidateService } from 'src/app/services/validate.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports:[CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  myForm!: FormGroup;
  submitted : boolean = false;
  succesSignup : boolean = false;
  isLoading : boolean = false;
  arrBackground : any []=[];
  backgroundImage : string = '';

  constructor(
              private fb : FormBuilder,
              private authService : AuthService,
              private errorService : ErrorService,
              private validatorService : ValidateService,
              private imageUploadService : ImageUploadService,
              private router : Router,
              public toastr: ToastrService,
              private cookieService: CookieService,
  ) {

   }

  ngOnInit(): void {

    if (this.cookieService.check('token')) {
      this.cookieService.delete('token', '/');    
    }

    this.getInitBackground();

    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));
    
    this.myForm = this.fb.group({
      Nome_Completo:  [ '', [Validators.required]],
      email:     [ '', [Validators.required, Validators.pattern(this.validatorService.emailPattern)]],
      Data_Nascimento:  [ '', [Validators.required]],
      Telefone1:  [ '', [Validators.required]],
      Cidade_da_sede:  [ '', [Validators.required]],
      Nome_da_sede:  [ '', [Validators.required]],
      Pais_da_sede:  [ '', [Validators.required]],
    });

  }

  register(){

    this.errorService.close$.next(true);
    this.errorService.close$.next(false);
    
    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return;
    }

  

    const Data_Nascimento = this.myForm.get('Data_Nascimento')?.value;
    const momentDate = new Date( Data_Nascimento.year, Data_Nascimento.month - 1, Data_Nascimento.day );
    
    let birthdayFormatted = null;

    if(Data_Nascimento !== null && Data_Nascimento !== ''){
      // birthdayFormatted = moment(momentDate).format('YYYY-MM-DD');
      birthdayFormatted = moment(momentDate).toISOString();;
    }else{
      birthdayFormatted = null;
    }
    
    const body : User = {
            ...this.myForm.value,
            Data_Nascimento: birthdayFormatted
    }

    this.isLoading = true;

    console.log(body);
    this.authService.signUp(body).subscribe( 
      ( {success} )=>{
          if(success){
            this.successToast('Enviamos um e-mail de verificação, por favor, acesse o link.')
            setTimeout(()=>{ this.isLoading = false; },700)
              this.myForm.reset();
              setTimeout(()=>{ this.router.navigateByUrl('/login') },1900)
          }
    })

  }


  getInitBackground(){
    this.imageUploadService.getAllBackground().subscribe(
      ( {success, backgrounds} )=>{
        if(success){
          this.arrBackground = backgrounds.filter((background:any) => background.active === 1);
          this.arrBackground = this.arrBackground.map( (doc:any) => {
            const fileName = doc.filePath.split('/').pop();
            const serverURL = 'https://arcanjosaorafael.org/backgrounds/';
            return {
              ...doc,
              filePath: `${serverURL}${fileName}`
            };
          });
          
          this.changeBackground()
          
        }
      })
    }

    changeBackground(): void {
      var fondoAleatorio =  this.arrBackground[Math.floor(Math.random() * this.arrBackground.length)];
      this.backgroundImage = fondoAleatorio.filePath;
      this.backgroundImage = this.backgroundImage.replace(/\(/g, '%28').replace(/\)/g, '%29');
    }
  
    
    successToast( msg:string){
      this.toastr.success(msg, 'Sucesso!!', {
        positionClass: 'toast-bottom-right', 
        timeOut: 3500, 
        messageClass: 'message-toast',
        titleClass: 'title-toast'
      });
    }
    
  

  validField( field: string ) {
    const control = this.myForm.get(field);
    return control && control.errors && control.touched;
}


}
