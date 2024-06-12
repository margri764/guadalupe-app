import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { delay } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { ErrorService } from 'src/app/services/error.service';
import { PropulsaoService } from 'src/app/services/propulsao.service';


@Component({
  selector: 'app-add-propulsao-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './add-propulsao-modal.component.html',
  styleUrl: './add-propulsao-modal.component.scss'
})
export class AddPropulsaoModalComponent {
 
  myForm!: FormGroup;
  id: any;
  component : string = '';
  isLoading : boolean = false;
  backClose : boolean = false;
  phone : boolean = false;
  propulsaos : any []=[];

  constructor(
              private propulsaoService : PropulsaoService,
              private fb : FormBuilder,
              private toastr: ToastrService,
              private errorService : ErrorService,
              private dialogRef : MatDialogRef<AddPropulsaoModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,


  ) { }

  ngOnInit(): void {

    this.errorService.closeIsLoading$.pipe(delay(100)).subscribe(emitted => emitted && (this.isLoading = false));


    this.myForm = this.fb.group({
      propulsao:  [ '', [Validators.required]],
    });

    this.id = this.data.id;
    this.component = this.data.component;

    this.getInitialPropulsaos();

  }

  get f (){
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


    saveEdition(){

      if ( this.myForm.invalid ) {
        this.myForm.markAllAsTouched();
        return;
      }
      

      const selectedPropulsao = this.myForm.get('propulsao')?.value;  

      this.isLoading = true;

      const body = {
        id: this.id,
        component: this.component,
        propulsao: selectedPropulsao.idpropulsao
      }

      this.propulsaoService.addPropulsao(body).subscribe(
        ( {success, message} )=>{
          if(success){
            setTimeout(()=>{ 
              this.isLoading = false; 
              if(message && message === "A propulsão já está atribuída"){
                this.warningToast(message);
              }else{
                this.successToast('Propulsão atribuída corretamente');
              }
              this.dialogRef.close(this.component)
            },700);
      
          }
    
        })
  

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
    

}
