import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { delay } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { AlarmGroupService } from 'src/app/services/alarm-group.service';
import { ErrorService } from 'src/app/services/error.service';
import { PropulsaoService } from 'src/app/services/propulsao.service';
import { getDataSS } from 'src/app/shared/storage';


@Component({
  selector: 'app-new-group-modal',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './new-group-modal.component.html',
  styleUrl: './new-group-modal.component.scss'
})
export class NewGroupModalComponent {

  myForm!: FormGroup;
  isLoading : boolean = false;
  backClose : boolean = false;
  phone : boolean = false;
  user: any;
  propulsaos : any[]=[];

  constructor(
              private alarmGroupService : AlarmGroupService,
              private fb : FormBuilder,
              public dialogRef : MatDialogRef<NewGroupModalComponent>,
              private toastr: ToastrService,
              private propulsaoService : PropulsaoService,
              private errorService : ErrorService

            )
   { 

    (screen.width < 800) ? this.phone = true : this.phone = false;
    
    this.myForm = this.fb.group({
      name:     [ '', [Validators.required] ],
      description:  [ '', [Validators.required]],
      propulsao: ['']
    });

   }

  ngOnInit(): void {

    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));


    const user = getDataSS('user');

    if(user && user.role === 'webmaster'){
      this.user = user;
      this.getInitialPropulsaos();
    }
  }

  get f(){
    return this.myForm.controls;
  }

  onSave(){

    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return;
    }

    const selectedPropulsao = this.myForm.get('propulsao')?.value;  

    const body = {
      ...this.myForm.value,
      propulsao : (selectedPropulsao) ? selectedPropulsao.idpropulsao : null

    }


    this.isLoading = true;
    this.alarmGroupService.createGroup( body ).subscribe(
      ( {success} )=>{
        if(success){
          setTimeout(()=>{ this.isLoading = false },700);
          this.successToast('Grupo criado corretamente');
          this.dialogRef.close('new-group')
       
  
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

  getInitialPropulsaos(){

    this.propulsaoService.getAllPropulsaos().subscribe(
        ( {success, propulsaos} )=>{
          if(success){
              this.propulsaos = propulsaos;
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

  closeModal(){
    this.backClose = true;
    setTimeout( ()=>{ this.dialogRef.close() }, 400 )
    
  }
  

  validField( field: string ) {
    const control = this.myForm.controls[field];
    return control && control.errors && control.touched;
  }
  
  

}
