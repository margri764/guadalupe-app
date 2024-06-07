import { CommonModule, Location} from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, delay } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { ValidateService } from 'src/app/services/validate.service';
import { getDataSS } from 'src/app/storage';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { TakePictureModalComponent } from '../../modals/take-picture-modal/take-picture-modal/take-picture-modal.component';
import { ConsentModalComponent } from '../../modals/consent-modal/consent-modal/consent-modal.component';
import { MatTabGroup } from '@angular/material/tabs';
import { PaymentService } from 'src/app/services/payment.service';
import { ImagenPathPipe } from 'src/app/pipe/imagen-path.pipe';
import { MoreInfoComponent } from "../../more-info/more-info/more-info.component";
import Swal from 'sweetalert2';
import { PrivacyModalComponent } from '../../modals/privacy-modal/privacy-modal/privacy-modal.component';
import moment from 'moment';
import { Router } from '@angular/router';
import { OpenPdfComponent } from '../../modals/open-pdf/open-pdf/open-pdf.component';
import { PaymentStatusPipe } from "../../../pipe/payment-status.pipe";

@Component({
    selector: 'app-form-congress',
    standalone: true,
    templateUrl: './form-congress.component.html',
    styleUrl: './form-congress.component.scss',
    imports: [CommonModule, MaterialModule, ReactiveFormsModule, TablerIconsModule, ImagenPathPipe, MoreInfoComponent, PaymentStatusPipe]
})

export class FormCongressComponent implements OnInit, OnDestroy{

  @ViewChild('fileUploader') fileUploader: ElementRef;
  @ViewChild('top') top: ElementRef;
  @ViewChild('topMain') topMain: ElementRef;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;


  pictureDataUrl: string;
  myForm! : FormGroup;
  myFormPayment! : FormGroup;
  passwordForm! : FormGroup;
  user : any;
  selectedImg : File | null = null;
  pathImg : string | null;
  isLoading : boolean = false;
  passwordVisible = false;
  confirmVisible = false;
  phone : boolean = false;
  public isFileInputDisabled = true;
  consent : boolean = false;
  isEditing : boolean = false;
  showChecked : boolean = false;
  conference : any;
  payment : any;
  blockPayment : boolean = false;
  showTab0 : boolean = false;
  showTab1 : boolean = true;
  showTab2 : boolean = true;
  showTab3 : boolean = true;
  showLabelIugu : boolean = false;
  program : any;


  constructor(
              private fb : FormBuilder,
              private authService : AuthService,
              private validatorService : ValidateService,
              private errorService : ErrorService,
              private paymentService : PaymentService,
              private toastr: ToastrService,
              private dialog : MatDialog,
              private location : Location,
              private router : Router,
             )  
    { 
      (screen.width < 800) ? this.phone = true : this.phone = false;
    }

    
  ngOnInit(): void {

    this.testJS();

      this.errorService.closeIsLoading$.pipe(delay(700)).subscribe( (emitted) => { if(emitted){this.isLoading = false}});
      this.errorService.repitedPayment$.subscribe( (emitted) => { if(emitted){this.blockPayment = true}});

      this.checkIfUserExist();

      this.myForm = this.fb.group({
        fullName: new FormControl('', [Validators.required]),
        address: new FormControl('', [Validators.required]),
        phone : new FormControl('', [Validators.required]),
        profession : new FormControl('', [Validators.required]),
        anniversary : new FormControl('', [Validators.required]),
        email: [''],
        age:  new FormControl(false, [Validators.requiredTrue]),
        consent:  new FormControl(false, [Validators.requiredTrue]),
        privacy:  new FormControl(false, [Validators.requiredTrue]),
       
      });
      
      this.myFormPayment = this.fb.group({
        fullNamePayment: new FormControl( '', [Validators.required]),
        emailPayment: new FormControl('', [Validators.required]),
        price: new FormControl('300', [Validators.required]),
        cpf:  new FormControl('', [Validators.required]),
        payment:  new FormControl('', [Validators.required]),

      });

      this.myForm.get('anniversary')?.valueChanges.subscribe( (value:string) => {
        if(value && value !== ''){
          this.formatInput(value);
        }
      });
     
  }

