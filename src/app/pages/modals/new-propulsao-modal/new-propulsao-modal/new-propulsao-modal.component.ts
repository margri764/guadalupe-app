import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from 'src/app/material.module';
import { CurrenciesService } from 'src/app/services/currencies.service';
import { PropulsaoService } from 'src/app/services/propulsao.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-propulsao-modal',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './new-propulsao-modal.component.html',
  styleUrl: './new-propulsao-modal.component.scss'
})
export class NewPropulsaoModalComponent {

  myForm!: FormGroup;
  isLoading : boolean = false;
  currencies : string []=[];
  ordems : string []= [ 'Primeira', 'Segunda','Terceira' ];
  selectedOrdems : string []=[];
  phone : boolean = false;
  backClose : boolean = false;

  constructor(
              private fb : FormBuilder,
              private toastr: ToastrService,
              private propulsaoService : PropulsaoService,
              private currenciesService : CurrenciesService,
              private dialogRef : MatDialogRef<NewPropulsaoModalComponent>
            )
   { 

    (screen.width <= 800) ? this.phone = true : this.phone = false;
    
    this.myForm = this.fb.group({
      name:     [ '', [Validators.required] ],
      idcurrency: [ '', [Validators.required] ],
      ordem:     [ '', [Validators.required] ],
      description:  [ ''],
    });

   }

  ngOnInit(): void {
    this.getCurrency();
  }


  onSave(){

    console.log(this.myForm.value);
    
    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return;
    }
    const body = { ...this.myForm.value, ordem: this.selectedOrdems}
    this.isLoading = true;
    this.propulsaoService.createPropulsao( body ).subscribe(
      ( {success} )=>{
        if(success){
          setTimeout(()=>{ this.isLoading = false },700);
          this.successToast('Propulsão criada corretamente');
          this.dialogRef.close('new-propulsao')
       
  
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


  selectOrdem(ordem: string): void {

    if (!this.selectedOrdems.some(ord => ord === ordem)) {
      this.selectedOrdems.push( ordem);
    }
  }

  removeOrdem(ordem: any){
    const index = this.selectedOrdems.indexOf(ordem);
    if (index >= 0) {
      this.selectedOrdems.splice(index, 1);
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


  getCurrency(){
    this.currenciesService.getAllCurrencies().subscribe(
      ( {success, currencies} )=>{
        if(success){
          this.currencies = currencies;
          // currencies.forEach((element:any)=>{ this.currencies.push(element.name) })
        }
      })
  }

  showAttentionSwal(){

    Swal.fire({
      title: 'As moedas uma vez atribuída não podem ser alterada',
      // text: 'Se você excluí-la, perderá todo o progresso na configuração da propulsão',
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, continuar!"
      }).then((result) => {
        if (result.isConfirmed) {
        }else{
          this.isLoading = false;
        }
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

