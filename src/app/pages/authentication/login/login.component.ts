import { ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, Subscription, delay } from 'rxjs';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CodeModalComponent } from '../modals/code-modal/code-modal/code-modal.component';
import { ToastrService } from 'ngx-toastr';
import { NoVerifiedModalComponent } from '../modals/noVerified-modal/no-verified-modal/no-verified-modal.component';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { ValidateService } from 'src/app/services/validate.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { CommonModule } from '@angular/common';
import { CoreService } from 'src/app/services/core.service';
import { MaterialModule } from 'src/app/material.module';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-login',
  
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  options = this.settings.getOptions();
  myForm!: FormGroup;
  myForm2!: FormGroup;
  submitted : boolean = false;
  showLogin: boolean = true;
  isLoading : boolean = false;
  isSending : boolean = false;

  noVerified : boolean = false;
  noRole : boolean = false;
  successContactUs : boolean = false;
  successResendPass : boolean = false;
  showResendPass : boolean = false;
  successResendVerify : boolean = false;
  phone : boolean = false;
  isDivVisible : boolean = false;
  position : boolean = false;
  sendingAuth : boolean = false;

  private destroy$ = new Subject<void>();
  private noVerifySubscription : Subscription;
  msg : string = '';
  show500 : boolean = false;
  arrBackground : any []=[]
  backgroundImage : string= '';
  sendMeACopy : boolean = false;
  osInfo: any;
  passwordVisible = false;
  confirmVisible = false;

  constructor(
              private settings: CoreService, 
              private fb : FormBuilder,
              private authService : AuthService,
              private router : Router,
              private errorService : ErrorService,
              public toastr: ToastrService,
              private imageUploadService : ImageUploadService,
              private cdr: ChangeDetectorRef,
              private validatorService : ValidateService,
              // private modalService: NgbModal,
              private dialog : MatDialog,
              private cookieService: CookieService,

              
  )
  
  {

    (screen.width <= 800) ? this.phone = true : this.phone = false;
     
   }


  ngOnInit(): void {


    if (this.cookieService.check('token')) {
      this.cookieService.delete('token', '/');    
    }

    this.getInitBackground();

    this.checkDeviceInfo();

    this.errorService.closeIsLoading$.pipe(delay(700)).subscribe( (emitted) => { if(emitted){this.isLoading = false}});

    this.noVerifySubscription = this.errorService.status400VerifyError$.pipe(delay(1000)).subscribe( (emmited)=>{ if(emmited){ this.openNoVerifiedModal()}  })

    this.myForm = this.fb.group({
      email:     [ '', [Validators.required,Validators.pattern(this.validatorService.emailPattern)] ],
      password:  [ '', [Validators.required]],
      rememberCredentials : [ false, [Validators.required]],
  
    });

    this.myForm2 = this.fb.group({
      fullName: [ '', [Validators.required] ],
      headquarter: [ '', [Validators.required] ],
      userEmail: [ '', [Validators.required, Validators.pattern(this.validatorService.emailPattern)] ],
      subject: [ '', [Validators.required] ],
      sendMeACopy: ['']
    });

  }

  get f() {
    return this.myForm.controls;
  }

  changeBackground(): void {
    if(this.arrBackground.length > 0){
      var fondoAleatorio =  this.arrBackground[Math.floor(Math.random() * this.arrBackground.length)];
      this.backgroundImage = fondoAleatorio.filePath;
      this.backgroundImage = this.backgroundImage.replace(/\(/g, '%28').replace(/\)/g, '%29');
      this.cdr.detectChanges();
    }

  }

  getInitBackground(){
    this.imageUploadService.getAllBackground().subscribe(
      ( {success, backgrounds} )=>{
        if(success){
          this.arrBackground = backgrounds.filter((background:any) => background.active === 1);
          this.arrBackground = this.arrBackground.map( (doc:any) => {
            const fileName = doc.filePath.split('/').pop();
            const serverURL = 'https://arcanjosaorafael.org/backgrounds/';
            return {
              ...doc,
              filePath: `${serverURL}${fileName}`
            };
          });
          this.changeBackground()
          
        }
      })
  }

  login(){

    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return;
    }

    const email = this.myForm.get('email')?.value;
    const password = this.myForm.get('password')?.value;
    this.isLoading = true;
    const session = "false"

    const body = { email, password, session, osInfo: this.osInfo}

    this.authService.login( body ).subscribe(
      ({success, firstlogin})=>{

        if(success && firstlogin && firstlogin === "true"){
          setTimeout(()=>{ 
              this.sendingAuth = false;
              this.isLoading = false;
              this.router.navigateByUrl('/dashboard');
            },1700)
              
        }else if(success && firstlogin === "false"){
          setTimeout(()=>{ 
            this.isLoading = false;
            this.openCodeModal(email, password); 
           },1200)
        }
        });
  }

  togglePasswordVisibility(value : string) : void {
    (value == "password") ? this.passwordVisible = !this.passwordVisible : '';
    (value == "confirm") ? this.confirmVisible = !this.confirmVisible : '';
}

  blank(){
    this.router.navigateByUrl('/dashboard/iniciando-sessao')
  }


  successToast( msg:string){
    this.toastr.success(msg, 'Sucesso!!', {
      positionClass: 'toast-bottom-right', 
      timeOut: 3500, 
      messageClass: 'message-toast',
      titleClass: 'title-toast'
    });
  }
  

  toggleDiv() {
    this.isDivVisible = !this.isDivVisible;
    this.position = !this.position;
  }

  //  me desuscribo al timer
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if(this.noVerifySubscription){
        this.noVerifySubscription.unsubscribe()
    }
  }

