import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.scss'
})
export class DeleteModalComponent implements OnInit {

  component : string = '';
  action : string = '';


  constructor(
                @Inject(MAT_DIALOG_DATA) public data: any,
                private matDialogRef : MatDialogRef<DeleteModalComponent>,
                private paymentService : PaymentService,
                private authService : AuthService,
                private notificationService : NotificationService,

             )
  {}

  ngOnInit(): void {

    this.component = this.data.component;
    // this.action = this.data.action;
  }

  closeViewModal(){

    if(this.component === "participant" ){
      this.paymentService.authPaymentAction$.emit(false);
    }else if(this.component === "user"){
      this.authService.authDeleteUser$.emit(false);
    }else if(this.component === "notification"){
      this.notificationService.authDeleteAllNotifications$.emit(false);
    }

    this.matDialogRef.close();


  }

  
  continue(){

    if(this.component === "participant" ){
      this.paymentService.authPaymentAction$.emit(true);
    }else if(this.component === "user"){
      this.authService.authDeleteUser$.emit(true);
    }else if(this.component === "notification"){
      this.notificationService.authDeleteAllNotifications$.emit(true);
    }

    this.matDialogRef.close();
  }

  
}
