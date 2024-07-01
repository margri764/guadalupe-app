import { Component, ElementRef, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Store } from '@ngrx/store';
import { Observable, map, startWith } from 'rxjs';
import { AppState } from 'src/app/shared/redux/app.reducer';
import { getDataLS, saveDataLS } from 'src/app/shared/storage';
import * as authActions from '../../../shared/redux/auth.actions';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { AssociationService } from 'src/app/services/association.service';
import { BankCreditcardService } from 'src/app/services/bank-creditcard.service';
import { DrawersService } from 'src/app/services/drawers.service';

interface bankAccount{
  rAgencia : string,
  rNr_cc: string,
  bankLogo : string | null,
  agenciaName:string,
  agenciaAddress : string
}

interface creditCard{
  name: string,
  cardNumber : string,
  ccvNumber: string,
  bankAgreements : string,
  pathCreditcardLogo:string | null,
  selectedCreditcardId :string 
}


@Component({
  selector: 'app-data-bank',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './data-bank.component.html',
  styleUrl: './data-bank.component.scss'
})
export class DataBankComponent {


  @ViewChild ("openCanvas" , {static: true} ) openCanvas! : ElementRef;
  @ViewChild ("bankAccount" , {static: true} ) bankAccount! : ElementRef;
  @ViewChild ("creditcard" , {static: true} ) creditcard! : ElementRef;


  fourthFormGroup : FormGroup;
  arrUnities : any []=[];
  selectedUnityId : any;
  selectedBankId : any;
  selectedCreditcard : any;
  selectedCreditcardId : any;
  selectedBankAgreementId : any;
  unities : any[]=[];
  unitiesOptions: Observable<any> | undefined;
  bankOptions: Observable<any> | undefined;
  creditcardOptions: Observable<any> | undefined;
  bankAgreementsOptions: Observable<any> | undefined;
  searchText: string = '';
  showErrorPaymentInit: boolean = false;
  showLastMonthPayment: boolean = false;
  gvs : any []= ['1', '2', '3']
  adjustment : any []= ['Sim', 'Não'];
  paymentMethods : any []= ['Conta Bancaria', 'Cartão de Crédito', 'Boleto' ];
  banks : any[]=[];
  arrBanks : any[]=[];
  creditcards : any[]=[];
  arrCreditcards : any[]=[];
  bankAgreements : any[]=[];
  arrBankAgreements : any[]=[];
  selectedBank : any | null;
  bankDataSelected : any | null;
  pathBankLogo : string | null;
  showBankLogo : boolean =  false;
  paymentMethod : string = '';
  pathCreditcardLogo : string | null= '';
  showCreditcardLogo : boolean = false;
  numberOK : string = '';
  errorCCV : string = '';
  errorCardNumber : string = '';
  validating : boolean = false;