//entre em contato con nosotros
  contactUs(){

    if ( this.myForm2.invalid ) {
      this.myForm2.markAllAsTouched();
      return;
    }

    const body = {
      ...this.myForm2.value,
      sendMeACopy : this.sendMeACopy
    }

    this.isSending= true;
    this.authService.contactUs(body).subscribe( 
      ({success})=>{
        if(success){
          this.isSending= false;
          this.isDivVisible = false;
          this.position = false;
          setTimeout(()=>{
            this.successToast('Em breve entraremos em contato');
            this.myForm2.reset();
            this.sendMeACopy = false;
          },1800)
         
          setTimeout(() => {
            this.successContactUs = false;
          }, 5200);
        }

      })


  }


  checkDeviceInfo() {
    const userAgent = navigator.userAgent;
    let osInfo = '';
  
    if (userAgent.match(/Win64|WOW64/)) {
      osInfo += 'Windows 64 bits';
    } else if (userAgent.match(/Win32/)) {
      osInfo += 'Windows 32 bits';
    } else if (userAgent.match(/Android/)) {
      osInfo += 'Android';
    } else {
      osInfo += 'Otro sistema operativo';
    }

    this.osInfo = osInfo;
  }

  //reinicio el boolea por si se cancela el toast
  closeToast(){
    this.noRole = false;
   }

   changeModalsStates(){
      this.noVerified = false;
      this.noRole = false;
      this.successContactUs = false;
      this.successResendPass = false;
      this.showResendPass = false;
      // this.wrongCode = false;
      // this.showCron = false;
      this.destroy$.next();
      this.destroy$.complete();
   }

   // modal de doble auth
   openCodeModal( email: string, password:string ){

    const dialogRef = this.dialog.open(CodeModalComponent,{
      maxWidth: (this.phone) ? "99vw": '600px',
      maxHeight: (this.phone) ? "98vh": '800px',
      panelClass: ['custom-container' ], // Add class conditionally based on phone

      data: {email, password}
    });

  
   }

   //no recibio el email para verificar
   openNoVerifiedModal(){

    const dialogRef = this.dialog.open(NoVerifiedModalComponent,{
      maxWidth: (this.phone) ? "99vw": '600px',
      maxHeight: (this.phone) ? "98vh": '800px',
    });

   }

  // desea enviar una copia a mi email?
  sendMeAnEmail( event : any ){
    this.sendMeACopy = (event.target as HTMLInputElement).checked;
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




   validField(field: string) {
    const control = this.myForm.get(field);
    return control && control.errors && control.touched;
  }

  validField2(field: string) {
    const control = this.myForm2.get(field);
    return control && control.errors && control.touched;
  }




}