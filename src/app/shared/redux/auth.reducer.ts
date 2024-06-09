import { Action, createReducer, on } from '@ngrx/store';
import { addAdminsToPropulsao, addBankToAssociation, addCountryToPropulsao, addDiocesesToPropulsao, addFontsToPropulsao, addFormAddress, addFormEmails, addFormPaymentInitMonth, addFormPhones, addFormUnity, addResultsToPropulsao, bulkDeleteUserDocuments, deleteAdminFromPropulsao, deleteBankFromAssociation, deleteDioceseFromPropulsao, deleteFontFromPropulsao, deleteFormAddress, deleteResultFromPropulsao, deleteUserDocument, setPropulsao, setUser, setUserDocuments, unSetAdminsPropulsao, unSetBankAssociation, unSetCountryPropulsao, unSetDiocesesPropulsao, unSetFontsPropulsao, unSetFormAddress, unSetFormEmails, unSetFormPhones, unSetFormUnity, unSetPropulsao, unSetResultsPropulsao, unSetUser, unSetUserDocuments, unSetFormPaymentInitMonth, addFormGv, unSetFormGv, addFormAdjustment, unSetFormAdjustment, addFormFixedDeposit, unSetFormFixedDeposit, addFormPaymentMethod, unSetFormPaymentMethod, addFormBank, unSetFormBank, addFormBankAccount, unSetFormBankAccount, addFormCreditcard, unSetFormCreditcard, addFormAddedPerson, unSetFormAddedPerson } from './auth.actions';

interface bankAccount{
  rAgencia : string,
  rNr_cc: string,
  bankLogo : string,
  agenciaName:string,
  agenciaAddress : string
}

interface creditCard{
  cardNumber : string,
  ccvNumber: string,
  bankAgreements : string,
  pathCreditcardLogo:string,
}

interface addedPerson{
  fullName : string,
  relationship: string,
  phone : string,
  segmentation : string
  titular:boolean,
  cpf?:string,
}




export interface Auth {
    user: any | null; 
    documents : any [] | null;
    dioceses : any [] | null;
    results : any [] | null;
    admins : any [] | null;
    fonts : any [] | null;
    formAddress : any [] | null;
    formEmails : any [] | null;
    formPhones : any [] | null;
    country : any;
    propulsao: any | null;
    formUnity: any | null;
    formPaymentInitMonth: any | null;
    formGv: any | null;
    formAdjustment: any | null;
    formFixedDeposit: any | null;
    formPaymentMethod: any | null;
    formBank: any | null;
    banks : any [] | null;
    formBankAccount : bankAccount | null;
    formCreditcard : creditCard| null;
    formAddedPerson : addedPerson [] | null;

   
}

export const initialState: Auth = {
     user: null,
     documents : null,
     dioceses : null,
     results : null,
     admins : null,
     country : null,
     fonts : null,
     formAddress : null,
     formPhones : null,
     formEmails : null,
     propulsao : null,
     banks : null,
     formUnity : null,
     formPaymentInitMonth : null,
     formGv: null,
     formAdjustment: null,
     formFixedDeposit: null,
     formPaymentMethod: null,
     formBank: null,
     formBankAccount : null,
     formCreditcard : null,
     formAddedPerson : null
}

