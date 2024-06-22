import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { delay } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { BankCreditcardService } from 'src/app/services/bank-creditcard.service';
import { ErrorService } from 'src/app/services/error.service';
import { getDataSS } from 'src/app/shared/storage';


@Component({
  selector: 'app-new-creditcard-modal',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule ],
  templateUrl: './new-creditcard-modal.component.html',
  styleUrl: './new-creditcard-modal.component.scss'
})
export class NewCreditcardModalComponent {


  @ViewChild('fileUploader') fileUploader: ElementRef;

  myForm!: FormGroup;
  isLoading : boolean = false;
  validFrom : any;
  expirationDate : any | null;
  ccvRegExp : any;
  showValidFrom : boolean = false;
  selectedImg : File | null = null;
  pathImg :any;
  dateError : boolean = false;
  digitos : any []=[];
  phone : boolean = false;
  backClose : boolean = false;



  constructor(
                private fb : FormBuilder,
                private bankCreditcardService : BankCreditcardService,
                private toastr: ToastrService,
                private errorService : ErrorService,
                private dialogRef : MatDialogRef<NewCreditcardModalComponent>
             )
   { 

    (screen.width <= 800) ? this.phone = true : this.phone = false;
    
  }
  
  ngOnInit(): void {

    this.errorService.closeIsLoading$.pipe(delay(100)).subscribe(emitted => emitted && (this.isLoading = false));

    
    this.myForm = this.fb.group({
      cardNumberRegExp: ['', [Validators.required, Validators.pattern('^[1-9][0-9]$')]],
      ccvRegExp: ['', [Validators.required, Validators.pattern('^[1-9]$')]],
      name: ['', [Validators.required]],
      iddigitcheck: [''],
      description: [''],
    });

    const user = getDataSS('user');
    if(user){
      this.getAllDigitsCheck();
    }

  }

  get f(){
    return this.myForm.controls;
  }


  getAllDigitsCheck(){

    this.bankCreditcardService.getAllDigitsCheck().subscribe(
      ( {success, digitchecks} )=>{
        if(success){
          this.digitos = digitchecks;

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

  setValidFromRule(){

      const validFrom = this.validFrom;

        let month = '^(0[1-9]|1[0-2])$';
        let year = null;
        let type = validFrom;
        let regex = [];

      switch (validFrom) {
        case 'mm/yy':
                      year =  '^\\d{2}$'
        break;

        case 'mm/yyyy':
                      year =  '^\\d{4}$'
        break;

        case 'yy/mm':
                      year =  '^\\d{2}$'
        break;

        case 'yyyy/mm':
                      year =  '^\\d{4}$'
        break;
                      
       default:
         break;
       }
                      
        return regex = [month, year, type];
  
  }

  setExpirationDateRule(){

    const expirationDate = this.expirationDate;

      let month = '^(0[1-9]|1[0-2])$';
      let year = null;
      let type = expirationDate;
      let regex = [];

    switch (expirationDate) {
      case 'mm/yy':
                    year =  '^\\d{2}$'
      break;

      case 'mm/yyyy':
                    year =  '^\\d{4}$'
      break;

      case 'yy/mm':
                    year =  '^\\d{2}$'
      break;

      case 'yyyy/mm':
                    year =  '^\\d{4}$'
      break;
                    
     default:
       break;
     }
                    
      return regex = [month, year, type];

  }

  setCardNumberLength(){
    const cardLength = this.myForm.get('cardNumberRegExp')?.value;
    const regex = `^\\d{${cardLength}}$`;
    return  regex;
  }

  setCCVLength(){
    const ccvLength = this.myForm.get('ccvRegExp')?.value;
    const regex = `^\\d{${ccvLength}}$`;
    return  regex;
  }

  showHideValidFrom( $event: MatSlideToggleChange){
    this.showValidFrom = $event.checked;
    if(!this.showValidFrom){
      this.validFrom = null;
    }
  }

  onSave(){

    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return;
    }

    if(!this.expirationDate){
      this.dateError = true;
      return
    }

    this.isLoading = true;
    let validFromRegExp = null;
    
    if(this.showValidFrom){
      validFromRegExp = this.setValidFromRule();
    }

    const expirationDateRegExp = this.setExpirationDateRule();
    const cardNumberRegExp = this.setCardNumberLength();
    const ccvRegExp = this.setCCVLength();


    const body = {
                  ...this.myForm.value,
                  cardNumberRegExp,
                  validFromRegExp,
                  expirationDateRegExp,
                  ccvRegExp: ccvRegExp ,
                }
                
    this.bankCreditcardService.createCreditCardRule( body, this.selectedImg ).subscribe(
      ( {success} )=>{
        if(success){
          setTimeout(()=>{
              this.successToast('Validação de cartões criada com sucesso');
              this.isLoading = false;
              this.dialogRef.close('new-creditcard');
            },700)
        }
      } )


  }

  handleValidFromChange( $event : MatRadioChange ){

    this.validFrom = $event.value;
    console.log(this.validFrom);

  }

  handleExpirationDateChange( $event : MatRadioChange ){

    this.expirationDate = $event.value;
    this.dateError = false;
    console.log(this.expirationDate);

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
  
  closeModal(){
    this.backClose = true;
    setTimeout( ()=>{ this.dialogRef.close() }, 400 )
  }
  
  successToast( msg:string){
    this.toastr.success(msg, 'Sucesso!!', {
      positionClass: 'toast-bottom-right', 
      timeOut: 3500, 
      messageClass: 'message-toast',
      titleClass: 'title-toast'
    });
  }

  validField( field: string ) {
    const control = this.myForm.controls[field];
    return control && control.errors && control.touched;
  }


}