  testJS(){
    const array = [2, 4, 1, 5, 6, 3]
   let tempAdd = null;
   let finalResult = 0;

   for (let index = 0; index < array.length; index++) {
      tempAdd = array[index] + array[index + 1] ;
      if(tempAdd > finalResult ){
        finalResult = tempAdd;
      }
    
   }

   console.log(finalResult);


  }

   checkIfUserExist(){
     
     let userSS = getDataSS('user');
     if(userSS){
       this.paymentService.getUserByEmail(userSS.email).subscribe(
         ( {success, user, conference, payment} )=>{
           if(success){
             this.conference = conference;
             this.payment = payment;
             this.user = user;
             this.setUserData(user);

            }else{
              this.user = userSS;
          }
        })
     }else{

     }
    
   }

   
   changeTab(index: number): void {
     this.isLoading = true;
     setTimeout(()=>{
       this.tabGroup.selectedIndex = index;
      }, 1100)
      setTimeout(()=>{
        this.isLoading = false;
      }, 1000)
      this.goToTop();
    }

   checkTabSelected(user:any){
    console.log(user.noProfileYet);

    if(this.phone){
      
    const tabSelected = getDataSS('tabSelected');
    // si es el primer login que solo muestre la seccion del perfil
     if(tabSelected){
       if(tabSelected === 'inscription' && !user.noProfileYet){
         this.showTab0 = false;
         this.showTab2 = false;
 
       }else if(tabSelected === 'hotel' && !user.noProfileYet){
         this.showTab0 = false;
         this.showTab1 = false;
       }else if(tabSelected === 'profile' && !user.noProfileYet){
         this.showTab0 = true;
         this.showTab1 = false;
         this.showTab2 = false;
       }
     }else{
       this.showTab1 = false;
       this.showTab2 = false;
     }

    }

   }


  get f() {
    return this.myForm.controls;
  }

  get fp() {
    return this.myFormPayment.controls;
  }


  profileFirst : boolean = false;

  setUserData( user:any ){

    this.isEditing = true;

    this.checkTabSelected( user);


    if( this.conference &&  this.conference.length > 0 ){

      this.conference.forEach((element: any) => {
        if(element.name === 'Tomista'){
          this.blockPayment = true;
          const tabSelected = getDataSS('tabSelected');
          // if( (tabSelected && tabSelected === 'inscription')  ){
          //   this.warningToast('Você já se cadastrou.')
          // }
          console.log(this.payment);
        }
      }); 

    }  

    console.log(user);

    //en el primer login todavia no se creo el perfil
    if(user.noProfileYet){

      this.myForm.patchValue({
        email : user.email,
      })
  
      this.myFormPayment.patchValue({
        emailPayment : user.email,
      })

      this.warningToast('Precisamos que você complete seu perfil.');
      this.showTab0 = true;
      this.showTab1 = false;
      this.showTab2 = false;
      this.profileFirst = true;
     

    }else{

      this.myForm.patchValue({
        fullName : user.fullName,
        email : user.email,
        address: user.address,
        phone : user.phone,
        profession : user.profession,
        anniversary : user.anniversary,
        age:  true,
        consent:  true,
        privacy:  true,
      })
  
      this.myFormPayment.patchValue({
        cpf: (this.payment) ? this.payment.cpf : null,
        fullNamePayment : user.fullName,
        emailPayment : user.email,
        payment : (this.payment) ? this.payment.paymentOption : null
      })
  
      this.pathImg = user.filePath;
   

    }
   
    
  }

  // checkPagamento(){
  //   if( this.conference &&  this.conference.length > 0  && !this.phone){

