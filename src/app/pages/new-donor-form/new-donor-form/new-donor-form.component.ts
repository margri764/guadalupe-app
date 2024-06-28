import { BreakpointObserver } from '@angular/cdk/layout';
import { STEPPER_GLOBAL_OPTIONS, StepperOrientation } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subscription,  map, of, startWith, take } from 'rxjs';
import { AppState } from 'src/app/shared/redux/app.reducer';
import { getDataLS, saveDataLS } from 'src/app/shared/storage';
import Swal from 'sweetalert2';
import * as authActions from '../../../shared/redux/auth.actions';
import { BankCreditcardService } from 'src/app/services/bank-creditcard.service';
import { DiocesisCidadeService } from 'src/app/services/diocesis-cidade.service';
import { ResultFuenteService } from 'src/app/services/result-fuente.service';
import { AssociationService } from 'src/app/services/association.service';
import { SegmentationService } from 'src/app/services/segmentation.service';
import { ValidateService } from 'src/app/services/validate.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { CurrencyMaskConfig, CurrencyMaskModule } from "ng2-currency-mask";
import { AssociationLogoPipe } from "../../../pipe/association-logo.pipe";
import { FormAddressComponent } from "../../form-address/form-address/form-address.component";
import { DataBankComponent } from "../../form-data-bank/data-bank/data-bank.component";
import { SummaryComponent } from "../../summary/summary/summary.component";

interface EmailSegmentationPair {
  email: string;
  segmentation: string;
}

interface PhoneSegmentationPair {
  phone: string;
  segmentation: string;
}
interface accountOwner {
  fullName: string;
  cpf: string
}

interface addedPerson{
  fullName : string,
  relationship: string,
  phone : string,
  segmentation : string
  titular:boolean,
  cpf?:string,
}



@Component({
    selector: 'app-new-donor-form',
    standalone: true,
    templateUrl: './new-donor-form.component.html',
    styleUrl: './new-donor-form.component.scss',
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { showError: true, displayDefaultIndicatorType: false },
        },
    ],
    imports: [CommonModule, MaterialModule, RouterModule, CurrencyMaskModule, ReactiveFormsModule, AssociationLogoPipe, FormAddressComponent, DataBankComponent, SummaryComponent]
})
export class NewDonorFormComponent {


  @ViewChild ('person' , {static: true} ) person! : ElementRef;
  @ViewChild("formPeople") formPeople: ElementRef;
  
  stepperOrientation: Observable<StepperOrientation>;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  // fifthFormGroup: FormGroup;
  relacaoFormGroup: FormGroup;
  isLinear : boolean = true;
  showChecked : boolean = false;
  acronym : string = "R$";
  formattedValue: string | null = '';
  mill : string = 'vírgula';
  decimal: string = '00';
  disableNextButton : boolean = false;
  emails: string[] = [];
  phones: string[] = [];
  relacaosPhones: string[] = [];
  emailSegmentationPairs: EmailSegmentationPair[] = [];
  phoneSegmentationPairs: PhoneSegmentationPair[] = [];
  relacaoPhoneSegmentationPairs: PhoneSegmentationPair[] = [];
  showAddPerson : boolean = false;
  showMsgInvalidEmail : boolean = false;
  showMsgInvalidPhone : boolean = false;
  isStepTwoDisabled : boolean = false;
  relacaoTelephoneError : boolean = false;
  relatedPerson : any []=[];
  checkSegmentationError : boolean = false;
  isEditingEmail : boolean = false;
  isEditingPhone : boolean = false;
  editingEmailIndex : any;
  editingPhoneIndex : any;
  isEditingRelacaoPhone : any;
  editingRelacaoPhoneIndex : any;
  isLoading : boolean = false;

  private unsubscribe$: Subscription;


  selectedIndexEmail: number | null = null;
  selectedIndexPhone: number | null = null;
  selectedIndexRelacaoPhone: number | null = null;
  arrAddedRelatedPersons : any [] = [];
  phonesRelatedPersons : any [] = []; 
  isEditingRelacaoPerson : boolean = false;
  indexEditingRelacaoPerson : any;
  searchText: string = '';
  showErrorAnniversary : boolean = false;
  isRelacaoPhoneAdded : boolean = false;

  arrDioceses : any[]=[];
  arrCities : any[]=[];
  arrFontes : any[]=[];
  arrResults : any[]=[];
  arrAssociations : any[]=[];
  arrTratamentos : any[]=[];
  arrProfessions : any[]=[];
  arrEmailSegmentations : any[]=[];
  arrPhoneSegmentations : any[]=[];
  arrRelacaoSegmentations : any[]=[];

  selectedDioceseId : any;
  selectedCityId : any;
  selectedFonteId : any;
  selectedResultId : any;

  private citiesOptionsSubject: BehaviorSubject<string[]>  = new BehaviorSubject<string[]>([]);
  private resultOptionsSubject: BehaviorSubject<string[]> | null = new BehaviorSubject<string[]>([]);

  emailsOptions: Observable<string[]> | undefined;
  phonesOptions: Observable<string[]> | undefined;
  professionsOptions: Observable<string[]> | undefined;
  tratamentosOptions: Observable<string[]> | undefined;

  citiesOptions: Observable<string[]> | undefined = this.citiesOptionsSubject?.asObservable();
  diocesesOptions: Observable<any []> | undefined ;
  fontesOptions: Observable<string[]> | undefined;
  resultsOptions: Observable<string[]> | undefined = this.citiesOptionsSubject?.asObservable();
  associationOptions: Observable<string[]> | undefined;
  relacaosOptions: Observable<string[]> | undefined;

  cpf: string = '';
  diocese: string = '';
  city: string = '';
  fonte: string = '';
  result: string = '';
  association: string = '';
  amount: string = '';
  tratamento: string = '';
  fullName: string = '';
  anniversary: string = '';
  accountOwner : accountOwner | null;
  removeTitularFromRelacao: boolean = false;
 

  currencyOptions: CurrencyMaskConfig = {
    align: 'right',
    allowNegative: false,
    decimal: ',',
    thousands: '.',
    precision: 0,
    prefix: '',
    suffix: '',
  };

  relacaosSegmentations: any [] = [];
  phoneRelacaosSegmentations: any [] = [];
  phoneSegmentations: any [] = [];
  emailSegmentations: any [] = [];
  professions: any [] = [];
  tratamentos: any [] = [];
  results : any [] = [];
  fontes : any [] = [];
  associations : any [] = [];
  cities : any [] = [];
  dioceses : any [] = [];
  bank:any;

