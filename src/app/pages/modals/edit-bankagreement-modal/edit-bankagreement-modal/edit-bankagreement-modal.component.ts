import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { delay } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { BankCreditcardService } from 'src/app/services/bank-creditcard.service';
import { ErrorService } from 'src/app/services/error.service';
import { PropulsaoService } from 'src/app/services/propulsao.service';
import { getDataSS } from 'src/app/shared/storage';
import { BankLogoPipe } from "../../../../pipe/bank-logo.pipe";


@Component({
    selector: 'app-edit-bankagreement-modal',
    standalone: true,
    templateUrl: './edit-bankagreement-modal.component.html',
    styleUrl: './edit-bankagreement-modal.component.scss',
    imports: [CommonModule, MaterialModule, ReactiveFormsModule, BankLogoPipe]
})
export class EditBankagreementModalComponent {


  @ViewChild('fileUploader') fileUploader: ElementRef;

  myForm!: FormGroup;
  isLoading : boolean = false;
  tempId= null;
  bankagreement:any;
  user:any;
  propulsaos : any[]=[];
  selectedPropulsaos : any[]=[];
  phone : boolean = false;
  selectedImg : File | null = null;
  pathImg :any;
  showImgBack : boolean = false;
  showPrev : boolean = false;
  backClose : boolean = false;

  constructor(
              private fb : FormBuilder,
              private toastr: ToastrService,
              private errorService : ErrorService,
              private propulsaoService : PropulsaoService,
              private bankcreditcardService : BankCreditcardService,
              private dialogRef : MatDialogRef<EditBankagreementModalComponent>,
              @Inject (MAT_DIALOG_DATA) public data : any

            ) 
  { 

    (screen.width < 800) ? this.phone = true : this.phone = false;

    this.myForm = this.fb.group({
      name:     [ '', Validators.required ],
      description:  [ ''],
      propulsao:  [ ''],
    });
  }

  ngOnInit(): void {

    const user = getDataSS('user');

    if(user && user.role === 'webmaster'){
      this.user = user;
      this.getInitialPropulsaos();
    }

    this.bankagreement = this.data.bankagreement;
    this.tempId = this.bankagreement.idbankagreement;
    if(this.bankagreement.filePath && this.bankagreement.filePath !== ''){
        this.showImgBack = true;
    }

    console.log(this.bankagreement);
    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));


    this.myForm.patchValue({
      name: this.bankagreement.name,
      description: this.bankagreement.description,
    });

    this.tempId = this.bankagreement.idbankagreement;
  }

  getInitialPropulsaos(){
    this.propulsaoService.getAllPropulsaos().subscribe(
        ( {success, propulsaos} )=>{
          if(success){
              this.propulsaos = propulsaos;
            }
        })
  }

  onSave( ){

    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      this.warningToast('Verificar o formulário');
      return;
    }

    this.isLoading = true;
    
    const selectedPropulsao = this.myForm.get('propulsao')?.value;  

    let body = {
      ...this.myForm?.value,
      propulsao : (selectedPropulsao) ? selectedPropulsao.idpropulsao : null
    }

    let file = null;

    // si se elimino la img q estaba en el back envio nada o la img seleccionada como File
       if(!this.showImgBack){
         file = this.selectedImg;
       }else{
        body = { ...body, filePath: this.bankagreement.filePath } // si no se deselecciono dejo el path q venia del back y no mando nada en el file
       }
  
    this.bankcreditcardService.editBankAgreementById( this.tempId, body, file).subscribe(
      ( {success, message} )=>{
        if(success){
          setTimeout(()=>{ 
            this.isLoading = false; 
            if(message && message === "A convênio bancário selecionado já está atribuído a essa propulsão"){
              this.warningToast(message);
            }else{
              this.successToast('Convênio bancário editado corretamente');
            }
            this.dialogRef.close('edit-bankagreement')
          },700);
    
        }
      })
  
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


  remainingCharacters: number = 500;
  limitCharacters(event: any) {
    const maxLength = 500;
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
    this.toastr.warning(msg, 'Verificar!!', {
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

