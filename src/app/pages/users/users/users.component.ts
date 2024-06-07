import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, delay } from 'rxjs';
import { User } from 'src/app/shared/models/user.models';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { ErrorService } from 'src/app/services/error.service';
import { getDataSS } from 'src/app/storage';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ImagenPathPipe } from "../../../pipe/imagen-path.pipe";
import { RolePipe } from "../../../pipe/role.pipe";

@Component({
    selector: 'app-users',
    standalone: true,
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss',
    imports: [CommonModule, MaterialModule, ImagenPathPipe, RolePipe]
})
export class UsersComponent implements OnInit  {

  users : User []=[];
  isLoading : boolean = false;

  loggedUser : any;
 

  constructor(
              private userService : UserService,
              private errorService : ErrorService,
              private toastr: ToastrService,
  ) { 

  }


  ngOnInit(): void {

    this.initialUsers();
    this.errorService.closeIsLoading$.pipe(delay(700)).subscribe(emitted => emitted && (this.isLoading = false));

    const user = getDataSS('user');
    if(user){
      this.loggedUser = user;
    }
  }

  initialUsers(){
    this.isLoading = true;
    this.userService.getAllUsers().subscribe(
      ( {success, users} )=>{
          if(success){
            if(users){
              this.users = users;
            }
            setTimeout(()=>{ this.isLoading = false },700)
          }
      })

  }

  openModalNewUser(){

    // const modalRef = this.modalService.open(NewUserModalComponent,{
    //   backdrop: 'static', 
    //   keyboard: false,  
    //   size: "lg"
    // });
    // modalRef.result.then(
    //   (result) => {
    //     if(result === 'new-user'){
    //       this.initialUsers();
    //     }
    //   },
    // );

  }


}



