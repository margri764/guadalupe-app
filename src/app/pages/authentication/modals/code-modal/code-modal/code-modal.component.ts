import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, NgZone, ViewChild, ElementRef, Inject} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { GlobalConfig, Subject, delay, filter, takeUntil, takeWhile, tap } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { SessionService } from 'src/app/services/session.service';
import { AppState } from 'src/app/shared/redux/app.reducer';

@Component({
  selector: 'app-code-modal',
  standalone: true,
  templateUrl: './code-modal.component.html',
  styleUrls: ['./code-modal.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule]
})
export class CodeModalComponent implements OnInit {
  
  @ViewChild('modal') modal! : ElementRef;

  myFormCode!: FormGroup;
  codeTimeRemaining!: number;
  wrongCode : boolean = false;
  showCron : boolean = true;
  private email : string = '';
  private password : string = '';
  sendingAuth : boolean = false;
  counter : number = 0;
  msg : string = '';
  loggedUser : any;
  user:any;
  logged : boolean = false;


  
  // timer
  private destroy$ = new Subject<void>();


  constructor(
              private fb : FormBuilder,
              private sessionService : SessionService,
              private ngZone: NgZone,
              private authService : AuthService,
              private router : Router,
              private errorService : ErrorService,
              public toastr: ToastrService,
              private store : Store <AppState>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef : MatDialogRef<CodeModalComponent>



  ) { 


    this.myFormCode = this.fb.group({
      code:     [ '', [Validators.required] ],
    });

  
  }



  ngOnInit(): void {

    

    this.errorService.status401WronCode$.pipe(delay(1200)).subscribe(( {emmited, msg } )=>{
      if(emmited) { 
          if(msg === "O código de autenticação expirou. É necessário um novo código"){ 
            this.destroy$.next(); 
            this.destroy$.complete(); 
            this.showCron = false  }; 
            this.counter ++;
       }
    });

    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.sendingAuth = false));

    // this.authService.closeLoginWebmaster$.subscribe((emmited)=>{ this.activeModal.dismiss() });


    this.store.select('auth')
    .pipe(
      filter( ({user})=>  user !== null && user !== undefined),
    ).subscribe(
      ( {user} )=>{
       if(user){
         this.user = user;
       }
      })
    
    this.email = this.data.email;
    this.password = this.data.password;
 
    this.sessionService.startCodeTimer();
    this.getTimerCode();
  
  }

  get f() {
    return this.myFormCode.controls;
  }

  doubleAuth(){

    const code = this.myFormCode.get('code')?.value;

    const body = { code, email: this.email };
    
    if ( this.myFormCode.invalid ) {
      this.myFormCode.markAllAsTouched();
      return;
    }

    this.sendingAuth = true;
    this.authService.doubleAuth( body ).subscribe(
      ({success, user})=>{
        if(success){

              setTimeout(()=>{ 
                this.sendingAuth = false;
                this.closeModal();
                this.router.navigateByUrl('/painel');
              },1000)
          }
        });

  }


  resendCode(){

    console.log(this.email, this.password);

     this.myFormCode.get('code')?.setValue('');
     this.sendingAuth = true;
     const session = "false";

     const body = { email: this.email, password: this.password, session, osInfo: null }
     
     this.authService.login( body ).subscribe(
       ({success})=>{
 
         if(success ){
           setTimeout(()=>{ 
               this.sendingAuth = false;
               this.sessionService.startCodeTimer();
               this.showCron = true;
               this.getTimerCode();
               },1700)
         }
         });

  }

  
  getTimerCode(){

    this.sessionService.getRemainigTimeCode()
      .pipe(
        tap((res) => {
          this.ngZone.run(() => {
            this.codeTimeRemaining = res;
          });
        }),
        takeWhile(timeRemaining => timeRemaining > 0),
        takeUntil(this.destroy$))
        .subscribe((timeRemaining: number) => {
        this.codeTimeRemaining = timeRemaining;
        if(timeRemaining === 0){
        this.sessionService.startCodeTimer();
        }
      
    });

  }

  openDoubleAuthModal() {
    this.sessionService.startCodeTimer();
    setTimeout(()=>{ this.getTimerCode() },500)
    
  }

  closeModal(){
    this.dialogRef.close();
  }
  

  errorToast( error:string){
    this.toastr.error(error, 'Erro!', {
      positionClass: 'toast-bottom-right', 
      closeButton: true,
      timeOut: 3500, 
    });
  }

  validFieldCode(field: string) {
    const control = this.myFormCode.get(field);
    return control && control.errors && control.touched;
  }
}
