import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  EventEmitter, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',

})


export class PaymentService {

  authPaymentAction$ : EventEmitter<boolean> = new EventEmitter<boolean>; 

  // user! : User;
  user! : any;
  private baseUrl = environment.baseUrl;

  constructor(
                private http : HttpClient,
             ) 
  {

   }



createPayment( body:any ){

 
  return this.http.post<any>(`${this.baseUrl}api/payment/createPayment`, body) 
  
  .pipe(
    tap( ( res) =>{console.log("from createPayment Service: ", res);  }  
    ),            
    map( (res: any) => res )
  )
}

getAllPayments(  ){

 
  return this.http.get<any>(`${this.baseUrl}api/payment/getAllPayments`) 
  
  .pipe(
    tap( ( res) =>{console.log("from getAllPayments Service: ", res);  }  
    ),            
    map( (res: any) => res )
  )
}

  getUserByEmail( email:any ){

    return this.http.get<any>(`${this.baseUrl}api/user/getUserByEmail?email=${email}` ) 
    
    .pipe(
      tap( ( res) =>{console.log("from getUserByEmail Service: ", res);  }  
      ),            
      map( (res: any) => res )
    )
  }

  refundInvoice( body:any ){

 
    return this.http.post<any>(`${this.baseUrl}api/payment/refundPayment`, body) 
    
    .pipe(
      tap( ( res) =>{console.log("from refoundInvoice Service: ", res);  }  
      ),            
      map( (res: any) => res )
    )
  }

  deletePayment( id:any ){
 
    return this.http.delete<any>(`${this.baseUrl}api/payment/deletePayment/${id}`,) 
    
    .pipe(
      tap( ( res) =>{console.log("from deletePayment Service: ", res);  }  
      ),            
      map( (res: any) => res )
    )
  }

  changeStatus(id:any, body:any ){
    return this.http.patch<any>(`${this.baseUrl}api/payment/changeStatus/${id}`, body) 
    
    .pipe(
      tap( ( res) =>{console.log("from changeStatus Service: ", res);  }  
      ),            
      map( (res: any) => res )
    )
  }


  validaCPF(cpf:any) {
    cpf = cpf.replace(/\D/g, ''); // Remover cualquier carácter que no sea dígito
    if (cpf.length !== 11) return false; // Verificar que el CPF tenga 11 dígitos

    let num1 : any, num2 : any, num3: any, num4: any, num5: any, num6: any, num7: any, num8: any, num9: any, num10: any, num11: any, soma1: any, soma2: any, resto1: any, resto2: any;

    // Extracción de los dígitos del CPF
    num1 = parseInt(cpf.charAt(0));
    num2 = parseInt(cpf.charAt(1));
    num3 = parseInt(cpf.charAt(2));
    num4 = parseInt(cpf.charAt(3));
    num5 = parseInt(cpf.charAt(4));
    num6 = parseInt(cpf.charAt(5));
    num7 = parseInt(cpf.charAt(6));
    num8 = parseInt(cpf.charAt(7));
    num9 = parseInt(cpf.charAt(8));
    num10 = parseInt(cpf.charAt(9));
    num11 = parseInt(cpf.charAt(10));

    // Validación de CPFs inválidos conocidos
    if (num1 === num2 && num2 === num3 && num3 === num4 && num4 === num5 && num5 === num6 && num6 === num7 && num7 === num8 && num8 === num9 && num9 === num10 && num10 === num11) {
        return false;
    } else {
        soma1 = num1 * 10 + num2 * 9 + num3 * 8 + num4 * 7 + num5 * 6 + num6 * 5 + num7 * 4 + num8 * 3 + num9 * 2;
        resto1 = (soma1 * 10) % 11;
        if (resto1 === 10) {
            resto1 = 0;
        }

        soma2 = num1 * 11 + num2 * 10 + num3 * 9 + num4 * 8 + num5 * 7 + num6 * 6 + num7 * 5 + num8 * 4 + num9 * 3 + num10 * 2;
        resto2 = (soma2 * 10) % 11;
        if (resto2 === 10) {
            resto2 = 0;
        }

        if (resto1 === num10 && resto2 === num11) {
            return true;
        } else {
            return false;
        }
    }
}


 
}
