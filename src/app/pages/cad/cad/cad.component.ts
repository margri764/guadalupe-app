import { ChangeDetectorRef, Component, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule,  } from '@angular/forms';
import { Subject, Subscription, delay } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ErrorService } from 'src/app/services/error.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';



@Component({
  selector: 'app-cad',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, FormsModule],
  templateUrl: './cad.component.html',
  styleUrl: './cad.component.scss'
})
export class CadComponent {

  
  displayedColumns: string[] = ['code', 'name','cpf'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // start search
  @Output() onDebounce: EventEmitter<string> = new EventEmitter();
  @Output() onEnter   : EventEmitter<string> = new EventEmitter();
  
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Verificar si la tecla presionada es Enter
    if (event.key === 'Enter') {
      this.searchCad();  // Llamar a tu función de búsqueda
    }
  }
  
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
  loadingUser : boolean = false;
  
  usersCAD : any[]=[];
  isLoading : boolean = false;
  msg : string = '';
  
  
  private unsubscribe$: Subscription;
  show : boolean = false;
  typeSearch: string | null;
  selectedFile: File | null = null;
  admin : any | null;
  msgNamePopover: string = "Informe duas palavras, em seguida, pressione 'Enter'";
  msgCPFPopover: string = "Digite 8 dígitos, em seguida, pressione 'Enter'";
  msgCodePopover: string = "Digite 7 dígitos e uma letra, e depois pressione 'Enter'";
  
    
  
    constructor(
                private errorService : ErrorService,
                private fb : FormBuilder,
                private imageUploadService : ImageUploadService,
                private toastr: ToastrService,
                private cdr: ChangeDetectorRef
    
      
                ) 
  
    {

      (screen.width <= 800) ? this.phone = true : this.phone = false;
      this.dataSource = new MatTableDataSource();
  
      this.myFormSearch = this.fb.group({
        itemSearch:  [ '' ],
      });   
  
     }
  
 
    ngOnInit(): void {
  
      this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe( (emitted) => { if(emitted){this.isLoading = false; this.spinner = false}});
      
      this.imageUploadService.showSearchCadMsg$.subscribe( emitted => { if(emitted){this.warningToast('Tente adicionar mais dados à consulta ou espere, por favor.')}});
      
      this.getAdminCadastro();
  
    }
    
  cancelSearch(){
    this.myFormSearch.get('itemSearch')?.setValue('');
    this.loadingUser = false;
    this.imageUploadService.searchInCAD('cancel');
  }
  
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.upload();
  }
  
  upload() {
    this.successToast('Upload bem-sucedido')
  }
  
  
  searchCad(){
  
    const value = this.myFormSearch.get('itemSearch')?.value;
  
    this.usersCAD = [];
  
    if(!this.typeSearch){
      this.warningToastSearch('Escolha uma opção de busca.')
      this.myFormSearch.get('itemSearch')?.setValue('');
      return;
    }
    
    if(value && value !== ''){
  
      if(this.typeSearch  && this.typeSearch === 'name'){
        const containsNumbers = /\d/.test(value);
        if(containsNumbers){
          this.warningToastSearch('Se selecionar Nome, não adicione números.')
          return
        }
        const words = value.trim().split(/\s+/); 
        const quantity = words.length;
        if(quantity < 2){
          return;
        }
  
      }else if(this.typeSearch  && this.typeSearch === 'number'){
  
        const containsLetters = /[a-zA-Z]/.test(value);
        
        if(containsLetters){
          this.warningToastSearch('Se selecionar CPF, não adicione letras.')
          return
        }
  
        if(value.length < 8){
          this.warningToastSearch('Inserir um mínimo de 8 números.')
          return;
        }
      }else if(this.typeSearch  && this.typeSearch === 'code'){
  
        const containsLetters = /[a-zA-Z]/.test(value);
        const containsNumbers = /\d/.test(value);
       
        if(!containsLetters || ! containsNumbers){
          this.warningToastSearch('Se selecionar cod. CAD deve adicionar números e letras.')
          return
        }
      }
    }  
  
    this.itemSearch = value;
    this.spinner = true;
    this.labelNoFound = false;
  
    this.imageUploadService.searchInCAD(value).subscribe(({ usersCAD }) => {
  
      if(usersCAD && usersCAD.length > 0){
  
        this.usersCAD = usersCAD.slice(0, 200);

        if(usersCAD && usersCAD.length > 0){
          this.dataSource.data = usersCAD;
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'code': return item.code;
              case 'name': return item.name;
              case 'cpf': return item.number;
              default: return '';
            }
          };
        }
        this.spinner = false;
    
 
      }else if(usersCAD && usersCAD.length === 0){
          this.labelNoFound = true;
          setTimeout(()=>{ this.labelNoFound = false }, 1200);
          this.spinner = false;
      } 
    })
  }
  
  
  getAdminCadastro(){
  
    this.isLoading = true;
    this.imageUploadService.getAdminCadastro().subscribe(
      ( {success, admin} )=>{
          if(success){
            this.admin = admin;
            setTimeout(() => { this.isLoading = false }, 700);
          }
      })
  }
  
  typeSearchManage(){
    this.myFormSearch.get('itemSearch')?.setValue('');
  }
  
  successToast( msg:string){
    this.toastr.success(msg, 'Sucesso!!', {
      positionClass: 'toast-bottom-right', 
      timeOut: 3500, 
      messageClass: 'message-toast',
      titleClass: 'title-toast'
    });
  }
  
  openDeleteModal( action:string ){
    // const modalRef = this.modalService.open(DeleteModalComponent,{
    //   backdrop: 'static', 
    //   keyboard: false,    
    //   windowClass: 'custom-modal-delete'
    // });
    // modalRef.componentInstance.data = { component: "groups", action }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    const savedPageSize = localStorage.getItem('cadPageSize');
    if (savedPageSize) {
      this.paginator.pageSize = +savedPageSize;
    }
    this.paginator.page.subscribe((event) => {
      localStorage.setItem('cadPageSize', event.pageSize.toString());
    });
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  warningToast( msg:string){
    this.toastr.warning(msg, 'Demorando muito!!', {
      positionClass: 'toast-top-right', 
      timeOut: 3500, 
      messageClass: 'message-toast',
      titleClass: 'title-toast'
    });
  }
  
  warningToastSearch( msg:string){
    this.toastr.warning(msg, '', {
      positionClass: 'toast-top-right', 
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
  
