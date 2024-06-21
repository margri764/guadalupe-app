import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { delay, take } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { ErrorService } from 'src/app/services/error.service';
import { PropulsaoService } from 'src/app/services/propulsao.service';
import { ResultFuenteService } from 'src/app/services/result-fuente.service';
import { getDataSS } from 'src/app/shared/storage';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-edit-fonte-modal',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './edit-fonte-modal.component.html',
  styleUrl: './edit-fonte-modal.component.scss'
})
export class EditFonteModalComponent {

  myForm!: FormGroup;
  isLoading : boolean = false;
  tempId= null;
  fonte:any;
  user:any;
  propulsaos : any[]=[];
  selectedPropulsaos : any[]=[];
  phone : boolean = false;
  backClose : boolean = false;

  constructor(
              private fb : FormBuilder,
              private toastr: ToastrService,
              private errorService : ErrorService,
              private resultFonteService : ResultFuenteService,
              private propulsaoService : PropulsaoService,
              @Inject (MAT_DIALOG_DATA) public data : any,
              private dialogRef : MatDialogRef<EditFonteModalComponent>
            ) 
  { 
    (screen.width < 800) ? this.phone = true : this.phone = false;

    this.myForm = this.fb.group({
      acronym:     [ '', Validators.required ],
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

    this.fonte = this.data.fonte;

    console.log(this.fonte);
    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));



    this.myForm.patchValue({
      acronym: this.fonte.acronym,
      description: this.fonte.description,
    });

    this.tempId = this.fonte.idfonte;
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

  onSave(){

    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      this.warningToast('Verificar o formulário');
      return;
    }

    this.isLoading = true;
    
    const selectedPropulsao = this.myForm.get('propulsao')?.value;  

    const body = {
      ...this.myForm?.value,
      propulsao : (selectedPropulsao) ? selectedPropulsao.idpropulsao : null
    }
  
    this.resultFonteService.editFonteById( this.tempId, body).subscribe(
      ( {success, message} )=>{
        if(success){
          setTimeout(()=>{ 
            this.isLoading = false; 
            if(message && message === "A fonte selecionada já está atribuída a essa propulsão"){
              this.warningToast(message);
            }else{
              this.successToast('Fonte editada corretamente');
            }
            this.dialogRef.close('edit-fonte')
          },700);
    
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

