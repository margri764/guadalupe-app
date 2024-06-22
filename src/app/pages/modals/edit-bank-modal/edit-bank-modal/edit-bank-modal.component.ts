import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ToastrService } from 'ngx-toastr';
import { delay } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { BankCreditcardService } from 'src/app/services/bank-creditcard.service';
import { ErrorService } from 'src/app/services/error.service';
import { PropulsaoService } from 'src/app/services/propulsao.service';
import { getDataSS } from 'src/app/shared/storage';
import { BankLogoPipe } from "../../../../pipe/bank-logo.pipe";

@Component({
    selector: 'app-edit-bank-modal',
    standalone: true,
    templateUrl: './edit-bank-modal.component.html',
    styleUrl: './edit-bank-modal.component.scss',
    imports: [CommonModule, MaterialModule, ReactiveFormsModule, BankLogoPipe]
})
export class EditBankModalComponent {

  @ViewChild('fileUploader') fileUploader: ElementRef;
  myForm!: FormGroup;
  isLoading : boolean = false;
  tempId= null;
  bank:any;
  user:any;
  propulsaos : any[]=[];
  validateWithAccountType : boolean = false;
  selectedImg : File | null = null;
  pathImg :any;
  showImgBack : boolean = false;
  showPrev : boolean = false;
  phone : boolean = false;
  backClose : boolean = false;


  constructor(
              private fb : FormBuilder,
              private toastr: ToastrService,
              private errorService : ErrorService,
              private bankCreditcardService : BankCreditcardService,
              private propulsaoService : PropulsaoService,
              @Inject (MAT_DIALOG_DATA) public data :any,
              private dialogRef : MatDialogRef<EditBankModalComponent>

            ) 
  { 

    (screen.width < 800) ? this.phone = true : this.phone = false;

    this.myForm = this.fb.group({
      name: ['', Validators.required],
      bankNumber: ['', Validators.required],
      description: [''],
      rTp_cc: [''],
      propulsao: [''],
    });

  }

  ngOnInit(): void {

    const user = getDataSS('user');

    if(user && user.role === 'webmaster'){
      this.user = user;
      this.getInitialPropulsaos();
    }

    this.bank = this.data.bank;
    this.tempId = this.bank.idbankaccount;
    if(this.bank.filePath && this.bank.filePath !== ''){
        this.showImgBack = true;
    }

    console.log(this.bank);
    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));


    this.myForm.patchValue({
      name: this.bank.name,
      description: this.bank.description,
      bankNumber: this.bank.bankNumber,
      rTp_cc: this.bank.rTp_cc,
    });

  }

  getInitialPropulsaos(){
    this.propulsaoService.getAllPropulsaos().subscribe(
        ( {success, propulsaos} )=>{
          if(success){
              this.propulsaos = propulsaos;
            }
        })
  }

  onSave(){

    this.isLoading = true;
    
    const selectedPropulsao = this.myForm.get('propulsao')?.value;  

    let body = {
      ...this.myForm?.value,
      propulsao : (selectedPropulsao) ? selectedPropulsao.idpropulsao : null,
      rTp_cc: (this.validateWithAccountType) ? 1 : 0,

    }

    let file = null;

 // si se elimino la img q estaba en el back envio nada o la img seleccionada como File
    if(!this.showImgBack){
      file = this.selectedImg;
    }else{
     body = { ...body, filePath: this.bank.filePath } // si no se deselecciono dejo el path q venia del back y no mando nada en el file
    }

 

    this.bankCreditcardService.editBankById( this.tempId, body, file).subscribe(
      ( {success, message} )=>{
        if(success){

          setTimeout(()=>{ 
            this.isLoading = false; 
            if(message && message === "A banco selecionado já está atribuído a essa propulsão"){
              this.warningToast(message);
            }else{
              this.successToast('Banco editada corretamente');
            }
            this.dialogRef.close('edit-bank')
          },700);

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

  validate($event: MatSlideToggleChange): void {
    this.validateWithAccountType = $event.checked;
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