  constructor(
              private fb: FormBuilder,
              private bankCreditcardService : BankCreditcardService,
              private toastr: ToastrService,
              private diocesisCidadeService : DiocesisCidadeService,
              private resultFuenteService : ResultFuenteService,
              private associationService : AssociationService,
              private segmentationService : SegmentationService,
              breakpointObserver: BreakpointObserver,
              private store : Store<AppState>,
              private cdr : ChangeDetectorRef,
              private ngZone: NgZone,
              private validatorService : ValidateService,
         
             ) 
  {

    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));

    this.firstFormGroup = this.fb.group({
      diocese: ['', Validators.required],
      city: ['', Validators.required],
      association: ['', Validators.required],
      fonte: ['', Validators.required],
      result: ['', Validators.required],
    });

    this.secondFormGroup = this.fb.group({
      cpf: [null],
      tratamento: ['', Validators.required],
      fullName: ['', Validators.required],
      anniversary: ['', Validators.required],
      profession: ['', Validators.required],
      phone: [''],
      pairPhones: this.fb.array([]),
      checkPairEmails: ['', Validators.required],
      checkPairPhones: ['', Validators.required],
      email: [ ''],
      formOwn: [ ''],
      phoneSegmentation: [''],
      emailSegmentation: [''],
      pairEmails: this.fb.array([]),
    });
    // email:     [ '', [Validators.required, Validators.pattern(this.validatorService.emailPattern)] ],

    setTimeout(()=>{this.bank = "assets/images/no-image.jpg";},100)
 
    this.relacaoFormGroup = this.fb.group({
      cpfRelacao: [null],
      relacaoOwn: [''],
      fullNameRelacao: ['', Validators.required],
      relacaoPhone: ['', Validators.required],
      relationship: ['', Validators.required],
      pairRelacaoPhones: [''],
      relacaoPhoneSegmentation: [''],
    });

    this.thirdFormGroup = this.fb.group({
      check: ['w'],
    })

  
    this.fourthFormGroup = this.fb.group({
      amount: ['', Validators.required],
    })


  
  }

   
  ngOnInit(): void {

    this.checkLStorage();

    this.diocesisCidadeService.getAllDioceses().subscribe(({ success, dioceses }) => {
      if (success) {
        this.dioceses = dioceses.map( (item:any)=>(item.name));
        this.arrDioceses = dioceses;
        this.diocesesOptions = this.firstFormGroup.get('diocese')?.valueChanges.pipe(
          startWith(''),
          map(value => this.filterByDiocese(value || '')) 
        );
      }
    });
 
    this.resultFuenteService.getAllFuentes().subscribe(({ success, fontes }) => {
      if (success) {
        this.fontes = fontes.map( (item:any)=>(item.acronym));
        this.arrFontes = fontes;
        this.fontesOptions = this.firstFormGroup.get('fonte')?.valueChanges.pipe(
          startWith(''),
          map(value => this.filterByFonte(value || '')),
        );
      }
    });

    this.associationService.getAllAssociations().subscribe(({ success, associations }) => {
      if (success) {
        this.associations = associations.map( (item:any)=>(item.name));
        this.arrAssociations = associations;
        this.associationOptions = this.firstFormGroup.get('association')?.valueChanges.pipe(
          startWith(''),
          map(value => this.filterByAssociation(value || '')),
        );
      }
    });

    this.segmentationService.getAllTratamentos().subscribe( ( {success, tratamentos} )=>{
        if(success){
          this.tratamentos = tratamentos.map( (item:any)=>(item.name));
          this.arrTratamentos = tratamentos;
          this.tratamentosOptions = this.secondFormGroup.get('tratamento')?.valueChanges.pipe(
            startWith(''),
            map(value => this.filterByTratamento(value || '')),
          );
        }
      }
    )

    this.segmentationService.getAllProfessions().subscribe( ( {success, professions} )=>{
        if(success){
          this.professions = professions.map( (item:any)=>(item.name));
          this.arrProfessions = professions;
          console.log('');
          this.professionsOptions = this.secondFormGroup.get('profession')?.valueChanges.pipe(
            startWith(''),
            map(value => this.filterByProfession(value || '')),
          );
      
        }
      }
    )

    this.segmentationService.getAllEmailSegmentation().subscribe( ( {success, emailSegmentations} )=>{
      if(success){
        this.emailSegmentations = emailSegmentations.map( (item:any)=>(item.name));
        this.arrEmailSegmentations = emailSegmentations;
        this.emailsOptions = this.secondFormGroup.get('pairEmails')?.valueChanges.pipe(
          startWith(''),
          map(value => this.filterByEmail(value || '')),
        );
    
      }
    }
    )

    this.segmentationService.getAllPhoneSegmentation().subscribe( ( {success, phoneSegmentations} )=>{
      if(success){
        this.phoneSegmentations = phoneSegmentations.map( (item:any)=>(item.name));
        this.arrPhoneSegmentations = phoneSegmentations;
        this.phonesOptions = this.secondFormGroup.get('pairPhones')?.valueChanges.pipe(
          startWith(''),
          map(value => this.filterByPhone(value || '')),
        );
    
      }
    }
    )

    this.segmentationService.getAllRelationships().subscribe( ( {success, relationships} )=>{
      if(success){
        this.relacaosSegmentations = relationships.map( (item:any)=>(item.name));
        this.arrRelacaoSegmentations = relationships;
        this.relacaosOptions = this.relacaoFormGroup.get('relationship')?.valueChanges.pipe(
          startWith(''),
          map(value => this.filterByRelacao(value || '')),
        );
    
      }
    }
    )

    this.secondFormGroup.get('anniversary')?.valueChanges.subscribe( (value:string) => {
      if(value && value !== ''){
        this.formatInput(value);
      }
    });

    this.secondFormGroup.get('anniversaryRelatedPerson')?.valueChanges.subscribe( (value:string) => {
      if(value && value !== ''){
        this.formatInputRelatedPerson(value);
      }
    });

 
  }


  setCurrencyOptions(){
    let count = 0;
    if( count === 0  ){
      this.currencyOptions.prefix = 'R$ ';
      this.currencyOptions.precision = 2;
      count = count + 1;
    }
  }

  private filterByEmail(value: string) {
    const filterValue = value.toLowerCase();
    return this.emailSegmentations.filter(option => option.toLowerCase().includes(filterValue));
  }

  private filterByRelacao(value: string) {
    const filterValue = value.toLowerCase();
    return this.relacaosSegmentations.filter(option => option.toLowerCase().includes(filterValue));
  }

  private filterByPhone(value: string) {
    const filterValue = value.toLowerCase();
    return this.phoneSegmentations.filter(option => option.toLowerCase().includes(filterValue));
  }

  private filterByProfession(value: string) {
    console.log(value);
    const filterValue = value.toLowerCase();
    return this.professions.filter(option => option.toLowerCase().includes(filterValue));
  }

  private filterByTratamento(value: string) {
    const filterValue = value.toLowerCase();
    return this.tratamentos.filter(option => option.toLowerCase().includes(filterValue));
  }

  private filterByDiocese(value: any) {

    const city = this.firstFormGroup.get('city')?.value;

    if(value === '' && city && city !== '' ){
      this.firstFormGroup.get('city')?.setValue('');
      this.arrCities = [];
      this.cities = [];
    }

    const filterValue = value.toLowerCase();
    return this.dioceses.filter(option => option.toLowerCase().includes(filterValue));
  }

  private filterByCity(value: string) {
    console.log(value);
    const filterValue = value.toLowerCase();
    return this.cities.filter(option => option.toLowerCase().includes(filterValue));
  }

  private filterByFonte(value: string){
   const result =  this.firstFormGroup.get('result')?.value;
    if(value === '' && result && result !== '' ){
      this.firstFormGroup.get('result')?.setValue('');
      this.arrResults = [];
      this.results = [];
    }
    const filterValue = value.toLowerCase();
    return this.fontes.filter(option => option.toLowerCase().includes(filterValue));
  }

  private filterByResult(value: string) {
    const filterValue = value.toLowerCase();
    return this.results.filter(option => option.toLowerCase().includes(filterValue));
  }

  private filterByAssociation(value: string):string[] {
    const filterValue = value.toLowerCase();
    return this.associations.filter(option => option.toLowerCase().includes(filterValue));
  }

  onSearchChange(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value;
  }

  clearSearch(){
    this.searchText = '';
  }

  get first(){
    return this.firstFormGroup.controls;
  }
  get second(){
    return this.secondFormGroup.controls;
  }

  get relacao(){
    return this.relacaoFormGroup.controls;
  }


  formatNumber() {

    let inputValue  = this.fourthFormGroup.get('amount')?.value;


    if(!inputValue || inputValue === ''){
      this.formattedValue = null;
      return
    }

    // Limpiar el valor para que solo contenga números
    let cleanedValue = inputValue.replace(/\D/g, '');

    if(this.mill === 'vírgula'){
      
            // Convertir el número a cadena
          const numberString = cleanedValue.toString();
          // Agregar comas cada 3 dígitos en la parte entera
          const formattedIntegerPart = numberString.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
          if(!this.decimal ){
            this.formattedValue=  formattedIntegerPart;
          }else{
            this.formattedValue=  `${formattedIntegerPart}.${this.decimal}`;
          }

      }else if( this.mill === 'ponto') {
          const numberString = cleanedValue.toString();
          const formattedIntegerPart = numberString.replace(/(\d)(?=(\d{3})+$)/g, '$1.');
          if(!this.decimal ){
            this.formattedValue=  formattedIntegerPart;
          }else{
            this.formattedValue=  `${formattedIntegerPart},${this.decimal}`;
          }

      }


  }

  checkCPF() {

    this.showChecked = false;
    const cpf = this.secondFormGroup.get('cpf');
  
    if (cpf && cpf.value && cpf.value !== '') {
      const isValidCPF = this.bankCreditcardService.validaCPF(cpf.value);
  
      if (!isValidCPF) {
        cpf.setErrors({ 'invalidCPF': true });
      } else {
        cpf.setErrors(null); // Limpiar errores si el CPF es válido
        this.showChecked = true;
        this.cpf = cpf.value;
        saveDataLS('form_cpf', cpf.value);
        localStorage.removeItem('form_cpfRelacao');
      }
    }
  }

  showCheckedRelacao:boolean= false;
  checkCPFRelacao() {

    this.showCheckedRelacao = false;
    const cpf = this.relacaoFormGroup.get('cpfRelacao');
  
    if (cpf && cpf.value && cpf.value !== '') {
      const isValidCPF = this.bankCreditcardService.validaCPF(cpf.value);
  
      if (!isValidCPF) {
        cpf.setErrors({ 'invalidCPF': true });
      } else {
        cpf.setErrors(null); // Limpiar errores si el CPF es válido
        this.showCheckedRelacao = true;
        this.cpf = cpf.value;
        saveDataLS('form_cpfRelacao', cpf.value);
        localStorage.removeItem('form_cpf');

      }
    }
  }
    
  checkDioceseValue() {
    const diocese = this.firstFormGroup.get('diocese')?.value;
    if (!diocese) {
     this.warningToast('Por favor, selecione uma diocese primeiro');
      //esto es para q eliminen las opciones de autocomplete q es async y un obscervable
      // Emitir un nuevo valor inicial (null) a través del observable citiesOptions
      this.citiesOptionsSubject?.next([]);
      // Forzar una emisión de un nuevo valor después de limpiar los arreglos
      this.citiesOptions = this.citiesOptionsSubject?.pipe(startWith([]));
    }
  }

  checkFonteValue() {
    const fonte = this.firstFormGroup.get('fonte')?.value;
    if (!fonte) {
     this.warningToast('Por favor, selecione uma fonte primeiro');
      this.resultOptionsSubject?.next([]);
      this.resultsOptions = this.resultOptionsSubject?.pipe(startWith([]));
      // this.resultsOptions = this.resultOptionsSubject.pipe(startWith(null));
    }
  }

  formatInputRelatedPerson(value: string) {
    const digits = value.replace(/\D/g, ''); // Eliminar caracteres que no sean dígitos
    let formattedValue = '';
  
    if (digits.length <= 2) {
      formattedValue = digits;
    } else if (digits.length <= 4) {
      formattedValue = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else {
      formattedValue = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    }
  
    if (value !== formattedValue) {
      this.secondFormGroup.patchValue({ anniversaryRelatedPerson: formattedValue }, { emitEvent: false });
    }
  }

  formatInput(value: string) {
    console.log(value);

    const digits = value.replace(/\D/g, ''); // Eliminar caracteres que no sean dígitos
    let formattedValue = '';
    let dayError = false;

    if (digits.length <= 2) {
      formattedValue = digits;
      this.showErrorAnniversary = false;
      const toNumber = parseInt(digits)
      if(toNumber > 31){
        this.showErrorAnniversary = true;
        dayError = true;
      }else{
        dayError = false;
      }
    } else if (digits.length <= 4 ) {
        let monthError = false;
        if(dayError){
          this.secondFormGroup.patchValue({ anniversary: digits.slice(0, 2)});
          return
        }else{
         this.showErrorAnniversary = false;
        const month = parseInt(digits.slice(2, 4));
        if(month > 12){
          this.showErrorAnniversary = true;
          const inputValue =  this.secondFormGroup.get('anniversary')?.value;
          this.secondFormGroup.patchValue({ anniversary: inputValue.slice(0, 3)} , { emitEvent: false });
          monthError = true;
          return
        }
          formattedValue = `${digits.slice(0, 2)}/${digits.slice(2)}`;
          monthError = false;
      }
      
    } else {

      let year = null;
       if(digits.length === 8){
        year = parseInt(digits.slice(4,8));
        if(year < 1910 || year > 2030){
          this.showErrorAnniversary = true;
          return
        }else{
          this.showErrorAnniversary = false;
        }
       } 
    
      formattedValue = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;

    }
    if (value !== formattedValue ) {
      this.secondFormGroup.patchValue({ anniversary: formattedValue }, { emitEvent: false });
    }
      if(this.showErrorAnniversary){
        this.secondFormGroup.get('checkPairEmails')?.setValue('');
      }else{
        this.secondFormGroup.get('checkPairEmails')?.setValue(true);
      }
  }

  isTitularInRelacao : boolean = false;

  saveAddedPerson(){
    const cpfRelacao = this.relacaoFormGroup.get('cpfRelacao')?.value;
    const relacaoOwn = this.relacaoFormGroup.get('relacaoOwn')?.value;
    const fullName = this.relacaoFormGroup.get('fullNameRelacao')?.value;
    const relationship = this.relacaoFormGroup.get('relationship')?.value;
    const relacaoPhone = this.relacaoFormGroup.get('relacaoPhone')?.value;
    
    if ( this.relacaoFormGroup.invalid ) {
      this.relacaoFormGroup.markAllAsTouched();
      return;
    }
    
    // si se selecciona a una persona adicionada como titular de la cuenta necesito el cpf
    if( (!cpfRelacao || cpfRelacao === '') && (relacaoOwn && relacaoOwn !== '')  ){
      return
    }
    // busco q siempre esten las duplas completas
    const foundPhone = this.relacaoPhoneSegmentationPairs.find(pair => pair.phone === relacaoPhone);
    if(!foundPhone || foundPhone.segmentation === ''){
      this.warningToast('Todos os números de telefone devem ter a propriedade "tipo" atribuída.');
      return
    }
  
    // es la persona q se intenta agregar
    let addedPerson = { fullName, relationship, phone: foundPhone.phone, segmentation: foundPhone.segmentation , cpf: cpfRelacao };

    if(cpfRelacao && cpfRelacao !==''){
      this.isTitularInRelacao = true;
      saveDataLS('form_cpfRelacao', cpfRelacao)
    }

    
    // antes de agregar busco q no este en el array de personas agregadas en esta sesion
    const findAddedPerson = this.relatedPerson.find( item => item.fullName === fullName);

    if (!findAddedPerson || this.isEditingRelacaoPerson ) {

      // si esta editando lo quito del array para crear un obj nuevo mas abajo
      if(this.isEditingRelacaoPerson){
        this.relatedPerson.splice(this.indexEditingRelacaoPerson, 1);
      }


      // si estoy editando me fijo en la bandera q cree en el slider para saber si tengo q eliminar o no al titular
      if(this.removeTitularFromRelacao){
        addedPerson = {...addedPerson, cpf : ''};
        this.isTitularInRelacao = false;
        localStorage.removeItem('form_cpfRelacao');
        this.removeTitularFromRelacao = false;
        this.relatedPerson.push({
          ...addedPerson,
          cpfRelacao: '',
        });
      }else{

      // si no estaba agregado lo hago ahora
      console.log(  this.relatedPerson);
  
      this.relatedPerson.push({
        ...addedPerson,
        cpfRelacao: cpfRelacao,
      });

      console.log(  this.relatedPerson);

      
      const body : addedPerson[] = this.relatedPerson.map(person => ({
        fullName: person.fullName,
        relationship: person.relationship,
        phone: person.phone,
        segmentation: person.segmentation,
        cpf: person.cpfRelacao && person.cpfRelacao !== '' ? person.cpfRelacao : '',
        titular: person.cpfRelacao && person.cpfRelacao !== '' ? true : false,
      })
    )
    saveDataLS('addedPerson', body);

      this.store.dispatch(authActions.addFormAddedPerson({formAddedPerson: body}))

      this.phonesRelatedPersons = this.relacaoPhoneSegmentationPairs;
      this.relacaoPhoneSegmentationPairs = [];
    }
    } else if(findAddedPerson && !this.isEditingRelacaoPerson) {
      this.warningToast('A pessoa que você está tentando adicionar já está na lista');
    }
      this.relacaoFormGroup.reset();
      this.showAddPerson = false;
      this.isRelacaoPhoneAdded = false;
      this.isEditingRelacaoPerson = false;
      this.showCheckedRelacao = false;

     console.log(this.relatedPerson);
    
  }

  removeAddedPerson( person:any){
    this.relatedPerson = this.relatedPerson.filter(item => item.fullName !== person.fullName);
    localStorage.removeItem('addedPerson');
    if(person.cpf && person.cpf !== ''){
      this.isTitularInRelacao = false;
      localStorage.removeItem('form_cpfRelacao');
    } 
    if(this.relatedPerson.length > 0){
      saveDataLS('addedPerson', this.relatedPerson);
      
    }else{
      this.relacaoTelephoneError = true;
    }
  }

  setAccountOwner($event : MatSlideToggleChange, owner:any): void{
    let isChecked = $event.checked;
    // console.log(isChecked);
    const cpf = this.secondFormGroup.get('cpf')?.value;
    const fullName = this.secondFormGroup.get('fullName')?.value;
    const cpfRelacao = this.relacaoFormGroup.get('cpfRelacao')?.value;
    const fullNameRelacao = this.relacaoFormGroup.get('fullNameRelacao')?.value;

    if( owner === 'formPeople'){
      if(!cpf || cpf === '' || !fullName || fullName === ''){
        alert('es necesario q primero ingreses el cpf y los demas datos de la persona');
        this.secondFormGroup.get('formOwn')?.setValue('');

        return
      }else{

      // pimero chequeo q no este ya seleccionado un titular en Relacao  
      const isTitularInRelacao = this.relatedPerson.some((person) => { return person.cpf && person.cpf !== ''});
      if(isTitularInRelacao  && isChecked){
          this.showWarningSwalTitularRelacao();
          this.segmentationService.authRemplaceTitularRelacao$.subscribe( (auth)=>{ 
            if(auth){
              //  this.relatedPerson.forEach( (person)=>{
              //     if(person.cpf !== null){ person.cpf = null;}
              // })
                    // Si hay una persona relacionada titular, le elimino la tutalridad 

              this.relatedPerson.forEach((person:any) => { 
                if(person.cpf && person.cpf !== ''){
                    person.cpf = ''
                } });
              saveDataLS('addedPerson', this.relatedPerson);


             this.secondFormGroup.get('relacaoOwn')?.setValue('formPeople');
            }else{
              // como hago un return no quiero q quede seleccionado el slider
              this.secondFormGroup.get('formOwn')?.setValue('');
              return
            }
          })
      }
        // si todavia no fue seleccionado el titular
        this.secondFormGroup.get('formOwn')?.setValue('formPeople');
        this.relacaoFormGroup.get('relacaoOwn')?.setValue('');
        this.isTitularInRelacao = false;
        this.accountOwner = { cpf, fullName };
      }
    }else if(owner === 'relacaoPeople'){

      const cpf =  this.secondFormGroup.get('formOwn')?.value;
      if(cpf && cpf !== ''){
        this.warningToast('Com esta opção, o titular da conta selecionado anteriormente será substituído');
      }

      // cada vez q selecciono me fijo si hay algun titular en related
      const isTitularInRelacao = this.relatedPerson.some((person) => { return person.cpf && person.cpf !== ''});

      // al seleccionar el slider de titular de Relacao, primero quiero saber si ya hay un titular q este en el array relatedPerson, si no esta sigo ejecutando, en el caso q este tengo la posibilidad de reemplazarlo o si se trta d eun error cancelar la nueva asignacion
        if(isTitularInRelacao  && isChecked){
          this.showWarningSwalTitularRelacao();
          this.segmentationService.authRemplaceTitularRelacao$.subscribe( (auth)=>{ 
            if(auth){
               this.relatedPerson.forEach( (person)=>{
                  if(person.cpf !== null){
                    console.log(person);
                    person.cpf = null;
                  }
              })

             this.relacaoFormGroup.get('relacaoOwn')?.setValue('relacaoPeople');
             this.secondFormGroup.get('formOwn')?.setValue('');
             this.accountOwner = { cpf: cpfRelacao, fullName: fullNameRelacao }
            }else{
              // como hago un return no quiero q quede seleccionado el slider
              this.relacaoFormGroup.get('relacaoOwn')?.setValue('');
              return
            }
          })

        }else if(isChecked){ // si esta seleccionando y no hay ningun titular relacionado con relacao
          this.relacaoFormGroup.get('relacaoOwn')?.setValue('relacaoPeople');
          this.secondFormGroup.get('formOwn')?.setValue('');
          this.accountOwner = { cpf: cpfRelacao, fullName: fullNameRelacao }
        }else{ // con esto estoy cancelando (eliminado) el titular
          this.relacaoFormGroup.get('relacaoOwn')?.setValue('');
          if(cpfRelacao && cpfRelacao !== ''){ // creo una bandera de q se debe eliminar en el "Editar pessoa"
            this.removeTitularFromRelacao = true;

            this.relatedPerson.forEach((person:any) => { 
                  if(person.cpf && person.cpf !== ''){
                      person.cpf = ''
                  } });
            saveDataLS('addedPerson', this.relatedPerson);
          }
          this.accountOwner = null;
        }
    }

    console.log(this.accountOwner);
  }
  
  addEmail() {
    
    const email = this.secondFormGroup.get('email')?.value;
    if (!email || email === '')return;

    const pair = this.emailSegmentationPairs.find(pair => pair.email === email);
 
    if (!pair) {
      const newPair = { email: email, segmentation: '' };
      this.emailSegmentationPairs = [...this.emailSegmentationPairs, newPair];
      
    }else{
      this.warningToast('Não é possível repetir um e-mail')
    }
    this.secondFormGroup.get('email')?.setValue('');
    this.checkEmailsSegmentations();
  }

  addPhone() {

    const phone = this.secondFormGroup.get('phone')?.value;
    if (!phone || phone === '')return;

    const pair = this.phoneSegmentationPairs.find(pair => pair.phone === phone);

    if (!pair) { 
      const newPair = { phone: phone, segmentation: '' };
      this.phoneSegmentationPairs = [...this.phoneSegmentationPairs, newPair];
    }else{
      this.warningToast('Não é possível repetir um telefone')
    }
    this.secondFormGroup.get('phone')?.setValue('');
    this.checkPhonesSegmentations();

  }

  addRelacaoPhone() {

    if(  this.isRelacaoPhoneAdded === true)return // para q solo se agregue un telefono

    const phone = this.relacaoFormGroup.get('relacaoPhone')?.value;
    if (!phone || phone === '')return;

    const pair = this.relacaoPhoneSegmentationPairs.find(pair => pair.phone === phone);

    if (!pair) { 
      const newPhoneRelated = {phone : phone, segmentation: ''};
      this.relacaoPhoneSegmentationPairs.push(newPhoneRelated); 
    }else{
      this.warningToast('Não é possível repetir um telefone')
    }
    // this.relacaoFormGroup.get('relacaoPhone').setValue('');
  }

  removeEmail(email: string) {
    this.emails = this.emails.filter(element => element !== email);
    this.emailSegmentationPairs = this.emailSegmentationPairs.filter(pair => pair.email !== email);
    localStorage.removeItem('form_emails');
    if(this.emailSegmentationPairs.length > 0){
      saveDataLS('form_emails', this.emailSegmentationPairs);
      this.store.dispatch(authActions.unSetFormEmails());
      this.store.dispatch(authActions.addFormEmails({formEmails: this.emailSegmentationPairs}));
    }
  }

  removePhone(phone: string) {
    this.phones = this.phones.filter(element => element !== phone);
    this.phoneSegmentationPairs = this.phoneSegmentationPairs.filter(pair => pair.phone !== phone);
    localStorage.removeItem('form_phones');
    if(this.phoneSegmentationPairs.length > 0){
      saveDataLS('form_phones', this.phoneSegmentationPairs);
      this.store.dispatch(authActions.unSetFormPhones());
      this.store.dispatch(authActions.addFormPhones({formPhones: this.phoneSegmentationPairs}));

    }
  }

  removeRelacaoPhone(phone: string) {
    this.relacaosPhones = this.relacaosPhones.filter(element => element !== phone);
    this.relacaoPhoneSegmentationPairs = this.relacaoPhoneSegmentationPairs.filter(pair => pair.phone !== phone);
    this.isRelacaoPhoneAdded = false;
  }

  onEmailSelected(email: any, event: MatAutocompleteSelectedEvent) {
    const selectedValue = event.option.value;
    const pair = this.emailSegmentationPairs.find(pair => pair.email === email.email);
    if (pair) {
      const existingPair = this.emailSegmentationPairs.find(item => item.segmentation === selectedValue);
      if (existingPair) {
        this.warningToast('Não é possível repetir uma segmentação')
      } else {
        pair.segmentation = selectedValue;
        saveDataLS('form_emails', this.emailSegmentationPairs);
        this.store.dispatch(authActions.addFormEmails({formEmails: this.emailSegmentationPairs}));

      }
    }
    this.checkEmailsSegmentations();
  }

  onPhoneSelected(phone:any, event: MatAutocompleteSelectedEvent) {
    const selectedValue = event.option.value;
    const pair = this.phoneSegmentationPairs.find(pair => pair.phone === phone.phone);
    const existingPair = this.phoneSegmentationPairs.find(item => item.segmentation === selectedValue);
    if (existingPair) {
      this.warningToast('Não é possível repetir uma segmentação')
    } else {
      if(pair){
         pair.segmentation = selectedValue;
         pair.segmentation = selectedValue;
         saveDataLS('form_phones', this.phoneSegmentationPairs);
         this.store.dispatch(authActions.addFormPhones({formPhones: this.phoneSegmentationPairs}));
      }
    }
    this.checkPhonesSegmentations();

  }

  onRelacaoPhoneSelected(phone:any, event: MatAutocompleteSelectedEvent) {
    const selectedValue = event.option.value;
    const pair = this.relacaoPhoneSegmentationPairs.find(pair => pair.phone === phone);
    if (pair) {
      pair.segmentation = selectedValue;
    }
  }  

  onProfessionSelected(event: MatAutocompleteSelectedEvent){
    const selectedValue = event.option.value;

    if(selectedValue && selectedValue !== ''){
      this.professions = selectedValue;
      saveDataLS('form_profession', selectedValue)
    }
  }

  onTratamentoSelected(){
    const selectedValue = this.secondFormGroup.get('tratamento')?.value;
    if(selectedValue && selectedValue !== ''){
      this.tratamento = selectedValue;
      saveDataLS('form_tratamento', selectedValue)
    }
  }

  onFullNameSelected(){
    const selectedValue = this.secondFormGroup.get('fullName')?.value;
    if(selectedValue && selectedValue !== ''){
      this.fullName = selectedValue;
      saveDataLS('form_fullName', selectedValue)
    }else{
      localStorage.removeItem('form_fullName');
    }
  }

  onAnniversarySelected(){

    const selectedValue = this.secondFormGroup.get('anniversary')?.value;
    if(selectedValue && selectedValue !== ''){
      this.anniversary = selectedValue;
      if(!this.showErrorAnniversary){
        saveDataLS('form_anniversary', selectedValue)
      }
    }else{
      localStorage.removeItem('form_anniversary');
    }
  }

  onCitySelected(event: MatAutocompleteSelectedEvent){
    const selectedValue = event.option.value;
    if(selectedValue && selectedValue !== ''){
      this.city = selectedValue;
      saveDataLS('form_city', selectedValue)
    }
  }

  onDioceseSelected(event: MatAutocompleteSelectedEvent){

    const selectedValue = event.option.value;
    this.arrDioceses.forEach( (item:any)=>{
      if(item.name === selectedValue){
      this.selectedDioceseId = item.iddiocese
      }
    })

    if(selectedValue && selectedValue !== ''){
      this.diocese = selectedValue;
      saveDataLS('form_diocese', selectedValue)
    };

    this.diocesisCidadeService.getCitiesFromDiocese( this.selectedDioceseId).subscribe(({ success, dioceses }) => {
      if(success) {
        this.cities = dioceses.map( (item:any)=>(item.name));
        this.arrCities = dioceses;
        this.citiesOptions = this.firstFormGroup.get('city')?.valueChanges.pipe(
          startWith(''),
          map(value => this.filterByCity(value || '')) 
        );
      }
    });

  }

  onFonteSelected(event: MatAutocompleteSelectedEvent){
    const selectedValue = event.option.value;

    this.arrFontes.forEach( (item:any)=>{
      if(item.acronym === selectedValue){
       this.selectedResultId = item.idfonte;
      }
    })

    if(selectedValue && selectedValue !== ''){
      this.fonte = selectedValue;
      saveDataLS('form_fonte', selectedValue)
    }
    this.resultFuenteService.getResultsFromFonte( this.selectedResultId).subscribe(({ success, results }) => {
      if (success) {
        this.results = results.map( (item:any)=>(item.acronym));
        this.arrResults = results;
        console.log(this.results);
        this.resultsOptions = this.firstFormGroup.get('result')?.valueChanges.pipe(
          startWith(''),
          map(value => this.filterByResult(value || '')) 
        );
      }
    });
  }

  onResultSelected(event: MatAutocompleteSelectedEvent){
    const selectedValue = event.option.value;
    if(selectedValue && selectedValue !== ''){
      this.result = selectedValue;
      saveDataLS('form_result', selectedValue)
    }
  }
  selectedAssociation : any | null;
  onAssociationSelected(event: MatAutocompleteSelectedEvent){
    const selectedValue = event.option.value;

    if(selectedValue && selectedValue !== ''){
      this.association = selectedValue;
      this.arrAssociations.forEach((item:any)=>{
        if(item.name === selectedValue){
          this.selectedAssociation = { name: selectedValue, filePath: item.filePath };
          saveDataLS('form_association', this.selectedAssociation)
        }
      })
    };
  }

  onValueSelected(){
    const selectedValue = this.fourthFormGroup.get('amount')?.value;;
    if(selectedValue && selectedValue !== ''){
      this.association = selectedValue;
      saveDataLS('form_amount', selectedValue)
    };
  }

  onRelacaoSelected(event: MatAutocompleteSelectedEvent){
    const selectedValue = event.option.value;
    if(selectedValue && selectedValue !== ''){
      this.relacaoFormGroup.get('relationship')?.setValue(selectedValue)
    }
  }

  onEmailChange($event: Event, index: number) {

    const inputElement = $event.target as HTMLInputElement;
    const newValue = inputElement?.value;
  
    if (newValue === undefined || newValue === null) {
      return;
    }

    const isEmail = this.emailSegmentationPairs.find(pair => pair.email === newValue);
    const foundIndex = this.emailSegmentationPairs.findIndex(pair => pair.email === newValue);
  
    if (isEmail && foundIndex !== index) {
      this.warningToast('Não é possível repetir um e-mail');
    } else {
      // Crear una copia modificable del objeto
      const updatedPairs = [...this.emailSegmentationPairs];
      updatedPairs[index] = { ...updatedPairs[index], email: newValue };
      this.emailSegmentationPairs = updatedPairs;
      saveDataLS('form_emails', this.emailSegmentationPairs);
      this.store.dispatch(authActions.addFormEmails({ formEmails: this.emailSegmentationPairs }));
    }
  }
  

  onPhoneChange($event: Event, index: number) {

    const inputElement = $event.target as HTMLInputElement;
    const newValue = inputElement?.value;
  
    if (newValue === undefined || newValue === null) {
      return;
    }

    const isPhone = this.phoneSegmentationPairs.find(pair => pair.phone === newValue);
    const foundIndex = this.phoneSegmentationPairs.findIndex(pair => pair.phone === newValue)

    if (isPhone && foundIndex !== index) {
      this.warningToast('Não é possível repetir um telefone')
    } else {
      // Crear una copia modificable del objeto
      const updatedPairs = [...this.phoneSegmentationPairs];
      updatedPairs[index] = { ...updatedPairs[index], phone: newValue };
      this.phoneSegmentationPairs = updatedPairs;
      saveDataLS('form_phones', this.phoneSegmentationPairs);
      this.store.dispatch(authActions.addFormPhones({formPhones: this.phoneSegmentationPairs}));
    }
  }


  editRelacaoPerson( person:any, index:any ){
    this.isTitularInRelacao = false;
    this.isRelacaoPhoneAdded = false;
    this.isEditingRelacaoPerson = true;
    this.goToRelatedPerson();
    console.log(person);

    this.relacaoFormGroup.patchValue({
      fullNameRelacao: person.fullName ,
      relationship: person.relationship,
      relacaoPhone: person.phone,
      relacaoPhoneSegmentation: person.segmentation,
      cpfRelacao: person.cpf
    })

    if(person.cpf && person.cpf !==''){
      this.relacaoFormGroup.get('relacaoOwn')?.setValue('relacaoPeople');
      this.secondFormGroup.get('formOwn')?.setValue('');
      this.isTitularInRelacao = true;
      // this.accountOwner = { cpf: cpfRelacao, fullName }
    }


    this.indexEditingRelacaoPerson = index;

    const editedPerson = { phone: person.phone, segmentation: person.segmentation }
    this.relacaoPhoneSegmentationPairs.push(editedPerson);


  }

  checkEmailsSegmentations(): boolean {
    let count = 0;

    if (this.emailSegmentationPairs.length > 0) {
      this.emailSegmentationPairs.forEach((item) => {
        if (item.segmentation === '') {
          count = count + 1;
        }
      });

      if (count === 0) {
        // coloco el control en "valid"
        this.secondFormGroup.get('checkPairEmails')?.setValue(true)
        return true; 
      } else {
        this.secondFormGroup.get('checkPairEmails')?.setValue('')
        return false; 
      }
    }
    this.secondFormGroup.get('checkPairEmails')?.setValue(true)
    return true; 
  }

  checkPhonesSegmentations(): boolean {
    let count = 0;

    if (this.phoneSegmentationPairs.length > 0) {
      this.phoneSegmentationPairs.forEach((item) => {
        if (item.segmentation === '') {
          count = count + 1;
        }
      });

      if (count === 0) {
        // coloco el control en "valid"
        this.secondFormGroup.get('checkPairPhones')?.setValue(true)
        return true; 
      } else {
        this.secondFormGroup.get('checkPairPhones')?.setValue('')
        return false; 
      }
    }
    this.secondFormGroup.get('checkPairPhones')?.setValue(true)
    return true; 
  }

  resetFormAndLStorage(){
    localStorage.removeItem('form_cpf');
    localStorage.removeItem('form_diocese');
    localStorage.removeItem('form_city');
    localStorage.removeItem('form_fonte');
    localStorage.removeItem('form_result');
    localStorage.removeItem('form_association');
    localStorage.removeItem('form_amount');
    localStorage.removeItem('form_tratamento');
    localStorage.removeItem('form_fullName');
    localStorage.removeItem('form_anniversary');
    localStorage.removeItem('form_profession');
    localStorage.removeItem('form_emails');
    localStorage.removeItem('form_phones');
    localStorage.removeItem('addedPerson');
    localStorage.removeItem('addresses');
    localStorage.removeItem('form_creditcardData');
    localStorage.removeItem('form_ownAccount');
    localStorage.removeItem('form_bankAgreement');
    localStorage.removeItem('form_gv');
    localStorage.removeItem('form_fullName');
    localStorage.removeItem('form_adjustment');
    localStorage.removeItem('form_unity');
    localStorage.removeItem('form_fixedDeposit');
    localStorage.removeItem('form_paymentMethod');
    localStorage.removeItem('bank');
    localStorage.removeItem('form_initPayment');
    localStorage.removeItem('form_bankAccount');

    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    this.emails = [];
    this.emailSegmentationPairs = [];
    this.phones = [];
    this.phoneSegmentationPairs = [];
    this.relacaosPhones = [];
    this.relacaoPhoneSegmentationPairs = [];
    this.relatedPerson = [];

    this.store.dispatch(authActions.unSetFormAddedPerson());
    this.store.dispatch(authActions.unSetFormAddress());
    this.store.dispatch(authActions.unSetFormAdjustment());
    this.store.dispatch(authActions.unSetFormBank());
    this.store.dispatch(authActions.unSetFormBankAccount());
    this.store.dispatch(authActions.unSetFormCreditcard());
    this.store.dispatch(authActions.unSetFormEmails());
    this.store.dispatch(authActions.unSetFormFixedDeposit());
    this.store.dispatch(authActions.unSetFormGv());
    this.store.dispatch(authActions.unSetFormPaymentInitMonth());
    this.store.dispatch(authActions.unSetFormPaymentMethod());
    this.store.dispatch(authActions.unSetFormPhones());


    // localStorage.removeItem('');

  }

  checkLStorage(){

    // firstForm
    const cpfRelacao = getDataLS('form_cpfRelacao');
    const diocese = getDataLS('form_diocese');
    const city = getDataLS('form_city');
    const fonte = getDataLS('form_fonte');
    const result = getDataLS('form_result');
    const association = getDataLS('form_association');
    const amount = getDataLS('form_amount');

    // secondForm
    const cpf = getDataLS('form_cpf');
    const tratamento = getDataLS('form_tratamento');
    const fullName = getDataLS('form_fullName');
    const anniversary = getDataLS('form_anniversary');
    const profession = getDataLS('form_profession');
    const emails = getDataLS('form_emails');
    const phones = getDataLS('form_phones');
    const addedPerson = getDataLS('addedPerson');
    const addresses = getDataLS('addresses');
    const ownAccount = getDataLS('form_ownAccount');

    //fourthForm
    const unity = getDataLS('form_unity');
    const paymentInitMonth = getDataLS('form_initPayment');
    const gv = getDataLS('form_gv');
    const adjustment = getDataLS('form_adjustment');
    const fixedDeposit = getDataLS('form_fixedDeposit');
    const paymentMethod = getDataLS('form_paymentMethod');
    const bank = getDataLS('form_bank');
    const bankAccount = getDataLS('form_bankAccount');
    const creditcardData = getDataLS('form_creditcardData');



if (cpfRelacao || diocese || city || fonte || result || association || amount ||
  cpf || tratamento || fullName || anniversary || profession || emails || phones || addedPerson || addresses || ownAccount ||
  unity || paymentInitMonth || gv || adjustment || fixedDeposit || paymentMethod || bank || bankAccount || creditcardData) {
this.showWarningSwal();
}

    this.unsubscribe$ = this.segmentationService.authLoadLStorage$.pipe(take(1)).subscribe(
      (auth)=>{
        if(auth){

          this.isLoading = true;

          setTimeout(()=>{ this.isLoading=false},1500);

           // es necesario volver a cargar las ciudades asociadas
          if(diocese){
            this.reloadCitiesFromDiocese(diocese)
          }
           // es necesario volver a cargar los results asociadas
          if(fonte){
            this.reloadResultsFromFonte(fonte)
          }

          if(association && association !== ''){
            this.selectedAssociation = association;
          }
    
          if(cpfRelacao && cpfRelacao !== ''){
            this.isTitularInRelacao = true;
          }else{
            this.isTitularInRelacao = false;
          }

          if(ownAccount && ownAccount !== ''){
            this.secondFormGroup.get('formOwn')?.setValue(ownAccount);
          }

          if (emails && emails !== '') {
            this.emailSegmentationPairs = emails;
            this.store.dispatch(authActions.addFormEmails({formEmails: this.emailSegmentationPairs}));
            const detalleItemsArray = this.secondFormGroup.get('pairEmails') as FormArray;
            detalleItemsArray.clear();
            emails.forEach((email: any) => {
              detalleItemsArray.push(this.fb.group({
                emailSegmentation: email.segmentation 
              }));
            });
          }

          if(phones && phones !== ''){
            this.phoneSegmentationPairs = phones;
            this.store.dispatch(authActions.addFormPhones({formPhones: phones}));
            const detalleItemsArray = this.secondFormGroup.get('pairPhones') as FormArray;
            detalleItemsArray.clear();
            phones.forEach((phone: any) => {
              detalleItemsArray.push(this.fb.group({
                phoneSegmentation: phone.segmentation 
              }));
            });
          }

          if(addedPerson && addedPerson !== ''){
            this.relatedPerson = addedPerson;
          }

          if(amount ){
            this.setCurrencyOptions();
          }

          if(addresses && addresses !== ''){
            this.store.dispatch(authActions.addFormAddress({formAddress:addresses}));
          }

          if(unity && unity !== ''){
             this.store.dispatch(authActions.addFormUnity({formUnity: unity}));
          }

          if(paymentInitMonth && paymentInitMonth !== ''){
             this.store.dispatch(authActions.addFormPaymentInitMonth({formPaymentInitMonth: paymentInitMonth}));
          }

          if(gv && gv !== ''){
             this.store.dispatch(authActions.addFormGv({formGv: gv}));
          }

          if(adjustment && adjustment !== ''){
             this.store.dispatch(authActions.addFormAdjustment({formAdjustment: adjustment}));
          }

          if(fixedDeposit && fixedDeposit !== ''){
             this.store.dispatch(authActions.addFormFixedDeposit({formFixedDeposit: fixedDeposit}));
          }
          
          if(paymentMethod && paymentMethod !== ''){
             this.store.dispatch(authActions.addFormPaymentMethod({formPaymentMethod: paymentMethod}));
          }

          if(bank && bank !== ''){
             this.store.dispatch(authActions.addFormBank({formBank: bank}));
          }

          if(bankAccount && bankAccount !== ''){
              this.store.dispatch(authActions.addFormBankAccount({formBankAccount: bankAccount}))
          }

          if(creditcardData && creditcardData !== ''){
            this.store.dispatch(authActions.addFormCreditcard({formCreditcard: creditcardData}));
          }

          if(addedPerson && addedPerson !== ''){
            this.store.dispatch(authActions.addFormAddedPerson({formAddedPerson: addedPerson}))
          }

          setTimeout(()=>{
              this.firstFormGroup.patchValue({
                diocese: (diocese) ? diocese : '',
                city: (city) ? city : '',
                fonte: (fonte) ? fonte : '',
                result: (result) ? result : '',
                association: (association) ? association.name : '',
                fullName: (fullName) ? fullName : '',
              });
            }, 1000)
            
            
          this.secondFormGroup.patchValue({
            cpf: (cpf) ? cpf : '',
            tratamento: (tratamento) ? tratamento : '',
            fullName: (fullName) ? fullName : '',
            anniversary: (anniversary) ? anniversary : '',
            profession: (profession) ? profession : '',
          });

                 
          // this.fourthFormGroup.patchValue({
          //   amount: (amount) ? amount : '',
    
          // });

          // verifico q no haya errores de q falte alguna dupla
          this.checkEmailsSegmentations();
          this.checkPhonesSegmentations();
          
      
          
        }else{
          this.unsubscribe$.unsubscribe();
        }
      })
     
  }

  reloadCitiesFromDiocese(diocese:any){

    this.arrDioceses.forEach( (item:any)=>{
      if(item.name === diocese){
      this.selectedDioceseId = item.iddiocese;
      }
    })
    console.log(this.selectedDioceseId);
 
    this.diocesisCidadeService.getCitiesFromDiocese( this.selectedDioceseId).subscribe(({ success, dioceses }) => {
      if(success) {
        this.cities = dioceses.map( (item:any)=>(item.name));
        this.arrCities = dioceses;
        this.citiesOptions = this.firstFormGroup.get('city')?.valueChanges.pipe(
          startWith(''),
          map(value => this.filterByCity(value || '')) 
        );
      }
    });

  }

  reloadResultsFromFonte(fonte:any){

    this.arrFontes.forEach( (item:any)=>{
      if(item.acronym === fonte){
      this.selectedFonteId = item.idfonte;
      }
    })
 
    this.resultFuenteService.getResultsFromFonte( this.selectedFonteId).subscribe(({ success, results }) => {
      if(success) {
        this.results = results.map( (item:any)=>(item.acronym));
        this.arrResults = results;
        this.resultsOptions = this.firstFormGroup.get('result')?.valueChanges.pipe(
          startWith(''),
          map(value => this.filterByResult(value || '')) 
        );
      }
    });

  }

  goToRelatedPerson(){
    console.log('e');
    this.showAddPerson = !this.showAddPerson;
    setTimeout( () => {
      this.person.nativeElement.scrollIntoView(
      { 
        alignToTop: true,
        block: "center",
      });
    }
    )
  }

  showWarningSwal( ) {
    Swal.fire({
      title: "Você tem um formulário incompleto.",
      text: "Você deseja completá-lo?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Eliminar",
      confirmButtonText: "Eu quero completá-lo!",
    }).then((result) => {
    if (result.isConfirmed) {
        this.segmentationService.authLoadLStorage$.emit(true);
    } else {
        this.segmentationService.authLoadLStorage$.emit(false);
        this.resetFormAndLStorage();
      }
    });

  }

  showWarningSwalTitularRelacao( ) {
    Swal.fire({
      title: "'Você deseja substituir o titular da conta?",
      text: "Uma das pessoas adicionadas já foi indicada como titular'",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Substituir titular!",
      allowOutsideClick: false
    }).then((result) => {
    if (result.isConfirmed) {
        this.segmentationService.authRemplaceTitularRelacao$.emit(true);
    } else {
        this.segmentationService.authRemplaceTitularRelacao$.emit(false);
      }
    });

  }

  showWarningSwalTitular( ) {
    Swal.fire({
      title: "'Você deseja substituir o titular da conta?",
      text: "",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Substituir titular!",
      allowOutsideClick: false
    }).then((result) => {
    if (result.isConfirmed) {
        this.segmentationService.authRemplaceTitularRelacao$.emit(true);
    } else {
        this.segmentationService.authRemplaceTitularRelacao$.emit(false);
      }
    });

  }

  toggleCollapseEmail(index: number) {
      if (this.selectedIndexEmail === index) {
          this.selectedIndexEmail = null; // Si ya está abierto, ciérralo
      } else {
          this.selectedIndexEmail = index; // De lo contrario, ábrelo
      }
  }

  toggleCollapsePhone(index: number) {
      if (this.selectedIndexPhone === index) {
          this.selectedIndexPhone = null; // Si ya está abierto, ciérralo
      } else {
          this.selectedIndexPhone = index; // De lo contrario, ábrelo
      }
  }

  toggleCollapseRelacaoPhone(index: number) {
      if (this.selectedIndexRelacaoPhone === index) {
          this.selectedIndexRelacaoPhone = null; // Si ya está abierto, ciérralo
      } else {
          this.selectedIndexRelacaoPhone = index; // De lo contrario, ábrelo
      }
  }

  get validateNumberCount() : string {
    const errors = this.secondFormGroup.get('cpf')?.errors;
    if ( errors?.['invalidCPF'] ) {
      return 'CPF inválido';
    }
    
    return '';
  }

  get validateNumberCountRelacao() : string {
    const errors = this.relacaoFormGroup.get('cpfRelacao')?.errors;
    if ( errors?.['invalidCPF'] ) {
      return 'CPF inválido';
    }
    
    return '';
  }

  validateStepOne(){
    if ( this.firstFormGroup.invalid ) {
      this.firstFormGroup.markAllAsTouched();
      return
    }
    // this.isLinear = true;

  }

  validateStepTwo(){
    if ( this.secondFormGroup.invalid ) {
      this.secondFormGroup.markAllAsTouched();
      return
    }
    const isValid = this.checkEmailsSegmentations();
    const isValid2 = this.checkEmailsSegmentations();
    // if(isValid || isValid2){
    //   alert('ok')
    // }else{
    //   alert('wrong')
    // }

  }

  validField(field: string) {
    const control = this.firstFormGroup.get(field);
    return control && control.invalid && (control.dirty || control.touched);
  }

  validFieldSecond(field: string) {
    const control = this.secondFormGroup.get(field);
    
    if (field === 'anniversary' && this.showErrorAnniversary) {
      return true;
    }

    return control && control.invalid && (control.dirty || control.touched);
  }

  relacaoValidField( field: string ) {
    const control = this.relacaoFormGroup.get(field);
    return control && control.errors && control.touched;
  }

  warningToast( msg:string){
    this.toastr.warning(msg, '', {
      positionClass: 'toast-bottom-right', 
      timeOut: 3500, 
      messageClass: 'message-toast',
      titleClass: 'title-toast'
    });
  }

  ngOnDestroy(): void {
    if(this.unsubscribe$){
      this.unsubscribe$.unsubscribe();
    }
  }
  

}

