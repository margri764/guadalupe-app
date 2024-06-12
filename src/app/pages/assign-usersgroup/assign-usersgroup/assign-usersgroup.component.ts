import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { AlarmGroupService } from 'src/app/services/alarm-group.service';
import { UserService } from 'src/app/services/user.service';
import { ImagenPathPipe } from "../../../pipe/imagen-path.pipe";
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
    selector: 'app-assign-usersgroup',
    standalone: true,
    templateUrl: './assign-usersgroup.component.html',
    styleUrl: './assign-usersgroup.component.scss',
    imports: [CommonModule, MaterialModule, ReactiveFormsModule, ImagenPathPipe, MatChipsModule]
})

export class AssignUsersgroupComponent {
  
  @Output() closeDrawer: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input () data:any;  
  // start search
  @Output() onDebounce: EventEmitter<string> = new EventEmitter();
  @Output() onEnter   : EventEmitter<string> = new EventEmitter();
  
  debouncer: Subject<string> = new Subject();
  
  // start search
  itemSearch : string = '';
  mostrarSugerencias: boolean = false;
  sugested : string= "";
  suggested : any[] = [];
  spinner : boolean = false;
  fade : boolean = false;
  search : boolean = true;
  product  : any[] = [];
  clients : any []=[];
  arrClient : any []=[];
  clientFound : any = null;
  isClientFound : boolean = false;
  labelNoFound : boolean = false;
  phone : boolean = false;
  // end search
  
  myFormSearch! : FormGroup;
  loadindCongregatio : boolean = false;
  selectedUsers : any []=[];
  currentUserIndex: number = 0
  selectedImg : any [] = []
  
  
  
    constructor(
                private fb : FormBuilder,
                private userService : UserService,
                private alarmGroupService: AlarmGroupService,
                private toastr: ToastrService,
                private dialogRef : MatDialogRef<AssignUsersgroupComponent>

  
    ) { 
  
      this.myFormSearch = this.fb.group({
        itemSearch:  [ '',  ],
      });   
      
    }
  
    ngOnInit(): void {
  
      this.myFormSearch.get('itemSearch')?.valueChanges.subscribe(newValue => {
        this.itemSearch = newValue;
  
        if(this.itemSearch !== ''){
           this.teclaPresionada();
        }else{
          this.suggested = [];
          this.spinner= false;
        }
      });
  
      this.debouncer
      .pipe(debounceTime(700))
      .subscribe( valor => {
  
        this.sugerencias(valor);
      });
    }
  
    selectUser(user: any){
  
      if (!this.selectedUsers.some(selectedUser => selectedUser.iduser === user.iduser)) {
        this.selectedUsers.push(user);
        this.selectedImg.push( {iduser:user.iduser, Ruta_Imagen: user.Ruta_Imagen } )
      }else{
        return
      }
    
    }
  
    removeUser(user: any){
  
      const index = this.selectedUsers.indexOf(user);
      if (index >= 0) {
        this.selectedUsers.splice(index, 1);
        this.selectedImg.splice(index, 1);
      }
       console.log(this.selectedUsers);  
    }
  
    addUsersToGroup(){

      let body : any = []; 
      this.selectedUsers.forEach((item)=>{body.push(item.iduser)})
      const arrayIds = {
        usersIds: body
      }
      this.alarmGroupService.setUserGroups( this.data, arrayIds).subscribe( 
        ( {success} )=>{
          if(success){
            this.successToast("Usuários adicionados com sucesso.");
            setTimeout(()=>{
               this.selectedUsers = [];
               this.suggested = [];
               this.myFormSearch.reset();
               this.closeDrawerAfterAddUsers();
               }, 1200)
          }
  
        })
  
    }

    closeDrawerAfterAddUsers(){
      this.closeDrawer.emit(false);
    }
  
    successToast( msg:string){
      this.toastr.success(msg, 'Sucesso!!', {
        positionClass: 'toast-bottom-right', 
        timeOut: 3500, 
        messageClass: 'message-toast',
        titleClass: 'title-toast'
      });
    }
    
    
    
  
    // search
  
  close(){
    this.mostrarSugerencias = false;
    this.itemSearch = '';
    this.suggested = [];
    this.spinner= false;
    // this.noMatches = false;
    this.clientFound= null;
    this.isClientFound = false;
  }
  
  teclaPresionada(){
  // this.noMatches = false;
  this.debouncer.next( this.itemSearch );  
  };
  
  sugerencias(value : string){
  
    if(value ){
      if(value.length < 3){
        return;
      }
    }else{
      return;
    }
    
  this.spinner = true;
  this.itemSearch = value;
  this.mostrarSugerencias = true;  
  this.loadindCongregatio = true;
  this.labelNoFound = false;
  this.userService.searchUser(value).subscribe ( 
    ( {users} )=>{
      if(users.length === 0){
          this.spinner = false;
          this.myFormSearch.get('itemSearch')?.setValue('');
          this.labelNoFound = true;
          this.loadindCongregatio = false;
          setTimeout(()=>{ this.labelNoFound = false}, 1500)
      }else{
        this.loadindCongregatio = false;
        this.suggested = users.slice(0, 3);
      }
    }
  )
  }
  
  Search( item: any ){
    setTimeout(()=>{
      this.mostrarSugerencias = true;
      this.spinner = false;
      this.fade = false;
      this.clientFound = item;
      this.isClientFound = true;
      this.myFormSearch.get('itemSearch')?.setValue('');
      this.suggested = [];
      // this.noMatches = false;
    },500)
  }
  // search


 
  }
  