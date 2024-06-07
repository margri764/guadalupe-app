import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, delay, take } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { ErrorService } from 'src/app/services/error.service';
import { PaymentService } from 'src/app/services/payment.service';
import { ImagenPathPipe } from "../../../pipe/imagen-path.pipe";
import { PaymentStatusPipe } from "../../../pipe/payment-status.pipe";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteModalComponent } from '../../modals/delete-modal/delete-modal/delete-modal.component';
import { ToastrService } from 'ngx-toastr';
import { UserModalComponent } from '../../user-modal/user-modal/user-modal.component';


@Component({
    selector: 'app-participants',
    standalone: true,
    templateUrl: './participants.component.html',
    styleUrl: './participants.component.scss',
    imports: [CommonModule, MaterialModule, ImagenPathPipe, PaymentStatusPipe, RouterModule, ReactiveFormsModule]
  })
  export class ParticipantsComponent implements OnInit, AfterViewInit {
    
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['img', 'fullName', 'address', 'conference', 'paymentOption', 'date','paymentStatus', 'action'];
  actionList : string [] = ['Reembolsar', 'Eliminar',];
  dataSource: MatTableDataSource<any>;
  isLoading : boolean = false;
  phone : boolean = false;
  payments : any[]=[];
  originalPayments: any[];
  private unsubscribe$: Subscription;

  constructor(
              private errorService : ErrorService,
              private paymentService : PaymentService,
              private activatedRoute : ActivatedRoute,
              private dialog : MatDialog,
              public toastr: ToastrService,

             ) 
  {

    this.activatedRoute.params.subscribe(( {id} )=>{ console.log(id)});

    (screen.width < 800) ? this.phone = true : this.phone = false;

    this.errorService.closeIsLoading$.pipe(delay(700)).subscribe( (emitted: any) => { if(emitted){this.isLoading = false}});

    this.dataSource = new MatTableDataSource();

  }
  
  
  ngOnInit(): void {
    this.getInitData();
  }
  
  getInitData(){
    this.isLoading = true;
    this.paymentService.getAllPayments().subscribe(
      ( {success, payments} )=>{
        if(success){
          this.payments = payments;
          this.dataSource.data = payments;
          this.originalPayments = [...this.payments];
          setTimeout(()=>{this.isLoading = false },1000)
        }
      })
  }


  orderStatus(option: string) {
    if (option === 'pending') {
      this.dataSource.data = this.originalPayments.filter(element => element.paymentStatus === 'pending');
    } else if (option === 'paid') {
      this.dataSource.data = this.originalPayments.filter(element => element.paymentStatus === 'paid');
    } else if (option === 'all') {
      this.dataSource.data = this.originalPayments;
    }
  }

  onActionSelected( action : any, element : any){

    console.log(element);

    const dialogRef =this.dialog.open(DeleteModalComponent,{
      maxWidth: (this.phone) ? "98vw": '',
      panelClass: "custom-modal-picture",    
      data: { component: "participant" }
      });
      

      this.unsubscribe$ = this.paymentService.authPaymentAction$.pipe(take(1)).subscribe(
        (auth)=>{
          if(auth){

            const body = {
              idinvoice: element.idinvoice,
              iduser: element.iduser,
              idpayment: element.idpayment

            }

            if( action === 'refund'){
              this.paymentService.refundInvoice(body).subscribe(
                ( {success} )=>{
  
                })
            }else if(action === 'remove'){

              this.paymentService.deletePayment(element.idpayment).subscribe(
                ( {success} )=>{
                  if(success){
                      this.successToast('registro e pagamento excluídos corretamente');
                      this.getInitData();
                  }
                })
            }

          
          }else{
            this.unsubscribe$.unsubscribe();
          }
        })

 

  }

  changeState( status:string, idpayment:any){

    this.isLoading = true;
    const body = { paymentStatus: status}

    this.paymentService.changeStatus( idpayment, body).subscribe(
      ( {success} )=>{
        if(success){
          this.successToast('Status modificado com sucesso');
          this.getInitData();
        }
      })

  }

  openDialogUser( user:any) {
    const dialogRef = this.dialog.open(UserModalComponent,{
      maxWidth: (this.phone) ? "99vw": '600px',
      maxHeight: (this.phone) ? "98vh": '800px',
      data: user
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    const savedPageSize = localStorage.getItem('participantsPageSize');
  if (savedPageSize) {
    this.paginator.pageSize = +savedPageSize;
  }

  this.paginator.page.subscribe((event) => {
    localStorage.setItem('participantsPageSize', event.pageSize.toString());
  });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



}
