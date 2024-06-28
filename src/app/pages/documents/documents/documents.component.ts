import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalComponent } from '../../modals/delete-modal/delete-modal/delete-modal.component';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, filter, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/redux/app.reducer';
import * as authActions from 'src/app/shared/redux/auth.actions'
import { UserService } from 'src/app/services/user.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewDocumentModalComponent } from '../../modals/view-document-modal/view-document-modal/view-document-modal.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ImagenDocPathPipe } from "../../../pipe/imagen-doc-path.pipe";
import { FileTypePipe } from "../../../pipe/file-type.pipe";
import { ContextMenuComponent } from "../../context-menu/context-menu/context-menu.component";
import { UploadDocumentModalComponent } from '../../modals/upload-document-modal/upload-document-modal/upload-document-modal.component';

@Component({
    selector: 'app-documents',
    standalone: true,
    templateUrl: './documents.component.html',
    styleUrl: './documents.component.scss',
    imports: [CommonModule, MaterialModule, PdfViewerModule, ImagenDocPathPipe, FileTypePipe, ContextMenuComponent]
})
export class DocumentsComponent {


  //menu segundo boton
  @HostListener('document:contextmenu', ['$event'])
  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
  // Obtener dimensiones de la pantalla
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  
  // Posición inicial del menú contextual
  const initialX = event.clientX;
  const initialY = event.clientY;
  
  // Ancho y alto del menú contextual
  const menuWidth = 280; // Ajusta según sea necesario
  const menuHeight = 200; // Ajusta según sea necesario
  
  // Márgenes mínimos desde los bordes de la pantalla
  const margin = 10;
  
  // Ajustar la posición si el menú se encuentra cerca de los bordes de la pantalla
  const adjustedX = initialX + menuWidth + margin > screenWidth ? screenWidth - menuWidth - margin : initialX;
  const adjustedY = initialY + menuHeight + margin > screenHeight ? screenHeight - menuHeight - margin : initialY;
  
