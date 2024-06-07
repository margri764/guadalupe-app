import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { WebcamImage, WebcamInitError, WebcamModule, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-take-picture-modal',
  standalone: true,
  imports: [CommonModule, WebcamModule, MaterialModule],
  templateUrl: './take-picture-modal.component.html',
  styleUrl: './take-picture-modal.component.scss'
})
export class TakePictureModalComponent implements OnInit, OnDestroy  {

  

      // toggle webcam on/off
      public showWebcam = true;
      public allowCameraSwitch = true;
      public multipleWebcamsAvailable = false;
      public deviceId: string;
      imgSize : number;
      public videoOptions: MediaTrackConstraints = {
  
      };
      public errors: WebcamInitError[] = [];
    
      // latest snapshot
      public webcamImage: WebcamImage;
    
      // webcam snapshot trigger
      private trigger: Subject<void> = new Subject<void>();
      // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
      private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();
    

      constructor(
                     public dialogRef: MatDialogRef<TakePictureModalComponent>,

                  )
      {
 
        this.reSizeVideo();
      }

    ngOnInit(): void {
    }
        
        public get triggerObservable(): Observable<void> {
        return this.trigger.asObservable();
      }
    
      public get nextWebcamObservable(): Observable<boolean|string> {
        return this.nextWebcam.asObservable();
      }

      public triggerSnapshot(): void {
        this.trigger.next();
      }
    
      public handleInitError(error: WebcamInitError): void {
        this.errors.push(error);
        console.log(this.errors);
        
      }

      showCamera : boolean = false;
    
      public handleImage(webcamImage: WebcamImage): void {
        this.webcamImage = webcamImage;
        this.showWebcam = false;
        this.dialogRef.close(webcamImage.imageAsDataUrl);
      }

      public reSizeVideo(): void {
        if (screen.width < 800) {
          this.videoOptions.width = { ideal: screen.width - 20  };
          this.videoOptions.height = { ideal: screen.width - 20 }; 
          this.imgSize = screen.width - 20
        } else {
          this.videoOptions.width = { ideal: 500 };
          this.videoOptions.height = { ideal: 500 }; // Mantén la proporción cuadrada
          this.imgSize  = 500;
        }
      }

      ngOnDestroy(): void {
        this.showWebcam = false; // This will stop the webcam
      }
    


}
