import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { delay } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { CurrenciesService } from 'src/app/services/currencies.service';
import { ErrorService } from 'src/app/services/error.service';
import { PropulsaoService } from 'src/app/services/propulsao.service';
import { getDataSS } from 'src/app/shared/storage';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-currency-modal',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './edit-currency-modal.component.html',
  styleUrl: './edit-currency-modal.component.scss'
})
export class EditCurrencyModalComponent {


  myForm!: FormGroup;
  isLoading : boolean = false;
  tempId= null;
  currency:any;
  user:any;
  propulsaos : any[]=[];
  symbols : string [] = [ 'R$', '$', '€', 'Fr',  ];
  example: string = '';
  separator : any;
  acronym: any;
  decimal:any | null;
  mill:any;
  formattedValue: any;
  checkSeparator : string ='';
  decimalError : boolean = false;
  separatorError : boolean = false;
  phone : boolean = false;
  backClose : boolean = false;

  constructor(
              private fb : FormBuilder,
              private toastr: ToastrService,
              private errorService : ErrorService,
              private currenciesServices : CurrenciesService,
              private propulsaoService : PropulsaoService,
              private dialogRef : MatDialogRef<EditCurrencyModalComponent>,
              @Inject (MAT_DIALOG_DATA) public data :any
            ) 
  { 

    (screen.width < 800) ? this.phone = true : this.phone = false;

    this.myForm = this.fb.group({
      name:     [ '', Validators.required ],
      acronym:     [ '', Validators.required ],
      format:     [ ''],
      decimal:     [ '', Validators.required],
      description:  [ ''],
      example:     [ '', ],
      
    });

  }

  ngOnInit(): void {

    const user = getDataSS('user');

    if(user && user.role === 'webmaster'){
      this.user = user;
      this.getInitialPropulsaos();
    }

    this.currency = this.data.currency;

    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));

   let decimal = this.currency.format[1];
   if(decimal){
     decimal = this.myForm.get('decimal')?.setValue(decimal);
     this.decimalError = false;
   }

    this.mill = this.currency.format[0];

    if(this.mill){
      this.separatorError = false;
    }

    this.updateExample();

    this.myForm.patchValue({
      name: this.currency.name,
      acronym: this.currency.acronym,
      description: this.currency.description,
    });

    this.tempId = this.currency.idcurrency;
  }

  onSave(){

    if(this.data.noAllowedEdition){
      this.showPropulsaoSwal();
    }
    
    let selectedDecimal = this.myForm.get('decimal')?.value;

    console.log(selectedDecimal, this.mill );

    if ( this.myForm.invalid || (!selectedDecimal || selectedDecimal === '') || !this.mill  ) {
      this.myForm.markAllAsTouched();
      this.decimalError = true;
      this.separatorError = true;

      return;
    }

    this.isLoading = true;

    let arrayFormat = [this.mill, selectedDecimal ];
  
    const { decimal, example,  ...rest } = this.myForm.value;

    const body = {
      ...rest,
      format: arrayFormat

    }
  
    this.currenciesServices.editCurrencyById( this.tempId, body).subscribe(
      ( {success} )=>{
        if(success){
          setTimeout(()=>{ 
            this.isLoading = false; 
            this.successToast('Moeda editada corretamente');
            this.dialogRef.close('edit-currency')
          },700);
    
        }
      })
  
  }

  handleSeparatorMill( $event:any ){
    this.mill = $event.value;
    this.formatNumber();
 }

  updateExample() {
    this.decimal = this.myForm.get('decimal')?.value;
    this.decimal = '0'.repeat(this.decimal);
    console.log(this.decimal);
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

    get f(){
      return this.myForm.controls;
    }

  getInitialPropulsaos(){

    this.propulsaoService.getAllPropulsaos().subscribe(
        ( {success, propulsaos} )=>{
          if(success){
              this.propulsaos = propulsaos;
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


showPropulsaoSwal( ){

  Swal.fire({
    title: "Operação proibida!",
    text: `Esta moeda está atribuída a uma propulsão`,
    icon: "warning",
    // showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "continuar"
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


  closeModal(){
    this.backClose = true;
    setTimeout( ()=>{ this.dialogRef.close() }, 400 )
  }

  validField( field: string ) {
    const control = this.myForm.controls[field];
    return control && control.errors && control.touched;
  }

}

