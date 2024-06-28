import { Component, ElementRef, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, take, takeUntil } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/redux/app.reducer';
import * as authActions from 'src/app/shared/redux/auth.actions';
import { UserService } from 'src/app/services/user.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { DeleteModalComponent } from '../../delete-modal/delete-modal/delete-modal.component';
import { FileSizePipe } from "../../../../pipe/file-size.pipe";
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

interface CustomFile extends File {
  previewUrl?: string;
  downloadLink?: string;
}



@Component({
    selector: 'app-upload-document-modal',
    standalone: true,
    templateUrl: './upload-document-modal.component.html',
    styleUrl: './upload-document-modal.component.scss',
    imports: [CommonModule, MaterialModule, FileSizePipe, NgxDropzoneModule ],
})
export class UploadDocumentModalComponent {

  displayedColumns: string[] = ['name', 'size', 'progress','action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  @ViewChild('closeView') closeView! : ElementRef;
  @ViewChild('table') table! : ElementRef;
  @ViewChild('openAskDelDocument') openAskDelDocument! : ElementRef;

  pdfSrcList: any[] = [];
  selectedPdfSrc: any = null;
  selectedFile: CustomFile | null = null;
  files: File [] = [];
  fileName: string = '';
  msg : string = '';
  loadingPdf: boolean = false;
  fileNameBack : string = '';
  selectedPdfBack : any;
  arrIds : any []=[];
  menuDocument: any;
  arrDocument : any []=[];
  showBulk : boolean = false;
  progressBars: { [key: string]: number } = {}; 
  bulkProgress : number = 0;
  isLoading: boolean = false;
  showSuccess: boolean = false;
  phone: boolean = false;
  sentDocumentsArray : any []=[];
  isFileUploaded: boolean[] = [];
  subirTodo : boolean = false;
  removerTodo : boolean = false;
  user: any;
  private destroy$ = new Subject<void>();
  private deleteSubscription : Subscription;
  allBarsFinished: boolean = false;
  backClose: boolean = false;
  config:any;


  constructor(
              private userService : UserService,
              public toastr: ToastrService,
              private store : Store<AppState>,
              private dialogRef : MatDialogRef<UploadDocumentModalComponent>,
              private dialog : MatDialog,
              @Inject (MAT_DIALOG_DATA) public data : any
  ) {

    (screen.width <= 800) ? this.phone = true : this.phone = false;
    this.dataSource = new MatTableDataSource();

   }

  ngOnInit(): void {

    this.userService.resetDocumentUpload$.subscribe((emmited)=>{ if(emmited){this.reset()} });
    this.user = this.data;
  }




closeViewModal(){
  this.backClose = true;
    setTimeout( ()=>{ this.dialogRef.close() }, 400 )
}

thumbailsPdf(doc:any ){

  const fileName = doc.filePath.split('/').pop() ;

  const serverURL = 'https://arcanjosaorafael.org/documents/'; 
  
  console.log( `${serverURL}${fileName}`);
    return  `${serverURL}${fileName}`;
}

uploadDocument( file:any, index:number){


//si ya fue enviado q retorne
  if(this.sentDocumentsArray.includes(file)){ return; }

  this.startProgress(index);

  this.userService.uploadDocument(this.user.iduser, file).subscribe(
    ( {success} )=>{
      if(success){
        
        setTimeout(()=>{
           this.progressBars[index] = 100;
           this.isFileUploaded[index] = true; 
          }, 2000 );

        // guardo una copia de lo q ya se envio para evitar duplicados
        this.sentDocumentsArray.push(file);
        setTimeout(()=>{ 
          this.reset(); 
          this.dialogRef.close();
          this.getDocByUserId(this.user.iduser);
          // this.userService.reloadDocuments$.emit(true);
          this.successToast('Operação de envio bem-sucedida!')
         }, 4000)
      }
    })
}

getDocByUserId( id:any ){
  this.userService.getDocByUserId(id).subscribe(
  ( {document} )=>{
    this.store.dispatch(authActions.setUserDocuments( {documents: document}));
  });

}

bulkUploadDocument() {
  const unsentFiles = this.files.filter((file) => !this.sentDocumentsArray.includes(file));

  let successCounter = 0;

    this.files.forEach((file, index) => {
      if (unsentFiles.includes(file)) {
        this.startProgress(index);
        
          this.userService.uploadDocument(this.user.iduser, file).subscribe(({ success }) => {
            if (success) {
              this.subirTodo = true;
              
                this.bulkProgress = 100;
                this.progressBars[index] = 100;
                this.isFileUploaded[index] = true;
                
                if (!this.sentDocumentsArray.includes(file)) {
                  this.sentDocumentsArray.push(file);
                }
                successCounter++;

              if (successCounter === this.files.length) {
                this.successToast('Operação de envio bem-sucedida!')
                setTimeout(() => {
                  this.reset();
                  this.dialogRef.close();
                  this.getDocByUserId(this.user.iduser);
                  // this.userService.reloadDocuments$.emit(true);
                }, 3000);
              }
          
            }
          });

      }
    }
    );
}

reset(){
    this.isFileUploaded = [];
    this.files = [];
    this.fileName = '';
    this.sentDocumentsArray = [];
    this.bulkProgress = 0;
    this.progressBars = {};
    this.subirTodo = false;
}

closeToast(){
  this.showSuccess = false;
  this.files = [];
  this.pdfSrcList = [];
}


onSelect($event: any): void {

  // console.log(event);
  const addedFiles: File[] = $event.addedFiles;

  for (const file of addedFiles) {
    this.readAndShowPDF(file);
    this.files.push(file);

    if(this.files && this.files.length > 0){
      this.dataSource.data = this.files;
    }


  }
  if(this.phone){
    this.goToTable();
  }

}



readAndShowPDF(file: any): void {

  console.log(file);

  const reader = new FileReader();
  this.loadingPdf = true;

  reader.onload = (e) => {
    const base64Data = e.target?.result as string;
    const downloadLink = base64Data;
    
    this.pdfSrcList.push({ preview: base64Data, downloadLink });
    this.loadingPdf = false;
  };

  reader.readAsDataURL(file);

  console.log(reader);
}

private subscription : Subscription;

onRemove(file: File): void {

  const fileName = file.name;
  if (this.sentDocumentsArray.some((sentFile) => sentFile.name === fileName)) {
    return;
  }

  this.openAskDelete('single');

  this.subscription = this.userService.authDelUploadDocument$.pipe(take(1)).subscribe( (emmited)=>{ 
    if(emmited){
        const index = this.files.indexOf(file);
        if (index !== -1) {
          this.files.splice(index, 1);
          this.dataSource.data = this.files;
          this.pdfSrcList.splice(index, 1);
          console.log(this.pdfSrcList);
        }
    }else{
      this.subscription.unsubscribe()
    }
  })
}

goToTable(){
  setTimeout( () => {
    this.table.nativeElement.scrollIntoView(
    { 
      alignToTop: true,
      block: "center",
    });
    }, 0);
}

bulkRemove(){

  this.openAskDelete('bulk')

  this.deleteSubscription=  this.userService.authDelBulkUploadDocument$.pipe(take(1)).subscribe( (emmited)=>{ 
    if(emmited){
        this.reset();
      }else{
      this.deleteSubscription.unsubscribe();
      }
    })
}

readAndShowPDFBack(file: any): void {

  console.log(file);

  const reader = new FileReader();
  this.loadingPdf = true;

  reader.onload = (e) => {
    const base64Data = e.target?.result as string;
    const downloadLink = base64Data;
    
    this.pdfSrcList.push({ preview: base64Data, downloadLink });
    this.loadingPdf = false;
  };

  reader.readAsDataURL(file);

  console.log(reader);
}

fileContentToBuffer(fileContent: any): Uint8Array {
  if (fileContent && fileContent.data && Array.isArray(fileContent.data)) {
    return new Uint8Array(fileContent.data);
  }
  return new Uint8Array();
}

startProgress(index: number = -1) {
  if (index !== -1) {
    this.progressBars[index] = 0;
  } else {
    this.bulkProgress = 0;
  }

  const totalSteps = 40;
  const intervalDuration = 50;
  const incrementPerStep = 100 / totalSteps;

  const intervalId = setInterval(() => {
    if (index !== -1) {
      this.progressBars[index] += incrementPerStep;
    } else {
      this.bulkProgress += incrementPerStep;
    }
    if (this.progressBars[index] >= 99) {
      this.progressBars[index] = 99;
      clearInterval(intervalId);
      this.checkAllBarsFinished();  // Verifica si todas las barras han terminado
    } else if (this.bulkProgress >= 99) {
      this.bulkProgress = 99;
      clearInterval(intervalId);
      this.checkAllBarsFinished();  // Verifica si todas las barras han terminado
    }
    
  }, intervalDuration);
}

checkAllBarsFinished() {
  // Obtén los valores del objeto progressBars
  const values = Object.values(this.progressBars);

  // Verifica si todos los valores son iguales a 99
  this.allBarsFinished = values.every(progress => progress === 99);

  // Si todas las barras han terminado, realiza la acción que desees
  if (this.allBarsFinished) {
    // alert('Todas las barras han terminado');
    // Realiza la acción que desees cuando todas las barras han finalizado
    // Puedes reiniciar variables, realizar otras acciones, etc.
    // ...
  }
}

openAskDelete( action:string){

  if(action !== "bulk" && action !== 'single'){return};

  this.dialog.open(DeleteModalComponent,{
    maxWidth: (this.phone) ? "98vw": '',
    panelClass: "custom-modal-picture",    
    data: { component: "upload-documents", action }
    });



}

successToast( msg:string){
  this.toastr.success(msg, 'Sucesso!!', {
    positionClass: 'toast-bottom-right', 
    timeOut: 3500, 
    messageClass: 'message-toast',
    titleClass: 'title-toast'
  });
}

closeModal(){
  this.backClose = true;
  setTimeout( ()=>{ this.dialogRef.close() }, 400 )
}


ngOnDestroy(): void {
  if(this.subscription){
    this.subscription.unsubscribe();
  }
  if(this.deleteSubscription){
    this.deleteSubscription.unsubscribe();
  }
}



}
