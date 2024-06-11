import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BankCreditcardService {


  private baseUrl = environment.baseUrl;
  // private baseUrl2 = environment.baseUrl2;
  
  authDelBank$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelCreditCard$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelBankAssociation$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelCardBank$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelResultBankAgreement$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelBankAgreement$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  successAddBankToAssociation$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  successAddCardToBank$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  successAddCardsToBankAgreement$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  bankDataSelected$ : EventEmitter<any> = new EventEmitter<any>; 

  

  constructor(
              private http : HttpClient,

  )       

  {  }


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


  createCreditCardRule( body:any, file:File ){

    const JSONbody = JSON.stringify(body)
    const formData = new FormData();
    formData.append("file", file )
    formData.append("body", JSONbody )

    return this.http.post<any>(`${this.baseUrl}api/creditcard/createCreditCardRule`, formData) 
    .pipe(
      tap( ( res) =>{  console.log("from createCreditCardRule service: ",res) }  
      ),            
      map( res => res )
    )
  }

  deleteCreditCardById( id:any ){
    return this.http.delete<any>(`${this.baseUrl}api/creditcard/deleteCreditCardById/${id}`) 
    .pipe(
      tap( ( res) =>{  console.log("from deleteCreditCardById service: ",res) }  
      ),            
      map( res => res )
    )
  }

  editCreditCardById( id:any, body:any, file:File ){

    const JSONbody = JSON.stringify(body)
    const formData = new FormData();
    formData.append("file", file )
    formData.append("body", JSONbody )

      return this.http.put<any>(`${this.baseUrl}api/creditcard/editCreditCardById/${id}`, formData) 
      .pipe(
        tap( ( res) =>{  console.log("from editCreditCardById service: ",res) }  
        ),            
        map( res => res )
      )
  }

  getAllCreditCards(  ){
    return this.http.get<any>(`${this.baseUrl}api/creditcard/getAllCreditCards`) 
    .pipe(
      tap( ( res) =>{  console.log("from getAllCreditCards service: ",res) }  
      ),            
      map( res => res )
    )
  }

  //apunta al VPS
  validateBankAccount( body:any  ){

    return this.http.post<any>(`${this.baseUrl}api/bankAccount/validateBankAccount`, body) 
    .pipe(
      tap( ( res) =>{  console.log("from validateBankAccount service: ",res) }  
      ),            
      map( res => res )
    )
  }

  createBankAccount( body:any, file : File ){

    const JSONbody = JSON.stringify(body)
    const formData = new FormData();
    formData.append("file", file )
    formData.append("body", JSONbody )

      return this.http.post<any>(`${this.baseUrl}api/bankAccount/createBankAccount`, formData) 
      .pipe(
        tap( ( res) =>{  console.log("from createBankAccount service: ",res) }  
        ),            
        map( res => res )
      )
  }

  editBankById( id:any, body:any, file:File ){

    const JSONbody = JSON.stringify(body)
    const formData = new FormData();
    formData.append("file", file )
    formData.append("body", JSONbody )

      return this.http.put<any>(`${this.baseUrl}api/bankAccount/editBankById/${id}`, formData) 
      .pipe(
        tap( ( res) =>{  console.log("from editBankById service: ",res) }  
        ),            
        map( res => res )
      )
  }

  getAllBanksAccounts(  ){
    return this.http.get<any>(`${this.baseUrl}api/bankAccount/getAllBanksAccounts`) 
    .pipe(
      tap( ( res) =>{  console.log("from getAllBanksAccounts service: ",res) }  
      ),            
      map( res => res )
    )
  }

  deleteBankById( id:any ){
    return this.http.delete<any>(`${this.baseUrl}api/bankAccount/deleteBankById/${id}`) 
    .pipe(
      tap( ( res) =>{  console.log("from deleteBankById service: ",res) }  
      ),            
      map( res => res )
    )
  }
  
  addBankToAssociation( id:any, body:any ){
    
    return this.http.post<any>(`${this.baseUrl}api/association/addBankToAssociation/${id}`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from addBankToAssociation service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  getBanksFromAssociation( id:any ){
    
    return this.http.get<any>(`${this.baseUrl}api/bankaccount/getBanksFromAssociation/${id}`) 
    .pipe(
      tap( ( res) =>{
                    console.log("from getBanksFromAssociation service: ",res);
                }  
      ),            
      map( res => res )
    )
  }
 
  deleteBankFromAssociation( id:any ){
    
    return this.http.delete<any>(`${this.baseUrl}api/bankaccount/deleteBankFromAssociation/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from deleteBankFromAssociation service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  getAllDigitsCheck(  ){
    return this.http.get<any>(`${this.baseUrl}api/creditcard/getAllDigitsCheck`) 
    .pipe(
      tap( ( res) =>{  console.log("from getAllDigitsCheck service: ",res) }  
      ),            
      map( res => res )
    )
  }


// bank agreement

  createBankAgreement( body:any, file : File ){

    const JSONbody = JSON.stringify(body)
    const formData = new FormData();
    formData.append("file", file )
    formData.append("body", JSONbody )

      return this.http.post<any>(`${this.baseUrl}api/bankAccount/createBankAgreement`, formData) 
      .pipe(
        tap( ( res) =>{  console.log("from createBankAgreements service: ",res) }  
        ),            
        map( res => res )
      )
  }

  getAllBankAgreements(  ){
    return this.http.get<any>(`${this.baseUrl}api/bankAccount/getAllBankAgreements`) 
    .pipe(
      tap( ( res) =>{  console.log("from getAllBankAgreements service: ",res) }  
      ),            
      map( res => res )
    )
  }

  deleteBankAgreementById( id:any ){
    return this.http.delete<any>(`${this.baseUrl}api/bankAccount/deleteBankAgreementById/${id}`) 
    .pipe(
      tap( ( res) =>{  console.log("from deleteBankAgreementById service: ",res) }  
      ),            
      map( res => res )
    )
  }

  editBankAgreementById( id:any, body:any, file:File ){

    const JSONbody = JSON.stringify(body)
    const formData = new FormData();
    formData.append("file", file )
    formData.append("body", JSONbody )

      return this.http.put<any>(`${this.baseUrl}api/bankAccount/editBankAgreementById/${id}`, formData) 
      .pipe(
        tap( ( res) =>{  console.log("from editBankAgreementById service: ",res) }  
        ),            
        map( res => res )
      )
  }

  getCardsFromBankAgreement( id:any ){
    
    return this.http.get<any>(`${this.baseUrl}api/bankaccount/getCardsFromBankAgreement/${id}`) 
    .pipe(
      tap( ( res) =>{
                    console.log("from getCardsFromBankAgreement service: ",res);
                }  
      ),            
      map( res => res )
    )
    
 
  }

  addCardsToBankAgreement( id:any, body:any ){
    
    return this.http.post<any>(`${this.baseUrl}api/bankaccount/addCardsToBankAgreement/${id}`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from addCardsToBankAgreement service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  
  deleteCardFromBankAgreement( id:any ){
    
    return this.http.delete<any>(`${this.baseUrl}api/bankaccount/deleteCardFromBankAgreement/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from deleteCardFromBankAgreement service: ",res);
                }  
      ),            
      map( res => res )
    )
  }


  
  
  


}
