import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ToastrService } from 'ngx-toastr';
import { delay } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { BankCreditcardService } from 'src/app/services/bank-creditcard.service';
import { ErrorService } from 'src/app/services/error.service';
import { PropulsaoService } from 'src/app/services/propulsao.service';
import { getDataSS } from 'src/app/shared/storage';


@Component({
  selector: 'app-edit-creditcard-modal',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './edit-creditcard-modal.component.html',
  styleUrl: './edit-creditcard-modal.component.scss'
})
export class EditCreditcardModalComponent {


  @ViewChild('fileUploader') fileUploader: ElementRef;

  myForm!: FormGroup;
  isLoading : boolean = false;
  tempId= null;
  creditCard : any;
  user : any;
  propulsaos : any[]=[];
  selectedImg : File | null = null;
  pathImg :any;
  showImgBack : boolean = false;
  showPrev : boolean = false;
  showValidFrom : boolean = false;
  validFrom : any;
  expirationDate : any | null;
  ccvRegExp : any;
  dateError : boolean = false;
  expDate : string = '';
  fromDate : string = '';
  digitos : any []=[];
  phone : boolean = false;
  backClose : boolean = false;



  constructor(
                private fb : FormBuilder,
                private toastr: ToastrService,
                private errorService : ErrorService,
                private bankCreditcardService : BankCreditcardService,
                private propulsaoService : PropulsaoService,
                @Inject (MAT_DIALOG_DATA) public data : any,
                private dialogRef : MatDialogRef<EditCreditcardModalComponent>


             ) 
  {

    (screen.width < 800) ? this.phone = true : this.phone = false;

    this.myForm = this.fb.group({
      cardNumberRegExp: ['', [Validators.required, Validators.pattern('^[1-9][0-9]$')]],
      ccvRegExp: ['', [Validators.required, Validators.pattern('^[1-9]$')]],
      name: ['', [Validators.required]],
      description: [''],
      iddigitcheck: [''],
      propulsao: ['']
    });

   }