  constructor(
                private fb: FormBuilder,
                private associationService : AssociationService,
                private bankCreditcardService : BankCreditcardService,
                private store : Store<AppState>,
                private drawerService : DrawersService

              ) 
  { 

    this.fourthFormGroup = this.fb.group({
      unity: [''],
      paymentInitMonth: ['', Validators.required],
      gv: ['', Validators.required],
      adjustment: ['', Validators.required],
      fixedDeposit: ['', Validators.required],
      bankaccount: [''],
      rAgencia: [''],
      rNr_cc: [''],
      agenciaName: [''],
      creditcard: [''],
      cardNumber: [''],
      agenciaAddress: [''],
      ccvNumber: [''],
      paymentMethod: [''],
      bankAgreements: [''],
      lastMonthPayment: [''],
  });

  }

  
  ngOnInit(): void {

    this.checkLStorage();
    
    this.bankCreditcardService.bankDataSelected$.subscribe( (bodyEmmited)=>{if(bodyEmmited){this.assignAccountData(bodyEmmited)}})

    this.associationService.getAllUnits().subscribe(({ success, units }) => {
      if(success) {
        this.unities = units
        .filter( (item:any) => item.nome_da_unidade !== null) // Filtrar los elementos con nome_da_unidade no nulo
        .map( (item:any) => {
          const match = item.nome_da_unidade.match(/^\d+/); // Buscar el número al principio del nombre
          return match ? { number: match[0], name: item.nome_da_unidade } : null; // Retornar un objeto con el número y el nombre completo
        })
        .filter((value:  any, index: any, self: any) => {
          if (!value) return false; // Descartar valores nulos
          return self.findIndex( (item:any) => item.number === value.number) === index; // Filtrar valores únicos por número
        })
        .map( (item:any) => item.name); // Mapear de vuelta a los nombres completos de las unidades
      
      

        this.arrUnities = units;
        this.unitiesOptions = this.fourthFormGroup.get('unity')?.valueChanges.pipe(
          startWith(''),
          map(value => this.filterByUnity(value || '')) 
        );
      }
    });

    this.bankCreditcardService.getAllBanksAccounts().subscribe(({ success, bankAccounts }) => {
      if(success) {
        this.banks = bankAccounts.map( (item:any)=>(item.name));
        this.arrBanks = bankAccounts;
        this.bankOptions = this.fourthFormGroup.get('bankaccount')?.valueChanges.pipe(
          startWith(''),
          map(value => this.filterByBank(value || '')) 
        );
      }
    });

    this.bankCreditcardService.getAllCreditCards().subscribe(({ success, creditcards }) => {
      if(success) {
        this.creditcards = creditcards.map( (item:any)=>(item.name));
        this.arrCreditcards = creditcards;
        this.creditcardOptions = this.fourthFormGroup.get('creditcard')?.valueChanges.pipe(
          startWith(''),
          map(value => this.filterByCreditcard(value || '')) 
        );
      }
    });

     this.bankCreditcardService.getAllBankAgreements().subscribe( ( {success, bankAgreements} )=>{
      if(success) {
        this.bankAgreements = bankAgreements.map( (item:any)=>(item.name));
        this.arrBankAgreements = bankAgreements;
        this.bankAgreementsOptions = this.fourthFormGroup.get('bankAgreements')?.valueChanges.pipe(
          startWith(''),
          map(value => this.filterByBankAgreements(value || '')) 
        );
      }
    });

    this.fourthFormGroup.get('paymentInitMonth')?.valueChanges.subscribe( (value:string) => {
      console.log(value);
      if(value && value !== ''){
        this.formatInput(value);
      }
    });

  }

  get f(){
    return this.fourthFormGroup.controls;
  }

  onUnitySelected(event: MatAutocompleteSelectedEvent){

    const selectedValue = event.option.value;

    console.log(selectedValue);
    this.arrUnities.forEach( (item:any)=>{
      if(item.nome_da_unidade === selectedValue){
      this.selectedUnityId = item.idunit
      }
    })
    console.log(this.selectedUnityId);

    if(selectedValue && selectedValue !== ''){
      // this.diocese = selectedValue;
      saveDataLS('form_unity', selectedValue);
      this.store.dispatch(authActions.addFormUnity({formUnity: selectedValue}));
    };
  }

  onBankAgreementsSelected(event: MatAutocompleteSelectedEvent){

    const selectedValue = event.option.value;
    this.arrBankAgreements.forEach( (item:any)=>{
      if(item.name === selectedValue){
      this.selectedBankAgreementId = item.idbankagreement;
      }
    })

    if(selectedValue && selectedValue !== ''){
      // this.diocese = selectedValue;
      saveDataLS('form_bankAgreement', selectedValue);
      this.setCreditcardData();
    };
  }

  onBankSelected(event: MatAutocompleteSelectedEvent){

    const selectedValue = event.option.value;
    this.showBankLogo = true;
    this.arrBanks.forEach((item: any) => {
      if (item.name === selectedValue) {
        this.selectedBankId = item.idbankaccount;
        this.selectedBank = item;
        if (item.filePath && item.filePath !== '') {
          const fileName = item.filePath.split('/').pop();
          const serverURL = 'https://arcanjosaorafael.org/bankAccount/';
          this.pathBankLogo = `${serverURL}${fileName}`;
        } else {
          this.pathBankLogo = 'assets/images/no-image.jpg';
          
        }
        this.openCanvas.nativeElement.click();
      }
    });

    if(selectedValue && selectedValue !== ''){
      // this.diocese = selectedValue;
      saveDataLS('form_bank', this.selectedBank );
      this.store.dispatch(authActions.addFormBank({formBank:selectedValue}));

    };
  }

