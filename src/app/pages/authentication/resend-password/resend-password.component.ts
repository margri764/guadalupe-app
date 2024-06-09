import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, delay } from 'rxjs';
import { NoVerifiedModalComponent } from '../modals/noVerified-modal/no-verified-modal/no-verified-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { ValidateService } from 'src/app/services/validate.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-resend-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule],
  templateUrl: './resend-password.component.html',
  styleUrls: ['./resend-password.component.scss']
})
export class ResendPasswordComponent implements OnInit {


  myForm!: FormGroup;
  submitted : boolean = false;
  showLogin: boolean = true;
  isLoading : boolean = false;
  isSending : boolean = false;
  private noVerifySubscription : Subscription;
  noVerified : boolean = false;
  noRole : boolean = false;
  successContactUs : boolean = false;
  successResendPass : boolean = false;
  showResendPass : boolean = false;
  showSuccessResend : boolean = false;
  successResendVerify : boolean = false;
  backgroundImage : string = '';
  arrBackground : any []=[];
  phone : boolean = false;



  constructor(
              private fb : FormBuilder,
              private authService : AuthService,
              private errorService : ErrorService,
              private validatorService : ValidateService,
              public toastr: ToastrService,
              private modalService: NgbModal,
              private router : Router,
              private imageUploadService : ImageUploadService,
  ) {

    (screen.width < 800) ? this.phone = true : this.phone=false;
     
   }

  ngOnInit(): void {

    this.getInitBackground();

    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));

    this.noVerifySubscription = this.errorService.status400VerifyError$.pipe(delay(1000)).subscribe( (emmited)=>{ if(emmited){ this.openNoVerifiedModal() }  })

    this.myForm = this.fb.group({
      email: [ '', [Validators.required, Validators.pattern(this.validatorService.emailPattern)] ],
    });


  }

  get f() {
    return this.myForm.controls;
  }


// usario no verificado, toast con reenvio de email con password
reSendEmailPassword(){


    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return
    }
    
    const email = this.myForm.get('email')?.value;
    if(email === undefined || email === '' || email === null){
      return
    }
    this.isLoading = true;
    this.authService.resendPasword(email).subscribe(
      ({success})=>{
        if(success){
          this.isLoading = false;
          this.successToast('E-mail enviado com successo');
          this.router.navigateByUrl('/login')
        }
      })

}

   //no recibio el email para verificar
   openNoVerifiedModal(){

     this.modalService.open(NoVerifiedModalComponent,{
          backdrop: 'static', 
          keyboard: false,    
          centered: true,
          windowClass: 'custom-modal-verify',
          size: "md"
     });
   }

// por si pide una reenvio de contraseña y todavia no esta verficado  
verifyEmail(){
  
  this.errorService.close$.next(true);
  this.errorService.close$.next(false);

  if ( this.myForm.invalid ) {
    this.myForm.markAllAsTouched();
    return
  }
  this.isLoading = true
  const email = this.myForm.get("email")?.value;
    
  this.authService.verifyEmail(email).subscribe(
    ( {success} )=>{
      if(success){
        setTimeout(()=>{ 
          this.isLoading = false; 
          this.successToast('Pronto para fazer login!');
        },700);
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
  



  //  validField(field: string) {
  //   const control = this.myForm.get(field);
  //   return control && control.errors && control.touched;
  // }

  validFieldResend(field: string) {
    const control = this.myForm.get(field);
    return control && control.errors && control.touched;
  }
  
    //  me desuscribo al timer
    ngOnDestroy(): void {
 
      
      if(this.noVerifySubscription){
          this.noVerifySubscription.unsubscribe()
      }
    }
  

}