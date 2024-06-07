import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth.service';
import { ValidateService } from 'src/app/services/validate.service';

@Component({
  selector: 'app-contactus-modal',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './contactus-modal.component.html',
  styleUrl: './contactus-modal.component.scss'
})
export class ContactusModalComponent {

  myForm : FormGroup;
  isLoading : boolean = false;

  constructor(
              private fb : FormBuilder,
              private validatorService : ValidateService,
              private authService : AuthService,
              public dialogRef: MatDialogRef<ContactusModalComponent>,
              public toastr: ToastrService,

            )
  
  {
    this.myForm = this.fb.group({
      fullName:  [ '', [Validators.required]],
      description:  [ '', [Validators.required]],
      email:     [ '', [Validators.required,Validators.pattern(this.validatorService.emailPattern)] ],
  
    });
  }

  get f() {
    return this.myForm.controls;
  }

  onSave(){

    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched(); 
      return;
    }

    this.isLoading = true;

    this.authService.adminContactUs(this.myForm.value).subscribe(
      ( {success} )=>{
          if(success){
            this.isLoading = false;
            this.dialogRef.close();
            this.successToast('Email enviado com sucesso. Em breve entraremos em contato com você.');

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




}
