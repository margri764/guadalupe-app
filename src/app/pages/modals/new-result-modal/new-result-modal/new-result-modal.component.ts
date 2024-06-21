import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from 'src/app/material.module';
import { ResultFuenteService } from 'src/app/services/result-fuente.service';

@Component({
  selector: 'app-new-result-modal',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './new-result-modal.component.html',
  styleUrl: './new-result-modal.component.scss'
})
export class NewResultModalComponent {

  myForm!: FormGroup;
  isLoading : boolean = false;
  remainingCharacters: number = 250;
  phone : boolean = false;
  backClose : boolean = false;

  constructor(
              private fb : FormBuilder,
              private toastr: ToastrService,
              private resultFuente : ResultFuenteService,
              private dialogRef : MatDialogRef<NewResultModalComponent>

            )
   { 
    
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
    this.resultFuente.createResult( this.myForm.value ).subscribe(
      ( {success} )=>{
        if(success){
          setTimeout(()=>{ this.isLoading = false },700);
          this.successToast('Resultado criado corretamente');
          this.dialogRef.close('new-result')
  
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

  closeModal(){
    this.backClose = true;
    setTimeout( ()=>{ this.dialogRef.close() }, 400 )
  }
  

  validField( field: string ) {
    const control = this.myForm.controls[field];
    return control && control.errors && control.touched;
  }
  
  

}
