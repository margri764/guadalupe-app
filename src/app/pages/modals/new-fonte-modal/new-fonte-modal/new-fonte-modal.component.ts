import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from 'src/app/material.module';
import { ResultFuenteService } from 'src/app/services/result-fuente.service';

@Component({
  selector: 'app-new-fonte-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './new-fonte-modal.component.html',
  styleUrl: './new-fonte-modal.component.scss'
})
export class NewFonteModalComponent {


  myForm!: FormGroup;
  isLoading : boolean = false;
  phone : boolean = false;
  backClose : boolean = false;


  constructor(
              private fb : FormBuilder,
              private toastr: ToastrService,
              private resultFontService : ResultFuenteService,
              private dialogRef : MatDialogRef<NewFonteModalComponent>


            )
   { 

    (screen.width <= 800) ? this.phone = true : this.phone = false;
    
    this.myForm = this.fb.group({
      acronym:     [ '', [Validators.required] ],
      description:  [ ''],
    });

   }


  get f(){
    return this.myForm.controls;
  }

  onSave(){

    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return;
    }


    this.isLoading = true;
    this.resultFontService.createFonte( this.myForm.value ).subscribe(
      ( {success} )=>{
        if(success){
          setTimeout(()=>{ this.isLoading = false },700);
          this.successToast('Fonte criada corretamente');
          this.dialogRef.close('new-fonte')
  
        }
      })
  }

  remainingCharacters: number = 250;
  limitCharacters(event: any) {
    const maxLength = 250;
    const textarea = event.target as HTMLTextAreaElement;
    const currentLength = textarea.value.length;
    const remaining = maxLength - currentLength;
    if (remaining >= 0) {
      this.remainingCharacters = remaining;
    } else {
      textarea.value = textarea.value.substring(0, maxLength);
    }
  }


  successToast( msg:string){
    this.toastr.success(msg, 'Sucesso!!', {
      positionClass: 'toast-bottom-right', 
      timeOut: 3500, 
      messageClass: 'message-toast',
      titleClass: 'title-toast'
    });
  }
  

  closeModal(){
    this.backClose = true;
    setTimeout( ()=>{ this.dialogRef.close() }, 400 )
  }
  

  validField( field: string ) {
    const control = this.myForm.controls[field];
    return control && control.errors && control.touched;
  }
  
  

}

