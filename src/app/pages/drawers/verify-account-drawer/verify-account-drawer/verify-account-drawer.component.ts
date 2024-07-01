import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from 'src/app/material.module';
import { BankCreditcardService } from 'src/app/services/bank-creditcard.service';
import { ErrorService } from 'src/app/services/error.service';
import { BankLogoPipe } from "../../../../pipe/bank-logo.pipe";
import { DrawersService } from 'src/app/services/drawers.service';

@Component({
    selector: 'app-verify-account-drawer',
    standalone: true,
    templateUrl: './verify-account-drawer.component.html',
    styleUrl: './verify-account-drawer.component.scss',
    imports: [CommonModule, MaterialModule, ReactiveFormsModule, BankLogoPipe]
})
export class VerifyAccountDrawerComponent {


  @Input() data : any;
  @Output() onCloseModal: EventEmitter<void> = new EventEmitter<void>();

  myForm! : FormGroup;
  digit : any;  
  isLoading : boolean = false;
  showErrorLabel : boolean = false;
  close : boolean = false;
  bank : any;

  
  constructor(
              private fb : FormBuilder,
              private bankCreditcardService : BankCreditcardService,
              private errorService : ErrorService,
              private toastr: ToastrService,
              private drawerService : DrawersService


  )
   { 

    this.myForm = this.fb.group({
      rBanco: [''],
      rAgencia: ['', Validators.required],
      rTp_cc: [''],
      rNr_cc: ['', Validators.required],
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.data);
    this.showErrorLabel = false;
    if(this.data ){
      this.myForm.reset();
      this.digit = null;
      this.bank = this.data;
      console.log(this.data);
      
      if(this.bank.bankNumber && this.bank.bankNumber === "001" ){
        this.showErrorLabel = true;
      }
      // this.myForm.patchValue({rBanco:[`${this.bank.name}  (${this.bank.bankNumber})`] })
    }

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

    let rTp_cc = this.myForm.get('rTp_cc')?.value;

    if(!rTp_cc){
      rTp_cc = '';
    }

    const body = {
      ...this.myForm.value,
      rBanco: this.bank.bankNumber,
      rTp_cc
    }
    console.log(body);

    this.bankCreditcardService.bankDataSelected$.emit(body);
    this.bankCreditcardService.validateBankAccount(body).subscribe( 
     ( {success, lDig} )=>{
         if(success){
             if(lDig === ''){
                this.warningToast('Verificar os dados inseridos');
                this.digit = "---"
             }else{
               this.digit = lDig;
             }
         }
     });
  }

  closeDrawer(){
    this.close = true;
    setTimeout(()=>{
      this.drawerService.closeDrawerVerAccount();
    }, 100)
  }

  warningToast( msg:string){
    this.toastr.warning(msg, 'Rever!!', {
      positionClass: 'toast-bottom-right', 
      timeOut: 6000, 
      messageClass: 'message-toast',
      titleClass: 'title-toast'
    });
  }


  validField( field: string ) {
    const control = this.myForm.controls[field];
    return control && control.errors && control.touched;
}
 

}