  ngOnInit(): void {

    const user = getDataSS('user');

    if(user && user.role === 'webmaster'){
      this.user = user;
      this.getInitialPropulsaos();
    }

    console.log(this.data.creditCard);
    this.creditCard = this.data.creditCard;
    this.tempId = this.creditCard.idcreditcard;


    if(this.creditCard.filePath && this.creditCard.filePath !== ''){
        this.showImgBack = true;
    }

    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));

    this.getExpDate(this.creditCard);
    this.getNumberLength(this.creditCard);
    (this.creditCard.validFromRegExp) ? this.getFromDate(this.creditCard): this.showValidFrom = false;

    this.getAllDigitsCheck();

    console.log(this.creditCard.digitcheck_number);

    this.myForm.patchValue({
      cardNumberRegExp:  this.getNumberLength(this.creditCard),
      ccvRegExp: this.getCCVLength(this.creditCard),
      name: this.creditCard.name ,
      description: this.creditCard.description,
      iddigitcheck: this.creditCard.iddigitcheck,
    });

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

    getAllDigitsCheck(){

      this.bankCreditcardService.getAllDigitsCheck().subscribe(
        ( {success, digitchecks} )=>{
          if(success){
            this.digitos = digitchecks;
          }
        })
    }
  
    getExpDate( card: any ){

      card = card.expirationDateRegExp;

      this.expirationDate = card[2];

      switch (card[2]) {
        case 'mm/yy':
                    this.expDate = "mm/yy"
          break;
        case 'yy/mm':
                    this.expDate = "yy/mm"
          break;
       case 'mm/yyyy':
                    this.expDate = "mm/yyyy"
          break;

        case 'yyyy/mm':
                    this.expDate = "yyyy/mm"
          break;
      
        default:
          break;
      }
    }

    getFromDate( card: any ){

      card = card.validFromRegExp;
      this.showValidFrom = true;

      this.validFrom = card[2];

      switch (card[2]) {
        case 'mm/yy':
                    this.fromDate = "mm/yy"
          break;
        case 'yy/mm':
                    this.fromDate = "yy/mm"
          break;
       case 'mm/yyyy':
                    this.fromDate = "mm/yyyy"
          break;

        case 'yyyy/mm':
                    this.fromDate = "yyyy/mm"
          break;
      
        default:
          break;
      }
    }

    getNumberLength( card: any ){
      card = card.cardNumberRegExp;
      const partes = card.split(/\D/); // Divide la cadena en partes usando cualquier carácter no numérico como separador
      const length = partes.find((part: string) => part !== "");  
      return length;
    }

    getCCVLength( card: any ){
      card = card.ccvRegExp;
      const partes = card.split(/\D/); // Divide la cadena en partes usando cualquier carácter no numérico como separador
      const length = partes.find((part: string) => part !== "");  
      return length;
    }

    onSave(){

      if ( this.myForm.invalid ) {
        this.myForm.markAllAsTouched();
        return;
      }
      const selectedPropulsao = this.myForm.get('propulsao')?.value;  
      
      let validFromRegExp = null;
  
            
      if(this.showValidFrom){
        validFromRegExp = this.setValidFromRule();
      }

      const expirationDateRegExp = this.setExpirationDateRule();
      const cardNumberRegExp = this.setCardNumberLength();
      const ccvRegExp = this.setCCVLength();
      let iddigitcheck = this.myForm.get('iddigitcheck')?.value;

      this.digitos.forEach(item => {
          if (item.iddigitcheck === iddigitcheck) {
              iddigitcheck = item.iddigitcheck;
          }
      });
      console.log(iddigitcheck);
      

      let body = {
                    ...this.myForm.value,
                    cardNumberRegExp,
                    validFromRegExp,
                    expirationDateRegExp,
                    ccvRegExp,
                    iddigitcheck,
                    propulsao : (selectedPropulsao) ? selectedPropulsao.idpropulsao : null,
                  }

        this.isLoading = true;
        let file = null;

  //si se elimino la img q estaba en el back envio nada o la img seleccionada como File
      if(!this.showImgBack){
        file = this.selectedImg;
      }else{
      body = { ...body, filePath: this.creditCard.filePath } // si no se deselecciono dejo el path q venia del back y no mando nada en el file
      }

      this.bankCreditcardService.editCreditCardById( this.tempId, body, file).subscribe(
        ( {success, message} )=>{
          if(success){

            setTimeout(()=>{ 
              this.isLoading = false; 
              if(message && message === "A cartão de crédito selecionado já está atribuída a essa propulsão"){
                this.warningToast(message);
              }else{
                this.successToast('Cartão de crédito editada corretamente');
              }
              this.dialogRef.close('edit-creditcard')
            },700);


          
          // setTimeout(()=>{ 
          //   this.isLoading = false; 
          //   this.successToast('Cartão de crédito editado com sucessoe');
          //   this.activeModal.close('edit-creditCard')
          // },700);
    
        }
      })
  
    }

    showHideValidFrom( $event: MatSlideToggleChange){
      this.showValidFrom = $event.checked;
      if(!this.showValidFrom){
        this.validFrom = null;
      }
    }

    handleValidFromChange( $event : MatRadioChange ){

      this.validFrom = $event.value;
      console.log(this.validFrom);
  
    }
  
    handleExpirationDateChange( $event : MatRadioChange ){
  
      this.expirationDate = $event.value;
      this.dateError = false;
  
    }

    setValidFromRule(){

      const validFrom = this.validFrom;

        let month = '^(0[1-9]|1[0-2])$';
        let year = null;
        let type = validFrom;
        let regex = null;

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
        let regex = null;

        console.log(expirationDate);

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

    warningToast( msg:string){
      this.toastr.warning(msg, 'Verificar!!', {
        positionClass: 'toast-bottom-right', 
        timeOut: 3500, 
        messageClass: 'message-toast',
        titleClass: 'title-toast'
      });
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

