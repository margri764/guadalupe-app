import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, delay, take, takeUntil } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { ErrorService } from 'src/app/services/error.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { DeleteModalComponent } from '../../modals/delete-modal/delete-modal/delete-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-backgrounds',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './backgrounds.component.html',
  styleUrl: './backgrounds.component.scss'
})
export class BackgroundsComponent {

  displayedColumns: string[] = ['img', 'action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('fileUploader') fileUploader: ElementRef;
  
  selectedFile: File | null = null;
  // arrBackground : any []=[{filePath:'./assets/images/background-1.jpg'},{filePath:'./assets/images/background-2.jpg'}];
  arrBackground : any []=[];
  isLoading : boolean = false;
  uploading : boolean = false;
  msg: string = '';
  showSuccess: boolean = false;
  phone: boolean = false;
  private destroy$ = new Subject<void>();
  private subscription : Subscription;




  constructor(
              private imageUploadService : ImageUploadService,
              private errorService : ErrorService,
              private toastr: ToastrService,
              private dialog :MatDialog

  ) { 
    
    (screen.width <= 800) ? this.phone = true : this.phone = false;
    this.dataSource = new MatTableDataSource();

  }

  ngOnInit(): void {

    this.getInitBackground();
    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));

  }

  getInitBackground(){
    this.isLoading = true;
    this.imageUploadService.getAllBackground().subscribe(
      ( {success, backgrounds} )=>{
        if(success){
          this.arrBackground = backgrounds.map( (doc:any) => {
            const fileName = doc.filePath.split('/').pop();
            const serverURL = 'https://arcanjosaorafael.org/backgrounds/';
            return {
              ...doc,
              filePath: `${serverURL}${fileName}`
            };
          });

          if(this.arrBackground &&  this.arrBackground.length > 0){
            this.dataSource.data = this.arrBackground;
          }

          console.log( this.arrBackground);
          setTimeout(()=>{ this.isLoading= false },700)
          
        }
      })
  }

  closeToast(){
    this.showSuccess = false;
    this.msg = '';
  }

  removePicture( picture:any) {

    this.openDeleteModal('delFundo');


    this.subscription =this.imageUploadService.authDelBackground$.pipe(takeUntil(this.destroy$)).subscribe((auth)=>{
      if(auth){
        this.isLoading = true;
        this.imageUploadService.deleteBackgroundById(picture.idbackground).subscribe(
          ( {success} )=>{
            if(success){
              setTimeout(()=>{this.isLoading = false },700);
              this.successToast("Fundo eliminado com sucesso.");
              this.getInitBackground();
            }
          })
      }else{
        this.subscription.unsubscribe();
      }
    })

  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.upload();
  }

  upload() {

    this.uploading = true;
    if (this.selectedFile) {
      this.imageUploadService.uploadImage(this.selectedFile).subscribe( 
        ( {success} )=> {
            if(success){
              setTimeout(()=>{this.uploading = false },700)
              this.successToast('Upload bem-sucedido')
              this.selectedFile = null;
              this.getInitBackground();
            } }
        )
    }
  }

  backgroundOption($event: MatSlideToggleChange, id: any): void {

    const backgroundSelected = $event.checked;
    const action = backgroundSelected ? 1 : 0;
    this.isLoading = true;

    this.imageUploadService.onOffBackground(id, action).subscribe(
      ({ success }) => {
        if (success) {
          setTimeout(() => { 
            if(action === 1){
              this.successToast('Fundo ativado com successo') 
            }else if(action === 0){
             this.warningToast('Fundo pausado com successo')
            }
            this.isLoading = false;
          }, 700);
          this.getInitBackground();
        }
      }
    );
  }

  openDeleteModal( action:string ){
    this.dialog.open(DeleteModalComponent,{
      maxWidth: (this.phone) ? "98vw": '',
      panelClass: "custom-modal-picture",    
      data: { component: "background", action }
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

  warningToast( msg:string){
    this.toastr.warning(msg, 'Verificar!!', {
      positionClass: 'toast-bottom-right', 
      timeOut: 3500, 
      messageClass: 'message-toast',
      titleClass: 'title-toast'
    });
  }


  ngOnDestroy(): void {

    if(this.subscription){
      this.subscription.unsubscribe();
    }

  }


}


