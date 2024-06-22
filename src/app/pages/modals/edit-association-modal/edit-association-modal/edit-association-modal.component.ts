import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { delay } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { AssociationService } from 'src/app/services/association.service';
import { ErrorService } from 'src/app/services/error.service';
import { PropulsaoService } from 'src/app/services/propulsao.service';
import { getDataSS } from 'src/app/shared/storage';
import { AssociationLogoPipe } from "../../../../pipe/association-logo.pipe";

@Component({
    selector: 'app-edit-association-modal',
    standalone: true,
    templateUrl: './edit-association-modal.component.html',
    styleUrl: './edit-association-modal.component.scss',
    imports: [CommonModule, ReactiveFormsModule, MaterialModule, AssociationLogoPipe]
})
export class EditAssociationModalComponent {

  @ViewChild('fileUploader') fileUploader: ElementRef;

  myForm!: FormGroup;
  isLoading : boolean = false;
  tempId= null;
  association:any;
  user:any;
  propulsaos : any[]=[];
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
              private associationService : AssociationService,
              private propulsaoService : PropulsaoService,
              private dialogRef : MatDialogRef<EditAssociationModalComponent>,
              @Inject (MAT_DIALOG_DATA) public data :any
            ) 
  { 

    (screen.width < 800) ? this.phone = true : this.phone = false;

    this.myForm = this.fb.group({
      name:     [ '', Validators.required ],
      number:     [ '', Validators.required ],
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

 
    this.association = this.data.association;
    this.tempId = this.association.idassociation;
    if(this.association.filePath && this.association.filePath !== ''){
          this.showImgBack = true;
      }

    console.log(this.association);
    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));


    this.myForm.patchValue({
      name: this.association.name,
      number: this.association.number,
      description: this.association.description,
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

  onSave( ){

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
    body = { ...body, filePath: this.association.filePath } // si no se deselecciono dejo el path q venia del back y no mando nada en el file
   }
    this.associationService.editAssociationById( this.tempId, body, file).subscribe(
      ( {success, message} )=>{
        if(success){

          setTimeout(()=>{ 
            this.isLoading = false; 
            if(message && message === "A associação selecionada já está atribuída a essa propulsão"){
              this.warningToast(message);
            }else{
              this.successToast('Associação editada corretamente');
            }
            this.dialogRef.close('edit-association')
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

