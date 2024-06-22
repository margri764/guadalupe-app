import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ToastrService } from 'ngx-toastr';
import { delay } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { BankCreditcardService } from 'src/app/services/bank-creditcard.service';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-new-bank-modal',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './new-bank-modal.component.html',
  styleUrl: './new-bank-modal.component.scss'
})
export class NewBankModalComponent {


  @ViewChild('fileUploader') fileUploader: ElementRef;
  myForm! : FormGroup;
  digit : any;  
  isLoading : boolean = false;
  selectedImg : File | null;
  pathImg :any;
  validateWithAccountType : boolean = false;
  phone : boolean = false;
  backClose : boolean = false;

    constructor(
                  private bankCreditcardService : BankCreditcardService,
                  private fb : FormBuilder,
                  private toastr: ToastrService,
                  private errorService : ErrorService,
                  private dialogRef : MatDialogRef<NewBankModalComponent>
  
                ) 
    { 

      (screen.width <= 800) ? this.phone = true : this.phone = false;
  
      this.myForm = this.fb.group({
        name: ['', Validators.required],
        bankNumber: ['',Validators.required],
        rTp_cc: [''],
        description: [''],
      })
    }
  
    ngOnInit(): void {

    this.errorService.closeIsLoading$.pipe(delay(100)).subscribe(emitted => emitted && (this.isLoading = false));

    }

    get f(){
      return this.myForm.controls;
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
    
    onSave(){

      if ( this.myForm.invalid ) {
        this.myForm.markAllAsTouched();
        return;
      }


    this.myForm.get('rTp_cc')?.setValue(this.validateWithAccountType ? 1 : 0);
      const body = {
            ...this.myForm.value,
      }

      this.isLoading = true;
      this.bankCreditcardService.createBankAccount( body, this.selectedImg ).subscribe( 
        ( {success} )=>{
          if(success){
            setTimeout(()=>{
              this.successToast('Conta bancária criada com sucesso');
              this.isLoading = false;
              this.dialogRef.close("new-account");
            }, 700)
            
          }
        })
    }


  validate($event: MatSlideToggleChange): void {
    this.validateWithAccountType = $event.checked;
  }

  remainingCharacters: number = 500;
  limitCharacters(event: any) {
    const maxLength = 500;
    const textarea = event.target as HTMLTextAreaElement;
  
    // Esperar un breve momento para que el texto pegado se refleje en el textarea
    setTimeout(() => {
      const currentLength = textarea.value.length;
      const remaining = maxLength - currentLength;
      if (remaining >= 0) {
        this.remainingCharacters = remaining;
      } else {
        textarea.value = textarea.value.substring(0, maxLength);
      }
    }, 0);
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
  
