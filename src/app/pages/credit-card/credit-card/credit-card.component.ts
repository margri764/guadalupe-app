import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { ToastrService } from 'ngx-toastr';
import { Subscription, delay, take } from 'rxjs';
import { DeleteModalComponent } from '../../modals/delete-modal/delete-modal/delete-modal.component';
import { getDataSS } from 'src/app/shared/storage';
import Swal from 'sweetalert2';
import { AddPropulsaoModalComponent } from '../../modals/add-propulsao-modal/add-propulsao-modal/add-propulsao-modal.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { BankCreditcardService } from 'src/app/services/bank-creditcard.service';
import { ErrorService } from 'src/app/services/error.service';
import { ValidateService } from 'src/app/services/validate.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EditCreditcardModalComponent } from '../../modals/edit-creditcard-modal/edit-creditcard-modal/edit-creditcard-modal.component';
import { NewCreditcardModalComponent } from '../../modals/new-creditcard-modal/new-creditcard-modal/new-creditcard-modal.component';
import { CreditCardLogoPipe } from "../../../pipe/credit-card-logo.pipe";

@Component({
    selector: 'app-credit-card',
    standalone: true,
    templateUrl: './credit-card.component.html',
    styleUrl: './credit-card.component.scss',
    imports: [CommonModule, ReactiveFormsModule, MaterialModule, CreditCardLogoPipe]
})
export class CreditCardComponent {
  
  displayedColumns: string[] = ['img', 'name', 'description','action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('collapse') collapse!: ElementRef;
  @ViewChild ("credit_card" , {static: true} ) credit_card! : ElementRef;

  myForm!: FormGroup;
  validFrom : any;

  unsubscribe$ : Subscription;
  isLoading : boolean = false;
  creditcards : any []=[];
  expirationDateMonth : any;
  expirationDateYear : any;
  validFromDateMonth : any;
  validFromDateYear : any;
  creditCardNumber : any ;
  ccvCodeNumber : any ;
  creditcardName : string = ''
  isHovered: boolean = false;
  phone: boolean = false;
  errorMonthValidForm : string = '';
  errorYearValidForm : string = '';
  errorMonthExpDate : string = '';
  errorYearExpDate : string = '';
  errorCCV : string = '';
  disableValidFrom : boolean = false;
  collapsedCards : boolean = false;
  isCard : boolean = false;
  card:any;
  numberOK : string = '';
  loggedUser : any;
  digitos : any []=[];
  readonly panelOpenState = signal(false);


  constructor(
                private fb : FormBuilder,
                private bankCreditcardService : BankCreditcardService,
                private toastr: ToastrService,
                private errorService : ErrorService,
                private router : Router,
                private validatorService : ValidateService,
                private dialog : MatDialog
             )
   { 

    this.myForm = this.fb.group({
      year: [''],
      month: [''],
      cardNumber: [''],
      expirationDateMonth: ['', ],
      expirationDateYear: ['', ],
      validFromDateMonth: ['', ],
      validFromDateYear: ['', ],
      ccvNumber: ['', ],
    });

    const user = getDataSS('user');
    if(user){
      this.loggedUser = user;
    }

    if (this.loggedUser.role === 'webmaster') {
      const position = this.displayedColumns.length - 1;
      this.displayedColumns.splice(position, 0, 'propulsao');
    }

    (screen.width <= 800) ? this.phone = true : this.phone = false;
    this.dataSource = new MatTableDataSource();
    
  }
  
  ngOnInit(): void {

    this.errorService.closeIsLoading$.pipe(delay(100)).subscribe(emitted => emitted && (this.isLoading = false));

    
    this.myForm.get('cardNumber')?.valueChanges.subscribe((newValue: string) => {
      if(newValue){
      const newValueAsString = newValue.toString();
      if (newValueAsString && newValueAsString.length > 0) {
        const firstDigit = newValueAsString.charAt(0);
        this.checkDigit(firstDigit);
        // Utilizar una expresión regular para dividir la cadena en bloques de cuatro dígitos
      const formattedValue = newValueAsString.replace(/\D/g, '').match(/.{1,4}/g);
      // Unir los bloques con un espacio
      this.creditCardNumber = formattedValue ? formattedValue.join(' ') : '';
      }else{
        this.creditcardName = '';
      }

      
    }
    });
  
    this.myForm.get('validFromDateMonth')?.valueChanges.subscribe((newValue: string) => {
      this.validFromDateMonth = newValue
    });

    this.myForm.get('validFromDateYear')?.valueChanges.subscribe((newValue: string) => {
      this.validFromDateYear = newValue
    });
    
    
    this.myForm.get('expirationDateMonth')?.valueChanges.subscribe((newValue: string) => {
      this.expirationDateMonth = newValue;
    });

    this.myForm.get('expirationDateYear')?.valueChanges.subscribe((newValue: string) => {
      this.expirationDateYear = newValue;
    });

    this.myForm.get('ccvNumber')?.valueChanges.subscribe((newValue: string) => {
      this.ccvCodeNumber = newValue;
      this.isHovered = true;
    });
    
    this.getInitialCreditCards();
    this.getAllDigitsCheck();
  }


  inputCardNumber( $event:any ){
    this.creditCardNumber = $event.target.value;;
  }

  handleBlur() {
    this.isHovered = false;
  }

  checkDigit(inputValue:any){

    this.digitos.forEach( item =>{
        if(item.number === inputValue){
          this.creditcardName = item.name
          console.log(item.name);
        }
    })

  }

  validating : boolean = false;
  handleBlurNumber() {

    this.validating = true;
    const number = this.myForm.get('cardNumber')?.value;

    if( number && number !== '' ){
      const isValid = this.creditCardValidator(number); 
       console.log(isValid);
      if(isValid){
        this.numberOK = "true"
      }else{
        this.numberOK = "false"
      }
    }
  }
  
  editCreditCard( creditCard:any ){
    const dialogRef = this.dialog.open(EditCreditcardModalComponent,{
      maxWidth: (this.phone) ? "97vw": '800px',
      maxHeight: (this.phone) ? "90vh": '90vh',
      data: {creditCard}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if(result === 'edit-creditcard'){
          this.getInitialCreditCards() 
        }
      } 
    });
   }

