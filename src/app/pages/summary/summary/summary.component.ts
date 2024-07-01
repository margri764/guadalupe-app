import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule} from '@angular/forms';
import { Subscription} from 'rxjs';
import { AppState } from 'src/app/shared/redux/app.reducer';
import { Store } from '@ngrx/store';
import { getDataLS, saveDataLS } from 'src/app/shared/storage';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { AssociationLogoPipe } from "../../../pipe/association-logo.pipe";

interface Person {
  name: string;
  age: number;
  country: string;
}



@Component({
    selector: 'app-summary',
    standalone: true,
    templateUrl: './summary.component.html',
    styleUrl: './summary.component.scss',
    imports: [CommonModule, MaterialModule, ReactiveFormsModule, AssociationLogoPipe]
})
export class SummaryComponent {

  
  people: Person[] = [
    { name: 'John', age: 30, country: 'USA' },
    { name: 'Alice', age: 25, country: 'Canada' },
    { name: 'Bob', age: 35, country: 'UK' }
  ];

  columns: string[] = ['name', 'age', 'country'];

  @Input() diocese:string;
  @Input() city:string;
  @Input() fullName:string;
  @Input() tratamento:string;
  @Input() anniversary:string;
  @Input() profession:string;
  @Input() cpf:string;
  @Input() formOwn:string;
  @Input() fonte:string;
  @Input() result:string;
  @Input() association:string;

  // fifthFormGroup : FormGroup;
  addressSubscription : Subscription;
  formAddress : any [] | null=[];
  formEmails : any [] | null=[];
  formPhones : any [] | null=[];
  formAddedPerson : any [] | null=[];
  formBankAccount : any | null;
  formCreditcard : any | null;
  formUnity : string = '';
  formPaymentInitMonth : string = '';
  gv : string = '';
  formAdjustment : string = '';
  formFixedDeposit : string = '';
  formPaymentMethod : string = '';
  assoWithLogo : any;


  constructor(
              private fb : FormBuilder,
              private store : Store<AppState>
  ) { 


  }
  
  ngOnInit(): void {

    // filter(({formAddress, formEmails}) => formEmails != null && formEmails.length > 0),
    this.addressSubscription = this.store.select('auth')
    .pipe(
      ).subscribe(
        ({formAddress, formEmails, formPhones, formUnity, formPaymentInitMonth, formGv, formAdjustment, formFixedDeposit, formPaymentMethod, formBankAccount, formCreditcard, formAddedPerson  } )=>{
            this.formAddress = formAddress; 
            this.formEmails = formEmails
            this.formPhones = formPhones;
            this.formUnity = formUnity;
            this.formPaymentInitMonth = formPaymentInitMonth;
            console.log(formPaymentInitMonth);
            this.gv = formGv;
            this.formAdjustment = formAdjustment;
            this.formFixedDeposit = formFixedDeposit;
            this.formPaymentMethod = formPaymentMethod;
            this.formBankAccount = formBankAccount;
            this.formCreditcard = formCreditcard;
            this.formAddedPerson = formAddedPerson;
        })

        const association = getDataLS('form_association');
        if(association){
          this.assoWithLogo = association;
        }


    this.setDataToSummary();      


    // this.fifthFormGroup = this.fb.group({
    //   fullName: [''],
    //   diocese: [''],
    //   city: [''],
    // })
    
  }

  setDataToSummary(){

  }


  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['diocese'] && changes['diocese'].currentValue !== changes['diocese'].previousValue) {
        this.formAddress= this.formAddress;
        
      }else if(changes['formOwn'] &&  changes['formOwn'].currentValue !== changes['formOwn'].previousValue){
        saveDataLS('form_ownAccount', this.formOwn)
      }else if(changes['association'] &&  changes['association'].currentValue !== changes['association'].previousValue){
        const association = getDataLS('form_association');
        if(association){
          this.assoWithLogo = association;
        }

        console.log(this.association);
        console.log(this.assoWithLogo);
    }
  }
  
  
  
  }