  //     this.conference.forEach((element: any) => {
  //       if(element.name === 'Tomista'){
  //         this.blockPayment = true;
  //         this.warningToast('Você já se cadastrou.')
  //       }
  //     }); 

  //   }else{
  //     return
  //   }
  // }

  onSave() {

    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched(); 
      return;
    }

    let body = {
      ...this.myForm.value,
      email: this.user.email
     }

     if(!this.selectedImg){
      body = { ...body, filePath: this.pathImg }
    }
    
     const { confirm, age, consent, privacy, ...bodyWithout } = body;

    this.isLoading = true;
    this.authService.createProfile(bodyWithout, this.selectedImg).subscribe(
      ( {success} )=>{
        if(success){
          this.profileFirst = false;
  
          this.myFormPayment.patchValue({
            fullNamePayment : this.myForm.get('fullName')?.value,
            emailPayment : this.myForm.get('email')?.value,
          })
          setTimeout(()=>{  
            this.successToast('Formulario salvo com sucesso');
            this.isLoading = false;
            // this.checkPagamento();

            if(this.phone){
              this.router.navigateByUrl('/home-app');
              return
            }
            this.changeTab(1);
  
          },1000)
        }
      });
    

    // this.isLoading = true;
  
  }

  onSavePayment() {

    console.log(this.myFormPayment.value);
    
    if (this.myFormPayment.invalid) {
      this.myFormPayment.markAllAsTouched(); 
      return;
    }

    const body = {
      fullName: this.myFormPayment.get('fullNamePayment')?.value,
      paymentOption: this.myFormPayment.get('payment')?.value,
      price: this.myFormPayment.get('price')?.value,
      cpf: this.myFormPayment.get('cpf')?.value,
      email: this.myFormPayment.get('emailPayment')?.value,
     }


    this.isLoading = true;
    this.paymentService.createPayment(body).subscribe(
      ( {success} )=>{
        if(success){
          setTimeout(()=>{  
            this.showSuccessAlert('Sua fatura foi enviada com sucesso','Verifique seu e-mail');
            this.isLoading = false;
            this.blockPayment = true;
            if(this.phone){
              this.router.navigateByUrl('/home-app');
              return
            }
          },1000)
        }
      });
  }

  showSuccessAlert(title:string, subtitle : string){
    Swal.fire({
      title: title,
      text:subtitle,
      icon: "success"
    });
  }

  checkCPF() {

    this.showChecked = false;
    const cpf = this.myFormPayment.get('cpf');
    console.log(cpf);
  
    if (cpf && cpf.value !== '') {
      const isValidCPF = this.paymentService.validaCPF(cpf.value);
  
      if (!isValidCPF) {
        cpf.setErrors({ 'invalidCPF': true });
      } else {
        cpf.setErrors(null); // Limpiar errores si el CPF es válido
        this.showChecked = true;
        const cleanedCPF = cpf.value.replace(/\D/g, '');
        this.myFormPayment.get('cpf')?.setValue(cleanedCPF);
      }
     
    }
  }

  showErrorAnniversary : boolean = false;

  formatInput(value: string) {

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
          this.myForm.patchValue({ anniversary: digits.slice(0, 2)});
          return
        }else{
         this.showErrorAnniversary = false;
        const month = parseInt(digits.slice(2, 4));
        if(month > 12){
          this.showErrorAnniversary = true;
          const inputValue =  this.myForm.get('anniversary')?.value;
          this.myForm.patchValue({ anniversary: inputValue.slice(0, 3)} , { emitEvent: false });
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
      this.myForm.patchValue({ anniversary: formattedValue }, { emitEvent: false });
    }
      
  }

  logout(){
    this.errorService.logout();
   }

  onAnniversarySelected() {

    const anniversary = this.myForm.get('anniversary')?.value;
  
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    
      // Verificar si el valor cumple con la expresión regular
      if (!regex.test(anniversary) || this.showErrorAnniversary) {
        this.myForm.get('anniversary')?.setErrors({ invalidDateFormat: true });
      } else {
        this.myForm.get('anniversary')?.setErrors(null); // Eliminar errores si el formato es válido
      }
  }
  

  get validateNumberCount() : string {
    const errors = this.myFormPayment.get('cpf')?.errors;
    if ( errors?.['invalidCPF'] ) {
      return 'CPF inválido';
    }
    
    return '';
  }
  
  togglePasswordVisibility(value : string) : void {
      (value == "password") ? this.passwordVisible = !this.passwordVisible : '';
      (value == "confirm") ? this.confirmVisible = !this.confirmVisible : '';
  }
   
  openDialog() {
    const dialogRef = this.dialog.open(TakePictureModalComponent,{
      maxWidth: (this.phone) ? "98vw": '',
      panelClass: "custom-modal-picture"
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      
      // Convertir la imagen en base64 a un objeto File y manejarla como un archivo seleccionado
      const file = this.base64ToFile(result, 'captured-image.png');
      this.onFileSelected({ target: { files: [file] } });
    });
  }

  checkAge(){

    const birthday = this.myForm.get('anniversary')?.value;
    const today = moment(); 
    const birthDate = moment(birthday, 'DD/MM/YYYY'); // Convertir la fecha de nacimiento a objeto moment
  
    const age = today.diff(birthDate, 'years'); // Calcular la diferencia de años entre hoy y la fecha de nacimiento
    if (age < 18) {
    setTimeout(()=>{ this.myForm.get('age')?.setValue(null) }, 100)
    } else{
    setTimeout(()=>{ this.myForm.get('age')?.setValue(true) }, 100)

    }
  }

  openDialogPrivacy() {

    setTimeout(()=>{ this.myForm.get('privacy')?.setValue(null) }, 100)

    const dialogRef = this.dialog.open(PrivacyModalComponent,{
      disableClose: true, 
    });

    dialogRef.afterClosed().subscribe((result) => {

      if(result){
        this.myForm.get('privacy')?.setValue(true);
      }else{
      }
     
    });
  }

  openDialogConsent() {

    setTimeout(()=>{ this.myForm.get('consent')?.setValue(null) }, 100)

    const dialogRef = this.dialog.open(ConsentModalComponent,{
      disableClose: true, 
    });

    dialogRef.afterClosed().subscribe((result) => {

      if(result){
        this.myForm.get('consent')?.setValue(true);
      }
     
    });
  }

  goToTop(){
    setTimeout( () => {
      this.top.nativeElement.scrollIntoView(
      { 
        alignToTop: true,
        block: "center",
      });
     }
    )
  }

  goToTopMain(){
    setTimeout( () => {
      this.topMain.nativeElement.scrollIntoView(
      { 
        alignToTop: true,
        block: "center",
      });
     }
    )
  }

  base64ToFile(base64: string, filename: string): File {
    const arr : any [] = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
  
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
  
    return new File([u8arr], filename, { type: mime });
  }
  
  onFileSelected(event: any) {

    this.selectedImg = event.target.files[0];
    this.showPreview();
  }

  showPreview() {
    const reader = new FileReader();
  
    reader.onload = (event: any) => {
      this.pathImg = event.target.result;
    };
  
    if (this.selectedImg) {
      reader.readAsDataURL(this.selectedImg);
    }
  }

  cancelImag(){
    this.selectedImg = null;
    this.pathImg = null;
    // Restablecer el valor del input de archivo
    const fileInput = this.fileUploader.nativeElement;
    fileInput.value = '';
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
    this.toastr.warning(msg, 'Atenção', {
      positionClass: 'toast-bottom-right', 
      timeOut: 3500, 
      messageClass: 'message-toast',
      titleClass: 'title-toast'
    });
  }

  goBack(){
    setTimeout(() => {
      this.location.back();
    }, 100);
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('tabSelected');
  }
    


}
