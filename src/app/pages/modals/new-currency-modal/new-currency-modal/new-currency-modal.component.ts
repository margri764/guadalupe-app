import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from 'src/app/material.module';
import { CurrenciesService } from 'src/app/services/currencies.service';

@Component({
  selector: 'app-new-currency-modal',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './new-currency-modal.component.html',
  styleUrl: './new-currency-modal.component.scss'
})
export class NewCurrencyModalComponent {

  
  myForm!: FormGroup;
  isLoading : boolean = false;
  remainingCharacters: number = 250;
  example: string = '';
  symbols : string [] = [ 'R$', '$', '€', 'Fr',  ]
  separator : any;
  acronym: any;
  decimal:any | null;
  mill : any | null;
  formattedValue: any;
  decimalError : boolean = false;
  separatorError : boolean = false;
  phone : boolean = false;
  backClose : boolean = false;


  constructor(
              private fb : FormBuilder,
              private toastr: ToastrService,
              private currenciesService : CurrenciesService,
              private dialogRef : MatDialogRef<NewCurrencyModalComponent>

            )
   { 
    (screen.width <= 800) ? this.phone = true : this.phone = false;
    
    this.myForm = this.fb.group({
      name:     [ '', [Validators.required] ],
      acronym:     [ '', [Validators.required] ],
      decimal:     [ '', [Validators.required] ],
      example:     [ '', ],
      description:  [ ''],
    });

   }

  get f(){
    return this.myForm.controls;
  }

   handleSeparatorMill( $event:any ){
      this.mill = $event.value;
      this.formatNumber();
      this.separatorError = false;
   }

    updateExample() {
      this.decimalError = false;
      this.decimal = this.myForm.get('decimal')?.value;
      this.decimal = '0'.repeat(this.decimal);
      this.formatNumber();
    }

  formatNumber() {

    let inputValue  = this.myForm.get('example')?.value;

    if(!inputValue || inputValue === ''){
      return
    }

    this.acronym = this.myForm.get('acronym')?.value;
    // Limpiar el valor para que solo contenga números
    let cleanedValue = inputValue.replace(/\D/g, '');

    if(this.mill === 'vírgula'){
      
            // Convertir el número a cadena
          const numberString = cleanedValue.toString();
          // Agregar comas cada 3 dígitos en la parte entera
          const formattedIntegerPart = numberString.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
          if(!this.decimal ){
            this.formattedValue=  formattedIntegerPart;
          }else{
            this.formattedValue=  `${formattedIntegerPart}.${this.decimal}`;
          }

      }else if( this.mill === 'ponto') {
          const numberString = cleanedValue.toString();
          const formattedIntegerPart = numberString.replace(/(\d)(?=(\d{3})+$)/g, '$1.');
          if(!this.decimal ){
            this.formattedValue=  formattedIntegerPart;
          }else{
            this.formattedValue=  `${formattedIntegerPart},${this.decimal}`;
          }

      }


    }

  onSave(){

    let selectedDecimal = this.myForm.get('decimal')?.value;

    if ( this.myForm.invalid || (!selectedDecimal || selectedDecimal === '') || !this.mill  ) {
      this.myForm.markAllAsTouched();
      this.decimalError = true;
      this.separatorError = true;

      return;
    }

    let arrayFormat = [this.mill, selectedDecimal ];
  
    const { decimal, example,  ...rest } = this.myForm.value;

    const body = {
      ...rest,
      format: arrayFormat

    }

    this.isLoading = true;
    this.currenciesService.createCurrency( body ).subscribe(
      ( {success} )=>{
        if(success){
          setTimeout(()=>{ this.isLoading = false },700);
          this.successToast('Moeda criada corretamente');
          this.dialogRef.close('new-currency')
  
        }
      })
  }

  handleSeparatorChange( ){
    console.log(this.separator);
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

