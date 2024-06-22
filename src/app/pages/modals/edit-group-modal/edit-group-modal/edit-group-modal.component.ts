import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { delay } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { AlarmGroupService } from 'src/app/services/alarm-group.service';
import { ErrorService } from 'src/app/services/error.service';
import { PropulsaoService } from 'src/app/services/propulsao.service';

import { getDataSS } from 'src/app/shared/storage';

@Component({
  selector: 'app-edit-group-modal',
  standalone: true,
  imports: [ CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './edit-group-modal.component.html',
  styleUrl: './edit-group-modal.component.scss'
})
export class EditGroupModalComponent {

  myForm!: FormGroup;
  isLoading : boolean = false;
  backClose : boolean = false;
  phone : boolean = false;
  tempId= null;
  group:any;
  user:any;
  propulsaos : any[]=[];

  constructor(
              private alarmGroupService : AlarmGroupService,
              private fb : FormBuilder,
              private toastr: ToastrService,
              private errorService : ErrorService,
              private propulsaoService : PropulsaoService,
              private dialogRef : MatDialogRef<EditGroupModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,


            ) 
  { 

    (screen.width <= 800) ? this.phone = true : this.phone = false;


    this.myForm = this.fb.group({
      editName:     [ '' ],
      editDescription:  [ ''],
      propulsao:  [ ''],
    });

    (screen.width < 800) ? this.phone = true : this.phone = false



  }

  ngOnInit(): void {

    const user = getDataSS('user');

    if(user && user.role === 'webmaster'){
      this.user = user;
      this.getInitialPropulsaos();
    }

    this.group = this.data.group;

    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));

    this.myForm.patchValue({
      editName: this.group.name,
      editDescription: this.group.description,
    });

    this.tempId = this.group.idgroup
  }

  get f (){
    return this.myForm.controls;
  }

  onSave(  ){

    this.isLoading = true;

    const selectedPropulsao = this.myForm.get('propulsao')?.value;  
  
    const name = this.myForm.get("editName")?.value;
    const description = this.myForm.get("editDescription")?.value;
    
    const body = { 
              name, 
              description,
              propulsao : (selectedPropulsao) ? selectedPropulsao.idpropulsao : null
     }
    
    this.alarmGroupService.editGroupById( this.tempId, body).subscribe(
      ( {success} )=>{
        if(success){
          setTimeout(()=>{ 
            this.isLoading = false; 
            this.successToast('Grupo editado corretamente');
            this.dialogRef.close('edit-group')
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

  closeModal(){
    this.backClose = true;
    setTimeout( ()=>{ this.dialogRef.close() }, 400 )
    
  }
  


  validFieldEdit( field: string ) {
    const control = this.myForm.controls[field];
    return control && control.errors && control.touched;
  }

}
