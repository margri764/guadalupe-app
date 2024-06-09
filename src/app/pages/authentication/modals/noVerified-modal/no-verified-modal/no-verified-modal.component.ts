import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { delay } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { ValidateService } from 'src/app/services/validate.service';

@Component({
  selector: 'app-no-verified-modal',
  standalone: true,
  templateUrl: './no-verified-modal.component.html',
  styleUrls: ['./no-verified-modal.component.scss'],
  imports:[CommonModule, ReactiveFormsModule]
})
export class NoVerifiedModalComponent implements OnInit {

  @ViewChild('emailInput', { static: true }) emailInput: ElementRef;

  myFormResend!: FormGroup;
  isLoading : boolean = false;


  constructor(
              private fb : FormBuilder,
              private validatorService : ValidateService,
              private errorService : ErrorService,
              private authService : AuthService,
              public toastr: ToastrService,




  ) { 
    
    this.myFormResend = this.fb.group({
      resendEmail:     [ '', [Validators.required, Validators.pattern(this.validatorService.emailPattern)] ],
    });

  }


  

  ngOnInit(): void {

    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));

  }

    // por si pide una reenvio de contraseña y todavia no esta verficado  
    verifyEmail(){
    
      this.errorService.close$.next(true);
      this.errorService.close$.next(false);
  
      if ( this.myFormResend.invalid ) {
        this.myFormResend.markAllAsTouched();
        return
      }
      this.isLoading = true
      const email = this.myFormResend.get("resendEmail")?.value;
        
      this.authService.verifyEmail(email).subscribe(
        ( {success} )=>{
          if(success){
            setTimeout(()=>{ 
              this.successToast( "Para verificar seu e-mail, siga as instruções que enviamos.")
              this.isLoading = false; 
              this.close();
            },700);
          }
        })
    }

    successToast( msg:string){
      this.toastr.success(msg, 'Sucesso!!', {
        positionClass: 'toast-bottom-right', 
        timeOut: 3500, 
        messageClass: 'message-toast',
        titleClass: 'title-toast'
      });
    }
    

    close(){
      // this.activeModal.dismiss();
    }
  
  

    validFieldResend(field: string) {
      const control = this.myFormResend.get(field);
      return control && control.errors && control.touched;
    }
    
    

}
