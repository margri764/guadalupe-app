import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { delay } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { ErrorService } from 'src/app/services/error.service';
import { PropulsaoService } from 'src/app/services/propulsao.service';
import { SegmentationService } from 'src/app/services/segmentation.service';
import { getDataSS } from 'src/app/shared/storage';

@Component({
  selector: 'app-edit-phonesegmentation-modal',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './edit-phonesegmentation-modal.component.html',
  styleUrl: './edit-phonesegmentation-modal.component.scss'
})
export class EditPhonesegmentationModalComponent {

  myForm!: FormGroup;
  isLoading : boolean = false;
  phone : boolean = false;
  backClose : boolean = false;
  tempId= null;
  segmentation:any;
  user:any;
  propulsaos : any[]=[];

  constructor(
              private fb : FormBuilder,
              private toastr: ToastrService,
              private errorService : ErrorService,
              private propulsaoService : PropulsaoService,
              private segmentationService : SegmentationService,
              @Inject (MAT_DIALOG_DATA) public data : any,
              private dialogRef : MatDialogRef<EditPhonesegmentationModalComponent>
            ) 
  { 

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

    this.segmentation = this.data.segmentation;

    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));

    this.myForm.patchValue({
      name: this.segmentation.name,
      description: this.segmentation.description,
    });

    this.tempId = this.segmentation.idphonesegmentation;
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

  onSave(  ){

    this.isLoading = true;

    const selectedPropulsao = this.myForm.get('propulsao')?.value;  

    const body = {
      ...this.myForm?.value,
      propulsao : (selectedPropulsao) ? selectedPropulsao.idpropulsao : null

    }
    this.segmentationService.editPhoneSegmentationById( this.tempId, body).subscribe(
      ( {success, message} )=>{
        if(success){

          setTimeout(()=>{ 
            this.isLoading = false; 
            if(message && message === "A segmentation selecionado já está atribuído a essa propulsão"){
              this.warningToast(message);
            }else{
              this.successToast('Segmentation editada corretamente');
            }
            this.dialogRef.close('edit-phonesegmentation')
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
