import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  productSubscription! : Subscription;
  numberCheck! : boolean; 
  isPercent : boolean = false;
  // emailPattern  : string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  emailPattern: string = "^(([^<>()[\\]\\.,;:\\s@\"]+(\\.[^<>()[\\]\\.,;:\\s@\"]+)*)|(\\\".+\\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$";

  emailStaffPattern: string = "^(?!.*[@])(?!.*@name\\.com).*$";
  phoneNumber: string = "^[1-9][0-9]{9}$";

  onlyPositiveNumber : string =  "^{1-9][0-9]+$";
  public dosDigitosPercent : string = "^[0-9]{1,2}$|^[0-9]{1,3}\.[0-9]{1,2}$" 
   passwordPattern: RegExp = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
  
  
    
    constructor ( )
      {   }
    
    changeRegularExpression( value : string) {
  
      return ( formGroup: AbstractControl) : ValidationErrors | null =>{
  
        const number = formGroup.get(['value'])?.value;
      let test;
          if(this.isPercent ){      
              let regex = /^[0-9]{1,2}$|^[0-9]{1,2}\.[0-9]{1,2}$/ //si se eligió "DECREASE %" NO PUEDE tener mas de 2 digitos!! (sino daria un precio negativo)
              test = regex.exec(number);
          }else{
              let regex = /^[0-9]{1,100}$|^[0-9]{1,100}\.[0-9]{1,3}$/ // REGEX NORMAL
              test = regex.exec(number);
          }
      if(test == null){ 
        formGroup.get(['value'])?.setErrors({match: true})
        return { match: true} // esto es el error
      
      }else{
        formGroup.get(['value'])?.setErrors(null);
        return null; //esto es el OK
     }
    }
  }
  
    passwordValidator( password : string, confirm : string ) {
      return ( formGroup: AbstractControl) : ValidationErrors | null =>{
        const pass1 = formGroup.get(password)?.value;
        const pass2 = formGroup.get(confirm)?.value;
        console.log(pass1, pass2);
        
  
        if (pass1 !== pass2) {
           formGroup.get(confirm)?.setErrors({match: true})
           return { match: true}
          }
  
          formGroup.get(confirm)?.setErrors(null);
          return null
        }
    }     
  
     greaterThanZero(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } | null => {
        const value = control.value;
        if (value <= 0) {
          return { greaterThanZero: true };
        }
        return null;
      };
    }
  }