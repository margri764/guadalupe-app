import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SegmentationService } from 'src/app/services/segmentation.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-addressegmentation-modal',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './new-addressegmentation-modal.component.html',
  styleUrl: './new-addressegmentation-modal.component.scss'
})
export class NewAddressegmentationModalComponent {


  myForm!: FormGroup;
  isLoading : boolean = false;
  phone : boolean = false;
  backClose : boolean = false;

  constructor(
              private fb : FormBuilder,
              private toastr: ToastrService,
              private segmentationService : SegmentationService,
              private dialogRef : MatDialogRef<NewAddressegmentationModalComponent>


            )
   { 

    (screen.width < 800) ? this.phone = true : this.phone = false;
    
    this.myForm = this.fb.group({
      name:     [ '', [Validators.required] ],
      description:  [ ''],
    });

   }

  ngOnInit(): void {
  }

  onSave(){

    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return;
    }


    this.isLoading = true;
    this.segmentationService.createAddressSegmentation( this.myForm.value ).subscribe(
      ( {success} )=>{
        if(success){
          setTimeout(()=>{ this.isLoading = false },700);
          this.successToast('Segmentação de endereço criada corretamente');
          this.dialogRef.close('new-addresssegmentation')
  
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
  
  get f(){
    return this.myForm.controls;
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
