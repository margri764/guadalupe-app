import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { delay } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { CurrenciesService } from 'src/app/services/currencies.service';
import { ErrorService } from 'src/app/services/error.service';
import { PropulsaoService } from 'src/app/services/propulsao.service';

@Component({
  selector: 'app-edit-propulsao-modal',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './edit-propulsao-modal.component.html',
  styleUrl: './edit-propulsao-modal.component.scss'
})
export class EditPropulsaoModalComponent {

  myForm!: FormGroup;
  isLoading : boolean = false;
  tempId= null;
  propulsao:any;
  currencies : string []=[];
  selectError : boolean = false;
  ordems : string []=["Primeira", "Segunda", "Terceira"];
  selectedOrdems : string []=[];
  phone : boolean = false;
  backClose : boolean = false;
  

  constructor(
              private fb : FormBuilder,
              private toastr: ToastrService,
              private errorService : ErrorService,
              private propulsaoService : PropulsaoService,
              private currenciesServices : CurrenciesService,
              private dialogRef : MatDialogRef<EditPropulsaoModalComponent>,
              @Inject (MAT_DIALOG_DATA) public data:any


            ) 
  { 

    (screen.width < 800) ? this.phone = true : this.phone = false;
    this.myForm = this.fb.group({
      name:     [ '', Validators.required ],
      // currency:     [ '', Validators.required ],
      ordem:     [ '' ],
      description:  [ ''],

    });


  }

  ordemError : boolean = false;

  ngOnInit(): void {

    this.propulsao = this.data.propulsao;

    console.log(this.propulsao);

    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));
    this.getCurrency();


    this.myForm.patchValue({
      name: this.propulsao.name,
      // currency: this.propulsao.currency_name,
      description: this.propulsao.description,
    });

    if(this.propulsao.view_congregatio){
      this.selectedOrdems =  this.propulsao.view_congregatio;
    }

    this.tempId = this.propulsao.idpropulsao;
  }

  onSave(){

    if(this.selectedOrdems.length === 0){
      this.ordemError = true;
      this.warningToast('Verificar o formulário');
      return
    }

    if ( this.myForm.invalid   ) {
      this.myForm.markAllAsTouched();
      this.warningToast('Verificar o formulário');
      return;
    }

    // const currency = this.myForm.get('currency').value;
    // let gotCurrency = [];
    // if(currency){
    //   gotCurrency = this.currencies.filter( (element:any) => element.name === currency);
    // }

    // console.log(currency);

    const body = { ...this.myForm.value, ordem: this.selectedOrdems}

    this.isLoading = true;

    console.log(body);

    this.propulsaoService.editPropulsaoById( this.tempId, body).subscribe(
      ( {success} )=>{
        if(success){
          setTimeout(()=>{ 
            this.isLoading = false; 
            this.successToast('propulsao editada corretamente');
            this.dialogRef.close('edit-propulsao');
          },700);
    
        }
      })
  
  }

  getCurrency(){
    this.currenciesServices.getAllCurrencies().subscribe(
      ( {success, currencies} )=>{
        if(success){
          this.currencies = currencies;
          // currencies.forEach((element:any)=>{ this.currencies.push(element.name) })
        }
      })
  }

  onSelectMoeda( event: any){
    const selectedValue = event.target.value;
  }

  selectOrdem($event: any) {
    const ordem = $event.target.value;
    console.log(ordem);

    if(this.selectedOrdems){

      if (!this.selectedOrdems.some(ord => ord === ordem)) {
        this.selectedOrdems.push( ordem);
      }
      this.ordemError = false;
    }

    this.myForm.get('ordem')?.setValue(null);


  }

  removeOrdem(ordem: any){
    const index = this.selectedOrdems.indexOf(ordem);
    if (index >= 0) {
      this.selectedOrdems.splice(index, 1);
      if(this.selectedOrdems.length === 0){
        this.myForm.get('ordem')?.setValue('');
      }
    }
  
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

  warningToast( msg:string){
    this.toastr.warning(msg, 'Rever!!', {
      positionClass: 'toast-bottom-right', 
      timeOut: 6000, 
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

