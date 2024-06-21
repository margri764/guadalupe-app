import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from 'src/app/material.module';
import { SegmentationService } from 'src/app/services/segmentation.service';


@Component({
  selector: 'app-new-phonesegmentation-modal',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './new-phonesegmentation-modal.component.html',
  styleUrl: './new-phonesegmentation-modal.component.scss'
})
export class NewPhonesegmentationModalComponent {


  myForm!: FormGroup;
  isLoading : boolean = false;
  phone : boolean = false;
  backClose : boolean = false;

  constructor(
              private fb : FormBuilder,
              private segmentationService : SegmentationService,
              private toastr: ToastrService,
              private dialogRef : MatDialogRef<NewPhonesegmentationModalComponent>,
            )
   { 

    (screen.width < 800) ? this.phone = true : this.phone = false;

    this.myForm = this.fb.group({
      name:     [ '', [Validators.required] ],
      description:  [ ''],
    });

   }


  onSave(){

    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return;
    }


    this.isLoading = true;
    this.segmentationService.createPhoneSegmentation( this.myForm.value ).subscribe(
      ( {success} )=>{
        if(success){
          setTimeout(()=>{ this.isLoading = false },700);
          this.successToast('Segmentação de telefone criada corretamente');
          this.dialogRef.close('new-phonesegmentation')
  
        }
      })
  }

  get f (){
    return this.myForm.controls;
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