  onPaymentMonthSelected(){
    const selectedValue = this.fourthFormGroup.get('paymentInitMonth')?.value;
    if(selectedValue && selectedValue !== ''){
      // this.anniversary = selectedValue;
      if(!this.showErrorPaymentInit){
        saveDataLS('form_initPayment', selectedValue);
        this.store.dispatch(authActions.addFormPaymentInitMonth({formPaymentInitMonth:selectedValue}));
      }
    }else{
      localStorage.removeItem('form_initPayment');
      this.store.dispatch(authActions.unSetFormPaymentInitMonth());

    }

  }

  onPaymentMethSelected(){
    const selectedValue = this.fourthFormGroup.get('paymentMethod')?.value;
      if(selectedValue && selectedValue !== ''){
        this.paymentMethod = selectedValue;
        saveDataLS('form_paymentMethod', selectedValue);
        this.store.dispatch(authActions.addFormPaymentMethod({formPaymentMethod:selectedValue}));

        if(selectedValue ==='Conta Bancaria'){
          // localStorage.removeItem('form_creditcard');
          localStorage.removeItem('form_creditcardData');
          this.store.dispatch(authActions.unSetFormCreditcard());
          this.fourthFormGroup.get('cardNumber')?.setValue('');
          this.fourthFormGroup.get('ccvNumber')?.setValue('');
          this.fourthFormGroup.get('bankAgreements')?.setValue('');
          this.fourthFormGroup.get('creditcard')?.setValue('');
          this.selectedCreditcardId = null;
          this.selectedCreditcard = null;
          this.pathCreditcardLogo = null;
          this.showCreditcardLogo = false;  

        }else if(  selectedValue === 'Cartão de Crédito'){
   
          localStorage.removeItem('form_bankaccount');
          localStorage.removeItem('form_bank');
          localStorage.removeItem('form_bankAccount');
          this.store.dispatch(authActions.unSetFormBankAccount());
          this.store.dispatch(authActions.unSetFormCreditcard());
          this.fourthFormGroup.get('rAgencia')?.setValue('');
          this.fourthFormGroup.get('agenciaName')?.setValue('');
          this.fourthFormGroup.get('agenciaAddress')?.setValue('');
          this.fourthFormGroup.get('rNr_cc')?.setValue('');
          this.fourthFormGroup.get('bankaccount')?.setValue('');
          this.showBankLogo = false;
          this.selectedBankId = null;
          this.selectedBank = null;
          this.pathBankLogo = null;

        }else if(selectedValue === 'Boleto'){

        }
    }
  }

  onCreditCardSelected(event: MatAutocompleteSelectedEvent){
    const selectedValue = event.option.value;
    this.showCreditcardLogo = true;  
    this.arrCreditcards.forEach((item: any) => {
      if (item.name === selectedValue) {
        this.selectedCreditcardId = item.idcreditcard;
        this.selectedCreditcard = item;
        if (item.filePath && item.filePath !== '') {
          const fileName = item.filePath.split('/').pop();
          const serverURL = 'https://arcanjosaorafael.org/cardLogos/';
          this.pathCreditcardLogo = `${serverURL}${fileName}`;
          this.setCreditcardData();
        } else {
          this.pathCreditcardLogo = 'assets/images/no-image.jpg';
        }
        // this.openCanvas.nativeElement.click();
        // saveDataLS('form_creditcard', selectedValue);
        this.setCreditcardData();

      }
    });

    this.goTo(this.creditcard);
  }

  private filterByUnity(value: string) {
    const filterValue = value.toLowerCase();
    return this.unities.filter(option => option.toLowerCase().includes(filterValue));
  }

  private filterByBank(value: string) {
    const filterValue = value.toLowerCase();
    return this.banks.filter(option => option.toLowerCase().includes(filterValue));
  }

  private filterByCreditcard(value: string) {
    const filterValue = value.toLowerCase();
    return this.creditcards.filter(option => option.toLowerCase().includes(filterValue));
  }

