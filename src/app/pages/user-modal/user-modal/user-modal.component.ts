import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';
import { ImagenPathPipe } from "../../../pipe/imagen-path.pipe";
import { AuthService } from 'src/app/services/auth.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
    selector: 'app-user-modal',
    standalone: true,
    templateUrl: './user-modal.component.html',
    styleUrl: './user-modal.component.scss',
    imports: [CommonModule, MaterialModule, ReactiveFormsModule, NgScrollbarModule, RouterModule, TablerIconsModule, ImagenPathPipe]
})
export class UserModalComponent implements OnInit {

  user:any;
  myForm : FormGroup;
  isLoading : boolean = false;
  

  constructor(
               private fb : FormBuilder,
               @Inject(MAT_DIALOG_DATA) public data: any,
               private paymentService : PaymentService
             )
  {

    this.myForm = this.fb.group({
      fullName: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      phone : new FormControl('', [Validators.required]),
      profession : new FormControl('', [Validators.required]),
      anniversary : new FormControl('', [Validators.required]),
      email: [''],
    })
  }

  ngOnInit(): void {
    console.log(this.data);
    this.user = this.data;

    if(this.data.fromNotification){
      this.isLoading = true;

      this.paymentService.getUserByEmail(this.data.email).subscribe(
        ( {success, user} )=>{
          if(success){

            setTimeout(()=>{  this.isLoading = false}, 1000)
            this.myForm = this.fb.group({
              fullName: new FormControl(user.fullName, [Validators.required]),
              email: new FormControl(user.email, [Validators.required]),
              address: new FormControl( user.address, [Validators.required]),
              phone : new FormControl(user.phone, [Validators.required]),
              profession : new FormControl(user.profession, [Validators.required]),
              anniversary : new FormControl(user.anniversary, [Validators.required]),
            })
          }

        })
    }else{
      this.myForm = this.fb.group({
        fullName: new FormControl(this.data.fullName, [Validators.required]),
        email: new FormControl(this.data.email, [Validators.required]),
        address: new FormControl( this.data.address, [Validators.required]),
        phone : new FormControl(this.data.phone, [Validators.required]),
        profession : new FormControl(this.data.profession, [Validators.required]),
        anniversary : new FormControl(this.data.anniversary, [Validators.required]),
      })

    }

    
  
  }

  isTextTruncated(text: string): boolean {
    return text.length > 20; 
  }
  


}
