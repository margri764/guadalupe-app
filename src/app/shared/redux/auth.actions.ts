import { createAction, props } from "@ngrx/store";



/************************** SET *******************************/
export const setUser = createAction( '[Auth] setUser',
    props<{ user: any }>()
);

export const setUserDocuments = createAction( '[Auth] setUserDocuments',
    props<{ documents: any [] }>()
);

export const addDiocesesToPropulsao = createAction( '[Auth] addDiocesesToPropulsao',
    props<{ dioceses: any [] }>()
);

export const addResultsToPropulsao = createAction( '[Auth] addResultsToPropulsao',
    props<{ results: any [] }>()
);

export const addAdminsToPropulsao = createAction( '[Auth] addAdminsToPropulsao',
    props<{ admins: any [] }>()
);

export const addCountryToPropulsao = createAction( '[Auth] addCountryToPropulsao',
    props<{ country: string }>()
);

export const addFontsToPropulsao = createAction( '[Auth] addFontsToPropulsao',
    props<{ fonts: any [] }>()
);

export const setPropulsao = createAction( '[Auth] setPropulsao',
    props<{ propulsao: {} }>()
);

export const addBankToAssociation = createAction( '[Auth] addBankToAssociation',
    props<{ banks: any [] }>()
);

export const addFormAddress = createAction( '[Auth] addFormAddress',
    props<{ formAddress: any [] }>()
);

export const addFormEmails = createAction( '[Auth] addFormEmails',
    props<{ formEmails: any [] }>()
);

export const addFormPhones = createAction( '[Auth] addFormPhones',
    props<{ formPhones: any [] }>()
);

export const addFormUnity = createAction( '[Auth] addFormUnity',
    props<{ formUnity: any [] }>()
);

export const addFormPaymentInitMonth= createAction( '[Auth] addFormPaymentInitMonth',
    props<{ formPaymentInitMonth: any [] }>()
);

export const addFormGv = createAction( '[Auth] addFormGv',
    props<{ formGv: any [] }>()
);

export const addFormAdjustment = createAction( '[Auth] addFormAdjustment',
    props<{ formAdjustment: any [] }>()
);

export const addFormFixedDeposit = createAction( '[Auth] addFormFixedDeposit',
    props<{ formFixedDeposit: any [] }>()
);

export const addFormPaymentMethod = createAction( '[Auth] addFormPaymentMethod',
    props<{ formPaymentMethod: any [] }>()
);

export const addFormBank = createAction( '[Auth] addFormBank',
    props<{ formBank: any [] }>()
);

export const addFormBankAccount = createAction( '[Auth] addFormBankAccount',
    props<{ formBankAccount: any }>()
);

export const addFormCreditcard = createAction( '[Auth] addFormCreditcard',
    props<{ formCreditcard: any }>()
);

export const addFormAddedPerson = createAction( '[Auth] addFormAddedPerson',
    props<{ formAddedPerson: any []}>()
);







/************************** UNSET *******************************/
export const unSetUser = createAction('[Auth] unSetUser');
export const unSetUserDocuments = createAction('[Auth] unSetUserDocuments');
export const unSetDiocesesPropulsao = createAction('[Auth] unSetDiocesesPropulsao');
export const unSetResultsPropulsao = createAction('[Auth] unSetResultsPropulsao');
export const unSetAdminsPropulsao = createAction('[Auth] unSetAdminsPropulsao');
export const unSetCountryPropulsao = createAction('[Auth] unSetCountryPropulsao');
export const unSetFontsPropulsao = createAction('[Auth] unSetFontsPropulsao');
export const unSetBankAssociation = createAction('[Auth] unSetBankAssociation');
export const unSetPropulsao = createAction('[Auth] unSetPropulsao');
export const unSetFormAddress = createAction('[Auth] unSetFormAddress');
export const unSetFormEmails = createAction('[Auth] unSetFormEmails');
export const unSetFormPhones = createAction('[Auth] unSetFormPhones');
export const unSetFormUnity = createAction('[Auth] unSetFormUnity');
export const unSetFormPaymentInitMonth = createAction( '[Auth] unsetFormPaymentInitMonth');
export const unSetFormGv = createAction( '[Auth] unSetFormGv');
export const unSetFormAdjustment = createAction( '[Auth] unSetFormAdjustment');
export const unSetFormFixedDeposit = createAction( '[Auth] unSetFormFixedDeposit');
export const unSetFormPaymentMethod = createAction( '[Auth] unSetFormPaymentMethod');
export const unSetFormBank = createAction( '[Auth] unSetFormBank');
export const unSetFormBankAccount = createAction( '[Auth] unSetFormBankAccount');
export const unSetFormCreditcard = createAction( '[Auth] unSetFormCreditcard');
export const unSetFormAddedPerson = createAction( '[Auth] unSetFormAddedPerson');



export const deleteUserDocument = createAction( '[Auth] deleteUserDocument',
props<{ id:any }>()
);

export const deleteDioceseFromPropulsao = createAction( '[Auth] deleteDioceseFromPropulsao',
props<{iddiocese:any }>()
);

export const deleteResultFromPropulsao = createAction( '[Auth] deleteResultFromPropulsao',
props<{idresult:any }>()
);

export const deleteAdminFromPropulsao = createAction( '[Auth] deleteAdminFromPropulsao',
props<{idadmin:any }>()
);

export const deleteFontFromPropulsao = createAction( '[Auth] deleteFontFromPropulsao',
props<{idfonte:any }>()
);

export const deleteBankFromAssociation = createAction( '[Auth] deleteBankFromAssociation',
props<{idbankaccount:any }>()
);

export const deleteFormAddress = createAction( '[Auth] deleteFormAddress',
props<{idformaddress:any }>()
);

export const deleteFormEmail = createAction( '[Auth] deleteFormEmail',
props<{email:any }>()
);

export const deleteFormPhone = createAction( '[Auth] deleteFormPhone',
props<{phone:any }>()
);


export const bulkDeleteUserDocuments = createAction( '[Auth] bulkDeleteUserDocuments',
props<{ ids:any[] }>()
);