  private filterByBankAgreements(value: string) {
    const filterValue = value.toLowerCase();
    return this.bankAgreements.filter(option => option.toLowerCase().includes(filterValue));
  }

  async handleBlurNumber() {

    this.validating = true;
    const number = this.fourthFormGroup.get('cardNumber')?.value;

    if( number && number !== '' ){
      const isValid = await this.creditCardValidator(number); 
       console.log(isValid);
      if(isValid){
        this.numberOK = "true";
        this.setCreditcardData();
      }else{
        this.numberOK = "false";
      }
    }
    this.checkCardNumberLength();
  }
  
  // algoritmo de Nuhn
  async creditCardValidator( number:any) {

    // Convertir el número en una matriz de dígitos
    const digits = number.toString().split('').map(Number);

    // Invertir el array de dígitos
    digits.reverse();

    // Aplicar el algoritmo de Luhn
    let suma = digits.reduce(function(sumaParcial: any, digito: number, index: number) {
        if (index % 2 !== 0) {
            digito *= 2;
            if (digito > 9) {
                digito -= 9;
            }
        }
        return sumaParcial + digito;
    }, 0);

  // Determinar si la tarjeta es válida o no
  let esValida = suma % 10 === 0;

  // Retornar un mensaje indicando si la tarjeta es válida o no
  return esValida ;
  }

  setCreditcardData(){
    this.store.dispatch(authActions.unSetFormCreditcard());
    localStorage.removeItem('form_creditcardData')
    const cardNumber = this.fourthFormGroup.get('cardNumber')?.value;
    const ccvNumber = this.fourthFormGroup.get('ccvNumber')?.value;
    const bankAgreements = this.fourthFormGroup.get('bankAgreements')?.value;
    const creditcard = this.fourthFormGroup.get('creditcard')?.value;

    const body:creditCard = {
      cardNumber : (cardNumber && this.numberOK === 'true') ? cardNumber : '',
      ccvNumber:  (ccvNumber && this.errorCCV === 'true') ? ccvNumber : '',
      bankAgreements : (bankAgreements) ? bankAgreements : '',
      pathCreditcardLogo: this.pathCreditcardLogo,
      name :  creditcard,
      selectedCreditcardId: this.selectedCreditcardId
    }
    saveDataLS('form_creditcardData', body)
    this.store.dispatch(authActions.addFormCreditcard({formCreditcard: body}));
  }
 
dataBankEmited : any;
  assignAccountData( data:any ){

    this.dataBankEmited = data;

    this.store.dispatch(authActions.unSetFormBankAccount());

    this.fourthFormGroup.patchValue({
      rAgencia: data.rAgencia,
      rNr_cc: data.rNr_cc,
      bankName: this.selectedBank.name
    });

    setTimeout(()=>{ this.goTo(this.bankAccount) },300);

    let body : bankAccount = {
      rAgencia: data.rAgencia,
      rNr_cc: data.rNr_cc,
      bankLogo: this.pathBankLogo,
      agenciaName: '',
      agenciaAddress: ''
    }

    saveDataLS('form_bankAccount', body);
    this.store.dispatch(authActions.addFormBankAccount({formBankAccount: body}))
    
  }

  setAgenciaData(){

    this.store.dispatch(authActions.unSetFormBankAccount());
    localStorage.removeItem('form_bankAccount')

    const agenciaName = this.fourthFormGroup.get('agenciaName')?.value;
    const agenciaAddress = this.fourthFormGroup.get('agenciaAddress')?.value;

    let body : bankAccount = {
      rAgencia: this.dataBankEmited.rAgencia,
      rNr_cc: this.dataBankEmited.rNr_cc,
      bankLogo: this.pathBankLogo,
      agenciaName: agenciaName,
      agenciaAddress: agenciaAddress
    }
    console.log(body);
    saveDataLS('form_bankAccount', body);
    this.store.dispatch(authActions.addFormBankAccount({formBankAccount: body}))
    
  }

  handleFixedDepositChange(value:any){
      if(value === 'Sim'){
        this.showLastMonthPayment = true;
      }else{
        this.showLastMonthPayment = false;
      }
      this.fourthFormGroup.get('fixedDeposit')?.setValue(value)
     saveDataLS('form_fixedDeposit', value);
    this.store.dispatch(authActions.addFormFixedDeposit({formFixedDeposit: value}));
 
  }

