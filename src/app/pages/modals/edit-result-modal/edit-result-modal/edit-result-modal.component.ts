import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { delay } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { ErrorService } from 'src/app/services/error.service';
import { PropulsaoService } from 'src/app/services/propulsao.service';
import { ResultFuenteService } from 'src/app/services/result-fuente.service';
import { getDataSS } from 'src/app/shared/storage';

@Component({
  selector: 'app-edit-result-modal',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './edit-result-modal.component.html',
  styleUrl: './edit-result-modal.component.scss'
})
export class EditResultModalComponent {


  myForm!: FormGroup;
  isLoading : boolean = false;
  tempId= null;
  result:any;
  user:any;
  propulsaos : any[]=[];
  phone : boolean = false;
  backClose : boolean = false;

  constructor(
              private fb : FormBuilder,
              private toastr: ToastrService,
              private errorService : ErrorService,
              private resultFuenteService : ResultFuenteService,
              private propulsaoService : PropulsaoService,
              @Inject (MAT_DIALOG_DATA) public data : any,
              private dialogRef : MatDialogRef<EditResultModalComponent>
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

    this.result = this.data.result;

    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));


    this.myForm.patchValue({
      acronym: this.result.acronym,
      description: this.result.description,
    });

    this.tempId = this.result.idresult;
  }

  onSave( ){
    
    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;

    const selectedPropulsao = this.myForm.get('propulsao')?.value;  

    const body = {
      ...this.myForm?.value,
      propulsao : (selectedPropulsao) ? selectedPropulsao.idpropulsao : null

    }
  
    this.resultFuenteService.editResultById( this.tempId, body).subscribe(
      ( {success, message} )=>{
        if(success){
          setTimeout(()=>{ 
            this.isLoading = false; 
            if(message && message === "A resultado selecionado já está atribuída a essa propulsão"){
              this.warningToast(message);
            }else{
              this.successToast('Resultado editado corretamente');
            }
            this.dialogRef.close('edit-result')
          },700);
    
        }
      })
  
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

