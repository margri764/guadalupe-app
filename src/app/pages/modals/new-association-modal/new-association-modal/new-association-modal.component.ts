import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from 'src/app/material.module';
import { AssociationService } from 'src/app/services/association.service';


@Component({
  selector: 'app-new-association-modal',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './new-association-modal.component.html',
  styleUrl: './new-association-modal.component.scss'
})
export class NewAssociationModalComponent {


  @ViewChild('fileUploader') fileUploader: ElementRef;

  myForm!: FormGroup;
  isLoading : boolean = false;
  pathImg :any;
  selectedImg : File | null = null;
  phone : boolean = false;
  backClose : boolean = false;

  constructor(
              private fb : FormBuilder,
              private toastr: ToastrService,
              private associationService : AssociationService,
              private dialogRef : MatDialogRef<NewAssociationModalComponent>

            )
   { 
    (screen.width <= 800) ? this.phone = true : this.phone = false;
    
    this.myForm = this.fb.group({
      name:     [ '', [Validators.required] ],
      number:     [ '', [Validators.required] ],
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
    this.associationService.createAssociation( this.myForm.value,  this.selectedImg ).subscribe(
      ( {success} )=>{
        if(success){
          setTimeout(()=>{ this.isLoading = false },700);
          this.successToast('Associação criada corretamente');
          this.dialogRef.close('new-association')
        }
      })
  }

  
  onFileSelected(event: any) {
    this.selectedImg = event.target.files[0];
    this.showPreview();
  }

  showPreview() {
    const reader = new FileReader();
  
    reader.onload = (event: any) => {
      this.pathImg = event.target.result;
    };
  
    if (this.selectedImg) {
      reader.readAsDataURL(this.selectedImg);
    }
  }

  cancelImag(){
    this.selectedImg = null;
    this.pathImg = null;
       // Restablecer el valor del input de archivo
       const fileInput = this.fileUploader.nativeElement;
       fileInput.value = '';
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
