import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { delay } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { DiocesisCidadeService } from 'src/app/services/diocesis-cidade.service';
import { ErrorService } from 'src/app/services/error.service';
import { PropulsaoService } from 'src/app/services/propulsao.service';
import { getDataSS } from 'src/app/shared/storage';

@Component({
  selector: 'app-edit-city-modal',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './edit-city-modal.component.html',
  styleUrl: './edit-city-modal.component.scss'
})

export class EditCityModalComponent {

  myForm!: FormGroup;
  isLoading : boolean = false;
  tempId= null;
  city:any;
  user:any;
  propulsaos : any[]=[];
  phone : boolean = false;
  backClose : boolean = false;

  constructor(
              private fb : FormBuilder,
              private toastr: ToastrService,
              private errorService : ErrorService,
              private diocesisCityService : DiocesisCidadeService,
              private propulsaoService : PropulsaoService,
              private dialogRef : MatDialogRef<EditCityModalComponent>,
              @Inject (MAT_DIALOG_DATA) public data : any  
            ) 
  { 
    (screen.width <= 800) ? this.phone = true : this.phone = false;


    this.myForm = this.fb.group({
      name:     [ '', Validators.required ],
      province:  [ ''],
      country:  [ ''],
      propulsao: ['']
    });

  }

  ngOnInit(): void {

    const user = getDataSS('user');

    if(user && user.role === 'webmaster'){
      this.user = user;
      this.getInitialPropulsaos();
    }

    this.city = this.data.city;

    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));


    this.myForm.patchValue({
      name: this.city.name,
      province: this.city.province,
      country: this.city.country,
    });

    this.tempId = this.city.idcity;
  }

  onSave( ){

    this.isLoading = true;

    const selectedPropulsao = this.myForm.get('propulsao')?.value;  

    const body = {
      ...this.myForm?.value,
      propulsao : (selectedPropulsao) ? selectedPropulsao.idpropulsao : null

    }

  
    this.diocesisCityService.editCityById( this.tempId, body).subscribe(
      ( {success, message} )=>{
        if(success ){
          setTimeout(()=>{ 
            this.isLoading = false; 
            if(message && message === "A cidade selecionada já está atribuída a essa propulsão"){
              this.warningToast(message);
            }else{
              this.successToast('Diocese editada corretamente');
            }
            this.dialogRef.close('edit-city')
          },700);
         
        }
      })
  
  }

  getInitialPropulsaos(){

    this.propulsaoService.getAllPropulsaos().subscribe(
        ( {success, propulsaos} )=>{
          if(success){
              this.propulsaos = propulsaos;
            }
        })
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

