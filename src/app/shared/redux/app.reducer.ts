import { ActionReducerMap } from '@ngrx/store';
import * as auth from './auth.reducer';


export interface AppState  {
   auth: auth.Auth,
}



export const appReducers: ActionReducerMap<AppState> = {
   auth: auth.authReducer,

}