const _authReducer = createReducer(initialState,

    on( setUser, (state, { user }) => ({ ...state, user: { ...user }  })),
    on( unSetUser, state => ({ ...state, user: null  })),

    on( setPropulsao, (state, { propulsao }) => ({ ...state, propulsao: { ...propulsao }  })),
    on( unSetPropulsao, state => ({ ...state, propulsao: null  })),

    on( setUserDocuments, (state, { documents }) => ({ ...state, documents: [...documents]  })),
    on( unSetUserDocuments, state => ({ ...state, documents: null  })),
    // on(deleteUserDocument, (state, { id }) => {
    //     const updatedDocuments = state.documents.filter(document => document.iddocument !== id);
    //     return { ...state, documents: updatedDocuments };
    //   }),

      // on(bulkDeleteUserDocuments, (state, { ids }) => {
      //   const updatedDocuments = state.documents.filter(document => {
      //     let deleteDocument = true;
      //     ids.forEach(id => {
      //       if (document.iddocument === id) {
      //         deleteDocument = false;
      //       }
      //     });
      //     return deleteDocument;
      //   });
      
      //   return { ...state, documents: updatedDocuments };
      // }),

      on( addDiocesesToPropulsao, (state, { dioceses }) => ({ ...state, dioceses: [...dioceses]  })),
      on( unSetDiocesesPropulsao, state => ({ ...state, dioceses: null  })),
      // on( deleteDioceseFromPropulsao, (state, { iddiocese }) => {
      //   const updatedDioceses = state.dioceses.filter(diocese => diocese.iddiocese !== iddiocese);
      //   return { ...state, dioceses: updatedDioceses };
      // }),

      on( addResultsToPropulsao, (state, { results }) => ({ ...state, results: [...results]  })),
      on( unSetResultsPropulsao, state => ({ ...state, results: null  })),
      // on( deleteResultFromPropulsao, (state, { idresult }) => {
      //   const updatedResults = state.dioceses.filter(results => results.idresult !== idresult);
      //   return { ...state, results: updatedResults };
      // }),

      on( addAdminsToPropulsao, (state, { admins }) => ({ ...state, admins: [...admins]  })),
      on( unSetAdminsPropulsao, state => ({ ...state, admins: null  })),
      // on( deleteAdminFromPropulsao, (state, { idadmin }) => {
      //   const updatedAdmins = state.admins.filter(admin => admin.iduser !== idadmin);
      //   return { ...state, admins: updatedAdmins };
      // }),

      on( addFontsToPropulsao, (state, { fonts }) => ({ ...state, fonts: [...fonts]  })),
      on( unSetFontsPropulsao, state => ({ ...state, fonts: null  })),
      // on( deleteFontFromPropulsao, (state, { idfonte }) => {
      //   const updatedFonts = state.admins.filter(font => font.idfonte !== idfonte);
      //   return { ...state, fonts: updatedFonts };
      // }),

      on( addCountryToPropulsao, (state, { country }) => ({ ...state, country : country  })),
      on( unSetCountryPropulsao, state => ({ ...state, country: null  })),


      on( addBankToAssociation, (state, { banks }) => ({ ...state, banks: [...banks]  })),
      on( unSetBankAssociation, state => ({ ...state, banks: null  })),
      // on( deleteBankFromAssociation, (state, { idbankaccount }) => {
      //   const updatedBanks = state.admins.filter(font => font.idfonte !== idbankaccount);
      //   return { ...state, fonts: updatedBanks };
      // }),

      on( addFormAddress, (state, { formAddress }) => ({ ...state, formAddress: [...formAddress]  })),
      on( unSetFormAddress, state => ({ ...state, formAddress: null  })),
      // on( deleteFormAddress, (state, { idformaddress }) => {
      //   const updatedFormAddress = state.formAddress.filter(address => address.idformaddress !== idformaddress);
      //   return { ...state, idformaddress: updatedFormAddress };
      // }),
      
      on( addFormEmails, (state, { formEmails }) => ({ ...state, formEmails: [...formEmails]  })),
      on( unSetFormEmails, state => ({ ...state, formEmails: null  })),
      
      on( addFormPhones, (state, { formPhones }) => ({ ...state, formPhones: [...formPhones]  })),
      on( unSetFormPhones, state => ({ ...state, formPhones: null  })),
      
      on( addFormUnity, (state, { formUnity }) => ({ ...state, formUnity: formUnity })),
      on( unSetFormUnity, state => ({ ...state, formUnity: null  })),

      on( addFormPaymentInitMonth, (state, { formPaymentInitMonth }) => ({ ...state, formPaymentInitMonth: formPaymentInitMonth })),
      on( unSetFormPaymentInitMonth, state => ({ ...state, formPaymentInitMonth: null  })),
   
      on( addFormGv, (state, { formGv }) => ({ ...state, formGv: formGv })),
      on( unSetFormGv, state => ({ ...state, formGv: null  })),
   
      on( addFormAdjustment, (state, { formAdjustment }) => ({ ...state, formAdjustment: formAdjustment })),
      on( unSetFormAdjustment, state => ({ ...state, formAdjustment: null  })),

      on( addFormFixedDeposit, (state, { formFixedDeposit }) => ({ ...state, formFixedDeposit: formFixedDeposit })),
      on( unSetFormFixedDeposit, state => ({ ...state, formFixedDeposit: null  })),

      on( addFormPaymentMethod, (state, { formPaymentMethod}) => ({ ...state, formPaymentMethod: formPaymentMethod })),
      on( unSetFormPaymentMethod, state => ({ ...state, formPaymentMethod: null  })),
      
      on( addFormBank, (state, { formBank}) => ({ ...state, formBank: formBank })),
      on( unSetFormBank, state => ({ ...state, formBank: null  })),
      
      on( addFormBankAccount, (state, { formBankAccount}) => ({ ...state, formBankAccount: formBankAccount })),
      on( unSetFormBankAccount, state => ({ ...state, formBankAccount: null  })),

      on( addFormCreditcard, (state, { formCreditcard}) => ({ ...state, formCreditcard: formCreditcard })),
      on( unSetFormCreditcard, state => ({ ...state, formCreditcard: null  })),
      // on( addFormEmails, (state, { formEmails }) => ({ ...state, formEmails: [...formEmails]  })),
   
      on( addFormAddedPerson, (state, { formAddedPerson}) => ({ ...state, formAddedPerson: [...formAddedPerson] })),
      on( unSetFormAddedPerson, state => ({ ...state, formAddedPerson: null  })),
   
      
      
      
);

export function authReducer(state: Auth | undefined, action: Action) {
    return _authReducer(state, action);
}