  onGVSelected(){
    const selectedValue = this.fourthFormGroup.get('gv')?.value;
    if(selectedValue && selectedValue !== ''){
      // this.anniversary = selectedValue;
      if(!this.showErrorPaymentInit){
        saveDataLS('form_gv', selectedValue);
        this.store.dispatch(authActions.addFormGv({formGv : selectedValue}));
      }
    }else{
      localStorage.removeItem('form_gv');
      this.store.dispatch(authActions.unSetFormGv());
    }

  }

  onReajusteSelected(){
    const selectedValue = this.fourthFormGroup.get('adjustment')?.value;
    if(selectedValue && selectedValue !== ''){
      // this.anniversary = selectedValue;
      if(!this.showErrorPaymentInit){
        saveDataLS('form_adjustment', selectedValue);
        this.store.dispatch(authActions.addFormAdjustment({formAdjustment:selectedValue}));

      }
    }else{
      localStorage.removeItem('form_adjustment');
      this.store.dispatch(authActions.unSetFormAdjustment());

    }

  }

  formatInput(value: string) {

    //detecta cuando esta borrando (el problema es la "/")
    if (value.includes('/') && value.split('/')[1].length === 0) {
      this.fourthFormGroup.patchValue({ paymentInitMonth: value.slice(0, -1) }, { emitEvent: false });
      return;
  }

    const digits = value.replace(/\D/g, ''); // Eliminar caracteres que no sean dígitos
    let formattedValue = '';
    this.showErrorPaymentInit = false;
    // console.log(digits);

 
    if (digits.length <= 1) {
      formattedValue = digits;
    } else if (digits.length >= 2) {

      const month = parseInt(digits.slice(0, 2));
      if (month > 12) {
        this.showErrorPaymentInit = true;
        formattedValue = digits.slice(0, 1); // Mantener solo el primer dígito para el mes
      } else {
        formattedValue = `${digits.slice(0, 2)}/${digits.slice(2)}`;
      }
    } 
    if(digits.length >= 3 && digits.length <=5) {

      const thirdDigit = digits.charAt(2); 
      const fourthDigit = digits.charAt(3); 

      if(parseInt(thirdDigit) < 2 || parseInt(thirdDigit) > 2 ){
        this.showErrorPaymentInit = true;
      }else if(parseInt(fourthDigit) >= 1 ){
        this.showErrorPaymentInit = true;
      }

    }

    if(digits.length >= 6) {

      const year = parseInt(digits.slice(2, 6));
      if (year < 1910 || year > 2030) {
        this.showErrorPaymentInit = true;
        // formattedValue = `${digits.slice(0, 1)}/${digits.slice(1, 5)}`; // Mantener solo los primeros 4 dígitos para el año
      } else {
        formattedValue = `${digits.slice(0, 2)}/${digits.slice(2, 6)}`;
      }
    }

    if (value !== formattedValue) {

      this.fourthFormGroup.patchValue({ paymentInitMonth: formattedValue }, { emitEvent: false });
    }


  }

  clearSearch(){
    this.searchText = '';
  }

  checkCCVLength( ){
    this.errorCCV= '';
    const pattern = this.selectedCreditcard.ccvRegExp;
    const ccv = this.fourthFormGroup.get('ccvNumber')?.value;
    const partes = pattern.split(/\D/); // Divide la cadena en partes usando cualquier carácter no numérico como separador
    const length = partes.find((part: string) => part !== "");    
    if(ccv.toString().length !==  parseInt(length)){
      this.errorCCV = `Digite ${length} dígitos`;
    }else{
      this.errorCCV = 'true';
    }
 }

  checkCardNumberLength( ){
    this.errorCardNumber= '';
    const pattern = this.selectedCreditcard.cardNumberRegExp;
    const numberLength = this.fourthFormGroup.get('cardNumber')?.value;
    const partes = pattern.split(/\D/); // Divide la cadena en partes usando cualquier carácter no numérico como separador
    const length = partes.find((part: string) => part !== "");   
    console.log(length); 
    console.log(numberLength.toString().lengthth); 
    if(numberLength.toString().length !==  parseInt(length)){
      this.errorCardNumber = `Digite ${length} dígitos`;
    }else{
      this.errorCardNumber = 'true';
    }
    console.log(this.errorCardNumber );
 }

