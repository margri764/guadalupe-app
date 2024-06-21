import { Component, ElementRef, Inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { delay } from 'rxjs';
import { User } from 'src/app/shared/models/user.models';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { ErrorService } from 'src/app/services/error.service';
import { UserService } from 'src/app/services/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-congregatio-modal',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './view-congregatio-modal.component.html',
  styleUrl: './view-congregatio-modal.component.scss'
})
export class ViewCongregatioModalComponent {


  @ViewChild('gallery') gallery!: ElementRef;

  user! : any;
  isLoading : boolean = false;
  phone : boolean = false;
  backClose : boolean = false;
  userCongregatio: any;
  userFromGroup: any;

  constructor(
                private errorService : ErrorService,
                private userService : UserService,
                private dialogRef : MatDialogRef<ViewCongregatioModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,


  ) {

    console.log(this.data);

    (screen.width < 800) ? this.phone = true : this.phone = false;

   }

  ngOnInit(): void {

    this.errorService.closeIsLoading$.pipe(delay(700)).subscribe(emitted => emitted && (this.isLoading = false));
      this.getUserById();
     
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userCongregatio'] && !changes['userCongregatio'].firstChange) {
      this.getUserById();
    }
  }

  getUserById(  ){

    if(this.data.origin === 'congregatio'){
      this.userCongregatio = this.data.user;
    }else if(this.data.origin === 'group'){
      this.userFromGroup = this.data.user;
    }


   //el usuario viene de los grupos
    if(this.userFromGroup !== undefined){

      this.isLoading = true;

      this.userService.getUserById(this.userFromGroup.iduser).subscribe(
      ( {success, user})=>{
        if(success){

          if(user.linkCongregatio === 1){
            const {iduser, validateEmail, name, lastName, role, codeauth, state, active, simpleCode, linkCongregatio, Nome_da_sede, Pais_da_sede, Cidade_da_sede, webAccess, idpropulsao, last_modified, timestamp, emailCongregatio,   ...userModified } = user;
            userModified.Email = user.emailCongregatio; //cambio el email
            this.user = userModified;
          }else{
            const {iduser, validateEmail, name, lastName, role, codeauth, state, active, simpleCode, linkCongregatio, ...userModified } = user;
            this.user = userModified;
          }
          this.getImages(user);
          this.isLoading = false;
          console.log(user);
        }
      })

    }else{ 
    //el usuario viene de la pestaña Congregatio
      this.user = this.userCongregatio;
      this.getImages(this.user);
      this.isLoading = false;
    }




  }

  getObjectProperties(): { key: string, value: any }[] {
      
    if(this.user){
      return Object.keys(this.user).map(key => ({ key, value: this.user![key as keyof User] }));
    }
    return [{key:'', value:''}]
  }

  getImages(user: any) {

    let total = null;

    if(this.userFromGroup !== undefined){
       total = user.Ruta_Imagen;
       console.log(total);
    }else{
      total = user['Ruta Imagen'];
    }

    // si no hay img envio una por defecto
    if(total === null || total === undefined){

      const img = document.createElement("img");
  
      img.className = "img-fluid";
      img.src = 'assets/images/no-image.jpg';
  
      img.alt = `Foto do Perfil do Usuário`;
  
      // Aplicar el estilo de borde blanco
      img.style.border = "2px solid white";
  
      this.gallery.nativeElement.appendChild(img);
      return;
    }
  
    const match = total.match(/\[(\d+)\]/);

    const indice = match ? parseInt(match[1], 10) : null;
  
    const restoDelPath = total.replace(/\[\d+\]\.jpg$/, '');
   
    let path = "https://congregatio.info/";

    if(total.startsWith('https://congregatio.info/')){
      path = '';
    }
  
    // Verificar si hay un índice antes de entrar en el bucle, Hay muchas imgs
    if (indice !== null) {

      for (let i = indice; i >= 1; i--) {
        const img = document.createElement("img");
  
        img.className = "img-fluid";
        img.src = `${path}${restoDelPath}[${i}].jpg`;
  
        img.alt = `Foto ${i} do Perfil do Usuário`;

        this.imageExists(img.src, (exists) => {
          if (exists) {
            img.style.border = "2px solid white";
            this.gallery.nativeElement.appendChild(img);
          }
        });
  
      }

    } else {
      // Si no hay un índice, significa que solo hay una imagen

      const img = document.createElement("img");
        
      img.className = "img-fluid";

      
      img.alt = `Foto do Perfil do Usuário`;
  
      // Aplicar el estilo de borde blanco
      img.style.border = "2px solid white";
      
      this.gallery.nativeElement.appendChild(img);
      
      // esta es una img q se guardo en servidor
      if(total.startsWith('/var/www/propulsao')){
        const fileName = total.split('/').pop();
        const serverURL = 'https://arcanjosaorafael.org/profilePicture/';
        img.src = `${serverURL}${fileName}`;
        console.log(img.src);
      }else{
        img.src = `${path}${restoDelPath}`;
      }
  
    }
  }
  
  imageExists(url: string, callback: (exists: boolean) => void) {
    const img = new Image();
    img.onload = () => callback(true);
    img.onerror = () => callback(false);
    img.src = url;
  }

  closeModal(){
    this.backClose = true;
    setTimeout( ()=>{ this.dialogRef.close() }, 400 )
  }
  

}
