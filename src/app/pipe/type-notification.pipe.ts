import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeNotification',
  standalone: true
})
export class TypeNotificationPipe implements PipeTransform {

  transform( notification : any) {

    console.log(notification);

    if(notification.typeNotification === 'new-profile'){
    return "Criou um novo perfil";
    }else if(notification.typeNotification === 'payment' && notification.paymentStatus === 'pending'){
      return "Gero um cadastro (aguardando pagamento)";
    } else if(notification.typeNotification === 'payment' && notification.paymentStatus === 'paid'){
      return "Voncluiu um pagamento";
    }else if(notification.typeNotification === 'payment' && notification.paymentStatus === 'refund'){
      return "No processo de devolução de pagamento";
    }
    
    
    return ''
  }
}