  onSearchChange(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value;
  }

  checkLStorage(){

    const unity = getDataLS('form_unity');
    const paymentInitMonth = getDataLS('form_initPayment');
    const gv = getDataLS('form_gv');
    const adjustment = getDataLS('form_adjustment');
    const fixedDeposit = getDataLS('form_fixedDeposit');
    const paymentMethod = getDataLS('form_paymentMethod');
    const bankSelected= getDataLS('form_bank');
    const bankAccount = getDataLS('form_bankAccount');
    const creditcardData = getDataLS('form_creditcardData');

    if(fixedDeposit && fixedDeposit !== ''){
      this.showLastMonthPayment = true;
    }

    if(creditcardData && creditcardData !== ''){

      setTimeout(()=>{
        this.arrCreditcards.forEach((item: any) => {
          if (item.idcreditcard === creditcardData.selectedCreditcardId) {
              this.selectedCreditcardId = item.idcreditcard;
              this.selectedCreditcard = item;
              }
             }
            )
            console.log(this.arrCreditcards);
            console.log(creditcardData);
            console.log(this.selectedCreditcard);
      }, 1500)
     
    }

    if(paymentMethod && paymentMethod !== ''){
      
      this.paymentMethod = paymentMethod;
      if(bankSelected && bankSelected !== ''){
        this.showBankLogo = true;
      }else if(paymentMethod === 'Cartão de Crédito' ){
        if(creditcardData && creditcardData.name && creditcardData.name !== '' ){
          this.showCreditcardLogo = true;
          this.pathCreditcardLogo = creditcardData.pathCreditcardLogo;
        }
      }
    }

    if(bankAccount && bankAccount !== ''){
      this.dataBankEmited = bankAccount;
      if(bankAccount.bankLogo && bankAccount.bankLogo !== ''){
        this.pathBankLogo = bankAccount.bankLogo;
      }
    } 
    if(bankSelected && bankSelected !== ''){
      this.selectedBank = bankSelected;
    } 


    this.fourthFormGroup.patchValue({
      unity: (unity) ? unity : '',
      paymentInitMonth: (paymentInitMonth) ? paymentInitMonth : '',
      gv: (gv) ? gv : '',
      adjustment: (adjustment) ? adjustment : '',
      fixedDeposit: (fixedDeposit) ? fixedDeposit : '',
      paymentMethod: (paymentMethod) ? paymentMethod : '',
      bankaccount: (bankSelected ) ? bankSelected.name : '',
      rAgencia: (bankAccount && bankAccount.rAgencia) ? bankAccount.rAgencia : '',
      rNr_cc: (bankAccount&& bankAccount.rNr_cc) ? bankAccount.rNr_cc : '',
      agenciaName: (bankAccount && bankAccount.agenciaName) ? bankAccount.agenciaName : '',
      agenciaAddress: (bankAccount && bankAccount.agenciaAddress) ? bankAccount.agenciaAddress : '',
      creditcard:  (creditcardData && creditcardData.name ) ? creditcardData.name : '',
      cardNumber: (creditcardData && creditcardData.cardNumber) ? creditcardData.cardNumber : '',
      ccvNumber: (creditcardData && creditcardData.ccvNumber) ? creditcardData.ccvNumber : '',
      bankAgreements: (creditcardData && creditcardData.bankAgreements) ? creditcardData.bankAgreements : '',
    });
  
  }

  verAccountDrawer(){
    console.log(this.selectedBank);
    this.drawerService.openDrawerVerAccount(this.selectedBank);
  }

  goTo( value:any){

    setTimeout( () => {
  
      value.nativeElement.scrollIntoView(
      { 
        alignToTop: true,
        behavior: "smooth",
        block: "center",
      });
     }
    )
  }

  validField(field: string) {
    const control = this.fourthFormGroup.get(field);
    if (field === 'paymentInitMonth' && this.showErrorPaymentInit) {
      return true;
    }
    return control && control.invalid && (control.dirty || control.touched);
  }

}

