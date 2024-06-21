import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from 'src/app/material.module';
import { DiocesisCidadeService } from 'src/app/services/diocesis-cidade.service';


@Component({
  selector: 'app-new-diocese-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './new-diocese-modal.component.html',
  styleUrl: './new-diocese-modal.component.scss'
})
export class NewDioceseModalComponent {

  myForm!: FormGroup;
  isLoading : boolean = false;
  phone : boolean = false;
  backClose : boolean = false;


  constructor(
              private fb : FormBuilder,
              private toastr: ToastrService,
              private diocesisCityService : DiocesisCidadeService,
              private dialogRef : MatDialogRef<NewDioceseModalComponent>

            )
   { 
    
    this.myForm = this.fb.group({
      name:     [ '', [Validators.required] ],
      number:     [ '', [Validators.required] ],
      description:  [ ''],
    });

   }

  ngOnInit(): void {
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
    this.diocesisCityService.createDiocese( this.myForm.value ).subscribe(
      ( {success} )=>{
        if(success){
          setTimeout(()=>{ this.isLoading = false },700);
          this.successToast('Diocese criada corretamente');
          this.dialogRef.close('new-diocese')
  
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
