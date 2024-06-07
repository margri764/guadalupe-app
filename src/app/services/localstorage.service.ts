import { Injectable } from '@angular/core';
import * as authActions from 'src/app/shared/redux/auth.actions'
import { AppState } from '../shared/redux/app.reducer';


@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {


  constructor(
    private store: Store<AppState>,
   ) 
{
}

loadInitialState() {

const user = getDataSS("user");
const propulsaoName = getDataSS('propulsaoName');
const diocesesPropulsao = getDataSS('diocesesPropulsao');
const resultsPropulsao = getDataSS('resultsPropulsao');
const adminsPropulsao = getDataSS('adminsPropulsao');
const countryPropulsao = getDataSS('countryPropulsao');
const fontsPropulsao = getDataSS('fontsPropulsao');


if (propulsaoName  &&  propulsaoName !== '' &&  diocesesPropulsao && diocesesPropulsao.length !== 0) {
this.store.dispatch(authActions.addDiocesesToPropulsao({ dioceses: diocesesPropulsao }));
}

if (propulsaoName  &&  propulsaoName !== '' &&  resultsPropulsao && resultsPropulsao.length !== 0) {
this.store.dispatch(authActions.addResultsToPropulsao({ results: resultsPropulsao }));
}

if (propulsaoName  &&  propulsaoName !== '' &&  adminsPropulsao && adminsPropulsao.length !== 0) {
this.store.dispatch(authActions.addAdminsToPropulsao({ admins: adminsPropulsao }));
}

if (propulsaoName  &&  propulsaoName !== '' &&  countryPropulsao ) {
this.store.dispatch(authActions.addCountryToPropulsao({ country: countryPropulsao }));
}

if (propulsaoName  &&  propulsaoName !== '' &&  fontsPropulsao ) {
this.store.dispatch(authActions.addFontsToPropulsao({ fonts: fontsPropulsao }));
}


if (user ) {
this.store.dispatch(authActions.setUser({ user }));
}
}

saveStateToLocalStorage(dataToSave: any, keyLStorage : string) {
saveDataLS(keyLStorage, dataToSave);
}

saveStateToSessionStorage(dataToSave: any, keyLStorage : string) {
saveDataSS(keyLStorage, dataToSave);
}


}