  // Asignar la posición ajustada al componente
  this.showContextMenu = true;
  this.contextMenuPosition = { x: adjustedX, y: adjustedY };
  }
  
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const clickedInside = this.elRef.nativeElement.contains(event.target);
    if (clickedInside) {
      // Si el clic no fue dentro del componente, cierra el menú
      this.showContextMenu = false;
      this.showSubMenu = false;
    }
  }
  
  @Input() user:any;
  
  showContextMenu = false;
  contextMenuPosition = { x: 0, y: 0 };
  showSubMenu = false;
  menuStates : any=  {selected: false, downloadAll: false, noSelected: false};
  
  backFiles: any[] = [];
  pdfSrcBackList: any[] = [];
  arrIds : any []=[];
  arrDocument : any [] =[];
  loadingPdf: boolean = false;
  selectAllChecked = false;
  pdfSrc :any;
  fileName: string = '';
  fileNameBack : string = '';
  selectedPdfBack : any;
  menuDocument: any;
  imageDocPath : string = '';
  showImgInModal : boolean = false;
  isLoading : boolean = false;
  private subscription : Subscription;
  private subscriptionBulk : Subscription;
  private subscriptionBulkDownload : Subscription;
  phone : boolean = false;

  
  
    constructor(
                  private elRef: ElementRef,
                  private userService : UserService,
                  private imageUploadService : ImageUploadService,
                  private toastr: ToastrService,
                  private store : Store <AppState>,
                  private dialog : MatDialog
    ) 
    {
    (screen.width <= 800) ? this.phone = true : this.phone = false;

     }
  
  
    ngOnInit(): void {
  
      this.store.select('auth').subscribe(
        ({documents})=>{
          if(documents){
            this.arrDocument = documents;
          }
        })
  
      console.log(this.user);
  
      // this.getDocByUserId(this.user.iduser);
      
      // this.userService.reloadDocuments$.subscribe( (emitted)=>{ if(emitted){ this.getDocByUserId(this.user.iduser)} });
  
      this.userService.selectAllDocuments$.subscribe( (emmited)=>{ if(emmited){ this.toggleSelectAll() }});
  
      this.userService.deSelectAllDocuments$.subscribe( (emmited)=>{ if(emmited){ this.toggleDeSelectAll() }});
  
      this.subscriptionBulkDownload = this.userService.downloadSelectedDocuments$.
         pipe(
          // take(1),
          filter(emitted => !!emitted),)
         .subscribe( (emmited)=>{  
            if(emmited){ 
              this.downloadBulkPdf();
            }else{
              console.log('no emitio');
            }})
  
      this.userService.deleteSelectedDocuments$.subscribe( (emmited)=>{ if(emmited){ this.bulkDeleteDocuments() }})
  
    }
  
  
  //con estas dos funcion traigo los documentos q el usuario tiene en BD
  readAndShowPDFFromBack(fileContents: any[]): void {
  
    this.backFiles = fileContents;
    console.log('');
  
    fileContents.forEach((fileContent) => {
      
      const buffer = this.fileBackContentToBuffer(fileContent);
      const blob = new Blob([buffer], { type: 'application/pdf' });
  
      const reader = new FileReader();
      // this.loadingPdf = true;
  
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        const downloadLink = base64Data;
  
        this.pdfSrcBackList.push({ preview: base64Data, downloadLink });
        this.loadingPdf = false;
      };
  
      reader.readAsDataURL(blob);
    });
  }
  
  fileBackContentToBuffer(fileContent: any): Uint8Array {
    if ( Array.isArray(fileContent.hash.data)) {
      console.log('ddd');
      return new Uint8Array(fileContent.hash.data);
    }
  
    return new Uint8Array();
  }
  
  toggleSelectAll(): void {
  
    this.selectAllChecked = !this.selectAllChecked;
  
      if (this.selectAllChecked) {
        this.arrIds = this.arrDocument.map((doc: any) => doc.iddocument);
        this.userService.changeMenuStates$.next( { ...this.menuStates, selected: true });
      } else {
        this.arrIds = [];
      }
  
  }
  
  toggleDeSelectAll(): void {
    this.selectAllChecked = false;
    this.arrIds = [];
    this.userService.changeMenuStates$.next({ ...this.menuStates, selected: false });
  }
  
  openDeleteModal( action:string ){
    this.dialog.open(DeleteModalComponent,{
      maxWidth: (this.phone) ? "98vw": '',
      panelClass: "custom-modal-picture",    
      data: { component: "edit-user", action }
      });
   
  }
  
  bulkDeleteDocuments(){
  
    if(this.arrIds.length !== 0){
  
        this.openDeleteModal('bulk')
        
        this.subscriptionBulk = this.userService.authDelBulkDocument$.pipe(take(1)).subscribe( (emmited)=>{ 
          if(emmited){
            this.isLoading = true;
            const body = { ids: this.arrIds}
  
              this.imageUploadService.bulkDeleteDocuments(body).subscribe( 
                ( {success})=>{
                  if(success){
                    this.isLoading = false;
                    console.log(this.arrIds);
                    this.store.dispatch(authActions.bulkDeleteUserDocuments({ids: this.arrIds}));
                    this.successToast('Documentos excluídos com sucesso')
                    this.arrIds = [];
                  }
                });
         }else{
          this.subscriptionBulk.unsubscribe();
         }
    })  
    }
  }
  
  onCheckboxChange(  event:any, doc:any ){
  
    const isChecked = event.target.checked;
    const id = doc.iddocument;
  
    if(isChecked){
      this.arrIds.push(id);
      this.userService.changeMenuStates$.next( { ...this.menuStates, selected: true });
  
     
    }else{
      this.arrIds = this.arrIds.filter((item)=>item !== id)
    }
  
    if(this.arrIds.length === 0){
      this.closeMenu()
    }
  
  }
  
  closeMenu(): void {
    this.menuDocument = null;
  }
  
  downloadPdf(files: any) {
  
    if (files && files.filePath) {
      
      // Obtén el nombre del archivo desde la ruta
      const fileName = files.originalName;
      
      const urlSegment = files.filePath.split('/').pop();
  
      const serverURL = 'https://arcanjosaorafael.org/documents/';
  
  
      // Crea un enlace temporal
      const link = document.createElement('a');
  
      // Configura el enlace con la ruta completa del archivo en producción
      link.href = `${serverURL}${urlSegment}`;
  
      // Configura la propiedad de descarga con el nombre del archivo original
      link.download = fileName;
  
      // Abre el enlace en una nueva pestaña
      link.target = '_blank';
  
      // Simula un clic en el enlace para iniciar la descarga
      link.click();
    }
  }
  
  
  downloadBulkPdf() {
  
    this.isLoading = true;
    
    this.userService.downloadZip(this.arrIds).subscribe( 
      ({success})=>{
        if(success){
          this.toggleDeSelectAll();
          setTimeout(()=>{ this.isLoading = false },700)
          
          this.arrIds = [];
        }
      })
  }
  
  
  deleteDocById( doc:any){
  
    this.openDeleteModal('single');
  
    this.subscription = this.userService.authDelDocument$.pipe(take(1)).subscribe( (emmited)=>{ 
      if(emmited){
        this.isLoading = true;
        this.userService.deleteDocById( doc.iddocument ).subscribe(
          ( {success} )=>{
              if(success){
                this.successToast('Documento removido com sucesso');
                this.store.dispatch(authActions.deleteUserDocument({id: doc.iddocument}))
                this.isLoading = false;
              }
          })
      }else{
        this.subscription.unsubscribe()
      }
    })
    
  }
  
  showModalUploadPdf(){
    this.dialog.open(UploadDocumentModalComponent,{
      maxWidth: (this.phone) ? "97vw": '900px',
      maxHeight: (this.phone) ? "90vh": '90vh',
      data: this.user
    });
  }
  
  successToast( msg:string){
    this.toastr.success(msg, 'Sucesso!!', {
      positionClass: 'toast-bottom-right', 
      timeOut: 2000, 
      messageClass: 'message-toast',
      titleClass: 'title-toast'
    });
  }
  
  onView( doc:any){

    this.dialog.open(ViewDocumentModalComponent,{
      maxWidth: (this.phone) ? "97vw": '800px',
      maxHeight: (this.phone) ? "90vh": '90vh',
      data:{ doc, arrDocument: this.arrDocument  }
    });
   
  }
  
  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
      this.subscriptionBulk.unsubscribe();
      this.subscriptionBulkDownload.unsubscribe();
    }
  
  }
  
  }
  