  getInitialCreditCards(){

    this.isLoading = true;
    this.bankCreditcardService.getAllCreditCards().subscribe(
      ( {success, creditcards} )=>{
        if(success){
          this.creditcards = creditcards;
          if(creditcards && creditcards.length > 0){
            this.dataSource.data = creditcards;
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'name': return item.name;
                case 'description': return item.description;
                case 'propulsao': return item.propulsao_name;
                default: return '';
              }
            };
          }
        setTimeout(()=>{ this.isLoading = false }, 700)
        }
      })
  }

  getAllDigitsCheck(){

    this.bankCreditcardService.getAllDigitsCheck().subscribe(
      ( {success, digitchecks} )=>{
        if(success){
          this.digitos = digitchecks;
        }
      })
  }

  get f(){
    return this.myForm.controls;
  }

  selectCard(card:any){

  
    this.collapseCard();

    this.card = card.name
   
    if(card.validFromRegExp && card.validFromRegExp.length > 0){
      this.setValidatorsToValidFrom(card);
      this.disableValidFrom = false;
    }else{
      this.disableValidFrom = true;
    }

    this.setValidatorsToExpDate(card);
    this.setCardNumberLength(card)
    this.setCCVLength(card)
  }

  collapseCard(){
    // this.collapse.nativeElement.click();
    this.collapsedCards = true;
    this.goToCard();
  }

  showPropulsaoSwal( ) {
    Swal.fire({
      title: "Editar através das propulsões!",
      text: `Este cartão de crédito está atribuído a uma propulsão`,
      icon: "warning",
      // showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "continuar"
    }).then((results) => {
      if (results.isConfirmed) {
      }
    });
    
  }

  assignPropulsao( value:any){
    const id = value.idcreditcard;
    const component = "edit-creditcard";
    const dialogRef = this.dialog.open(AddPropulsaoModalComponent,{
       maxWidth: (this.phone) ? "97vw": '800px',
       maxHeight: (this.phone) ? "90vh": '90vh',
       data: { component, id }
   });
   
   dialogRef.afterClosed().subscribe(result => {
     if (result) {
       if(result === 'edit-creditcard'){
         this.getInitialCreditCards() 
       }
     } 
   });
  
  }

  onRemove( card:any ){

    this.openDeleteModal('delCreditCard');
  
    this.unsubscribe$ = this.bankCreditcardService.authDelCreditCard$.pipe(take(1)).subscribe(
      (auth)=>{
        if(auth){

          if(card.propulsao_name && card.propulsao_name[0] !== null && card.propulsao_name.length > 0){
            this.showWarningSwal(card.propulsao_name)
          }else{
  
            this.bankCreditcardService.deleteCreditCardById( card.idcreditcard ).subscribe(
            ( {success} )=>{
  
              setTimeout(()=>{ this.isLoading = false },700);
       
              if(success){
                this.getInitialCreditCards();
                this.successToast("Cartão de crédito eliminada com sucesso.");
              }
            })
          }
  
          // this.isLoading = true;
          // this.bankCreditcardService.deleteCreditCardById( card.idcreditcard ).subscribe(
          //   ( {success} )=>{
          //     setTimeout(()=>{ this.isLoading = false },700) 
          //     if(success){
          //       this.successToast("Cartão de crédito eliminada com sucesso.");
          //       this.getInitialCreditCards();
          //     }
          // })
  
        }else{
          this.unsubscribe$.unsubscribe();
        }
      })
  }

  openDeleteModal( action:string ){
    this.dialog.open(DeleteModalComponent,{
      maxWidth: (this.phone) ? "98vw": '',
      panelClass: "custom-modal-picture",    
      data: { component: "credit-card", action }
      });
  }

  showWarningSwal( propulsaosName:any) {
    Swal.fire({
      title: "Si precisar excluir, faça-o através das propulsões associadas.!",
      text: `Este cartão de crédito está atribuído às seguintes propulsões: "${propulsaosName.join('", "')}", ` ,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Login como administrador"
    }).then((result)=>{
      if(result.isConfirmed){
        this.router.navigateByUrl('/dashboard/administradores')
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

  goToCard(){
    setTimeout( () => {
      this.credit_card.nativeElement.scrollIntoView(
      { 
        alignToTop: true,
        behavior: "smooth",
        block: "center",
      });
      }, 0);
  }

  setValidatorsToValidFrom( card: any ){
    console.log(card);
    card = card.validFromRegExp;
    const part = card[2].split("/");
    this.errorMonthValidForm = part[0];
    this.errorYearValidForm = part[1];

    if(card[2].startsWith('yy')){
      const month = card[1];
      const year = card[0];
      this.myForm.get('validFromDateMonth')?.setValidators([Validators.pattern(month)]);
      this.myForm.get('validFromDateYear')?.setValidators([Validators.pattern(year)]);
    }else{
      const month = card[0];
      const year = card[1];
      this.myForm.get('validFromDateMonth')?.setValidators([Validators.pattern(month)]);
      this.myForm.get('validFromDateYear')?.setValidators([Validators.pattern(year)]);
    }


  }

  setValidatorsToExpDate( card: any ){
    card = card.expirationDateRegExp;
    const part = card[2].split("/");
    this.errorMonthExpDate = part[0];
    this.errorYearExpDate = part[1];

    if(card[2].startsWith('yy')){
      const month = card[1];
      const year = card[0];
      this.myForm.get('expirationDateMonth')?.setValidators([Validators.pattern(month)]);
      this.myForm.get('expirationDateYear')?.setValidators([Validators.pattern(year)]);
    }else{
      const month = card[0];
      const year = card[1];
      this.myForm.get('expirationDateMonth')?.setValidators([Validators.pattern(month)]);
      this.myForm.get('expirationDateYear')?.setValidators([Validators.pattern(year)]);
    }


  }

  setCardNumberLength( card:any ){
     const pattern = card.cardNumberRegExp
     this.myForm.get('cardNumber')?.setValidators([Validators.pattern(pattern)]);
  }

  setCCVLength( card:any ){
     const pattern = card.ccvRegExp;

     const partes = pattern.split(/\D/); // Divide la cadena en partes usando cualquier carácter no numérico como separador
     const length = partes.find((part: string) => part !== "");    
     this.myForm.get('ccvNumber')?.setValidators([Validators.pattern(pattern)]);
     this.errorCCV = `Digite ${length} dígitos`
  }

  handleValidFromChange( $event : MatRadioChange ){
    this.validFrom = $event.value;
  }

  openModalNewCreditCard(){

    const dialogRef = this.dialog.open(NewCreditcardModalComponent,{
      maxWidth: (this.phone) ? "97vw": '800px',
      maxHeight: (this.phone) ? "90vh": '90vh',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
  
        if(result === 'new-creditcard'){
              this.getInitialCreditCards()   
           }
      } 
    });
  }
  
  // algoritmo de Nuhn
  creditCardValidator( number:any) {
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


ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  const savedPageSize = localStorage.getItem('creditcardPageSize');
  if (savedPageSize) {
    this.paginator.pageSize = +savedPageSize;
  }
  this.paginator.page.subscribe((event) => {
    localStorage.setItem('creditcardPageSize', event.pageSize.toString());
  });
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

  validField( field: string ) {
    const control = this.myForm.controls[field];
    return control && control.errors && control.touched;
  }
  

}

