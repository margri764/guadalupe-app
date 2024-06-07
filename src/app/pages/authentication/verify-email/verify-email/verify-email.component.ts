import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { delay } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { ContactusModalComponent } from '../../modals/contactus-modal/contactus-modal/contactus-modal.component';
import { MaterialModule } from 'src/app/material.module';
import { saveDataSS } from 'src/app/storage';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent implements OnInit {
  

  code : string = '';
  email : string = '';
  showTemplate : boolean = false;
  showErrorTemplate : boolean = false;
  showError : boolean = false;
  isLoading: boolean = false;

  constructor(
                private router : Router,
                private activatedRoute : ActivatedRoute,
                private authService : AuthService,
                public toastr: ToastrService,
                private errorService : ErrorService,
                public dialog: MatDialog
                
              )
  {

    this.activatedRoute.params.subscribe(
      ({ code})=>{ this.getCodes(code) });

  }
  
  ngOnInit(): void {

    this.errorService.closeIsLoading$.pipe(delay(700)).subscribe( (emitted) => { if(emitted){this.isLoading = false; this.showError = true}});

  
  }

  getCodes(codes: string) {

    if (codes.length >= 12) {
      this.code = codes.slice(-12); 
      this.email = codes.slice(0, -12).trim();
    } else {
      // Manejar el caso en el que la cadena no tenga al menos 12 caracteres
      console.error('La cadena no tiene al menos 12 caracteres');
    }
    if(this.code !== '' && this.email !== ''){
      this.validateEmail();
    }

  }

  validateEmail(){

    this.isLoading = true;

    const body = {email: this.email, code: this.code}
    
    this.authService.validateEmail(body).subscribe(
      ( {success, message} )=>{
        if(!success && message === 'Sua conta já está verificada. Por favor, vá para o login' ){
          this.showErrorTemplate = true;
          this.isLoading = false;
          // this.successToast(message);
          setTimeout(()=>{ 
            this.router.navigateByUrl('/autenticacao/login')}
           ,2500)
        }else if(success){
          this.showTemplate = true;
          this.isLoading = false;
          saveDataSS('user', {email: body.email})
            setTimeout(()=>{ 
              this.router.navigateByUrl('/formulario')}
             ,3500)
        }
      })
  }

  openDialog() {
    this.dialog.open(ContactusModalComponent, {
      width: '500px',
    });
  }

    successToast( msg:string){
      this.toastr.warning(msg, 'Sucesso!!', {
        positionClass: 'toast-bottom-right', 
        timeOut: 3500, 
        messageClass: 'message-toast',
        titleClass: 'title-toast'
      });
    }


}
