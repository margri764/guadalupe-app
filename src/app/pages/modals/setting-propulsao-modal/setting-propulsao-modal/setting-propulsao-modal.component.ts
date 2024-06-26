import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, ViewChild, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from 'src/app/material.module';
import { CurrenciesService } from 'src/app/services/currencies.service';
import { DrawersService } from 'src/app/services/drawers.service';
import { PropulsaoService } from 'src/app/services/propulsao.service';
import { AppState } from 'src/app/shared/redux/app.reducer';
import * as authActions from 'src/app/shared/redux/auth.actions';
import { getDataSS, saveDataSS } from 'src/app/shared/storage';
import { AssignDioceseDrawerComponent } from "../../../drawers/assign-diocese-drawer/assign-diocese-drawer/assign-diocese-drawer.component";
import { MatDrawer } from '@angular/material/sidenav';
import { AssignFonteDrawerComponent } from "../../../drawers/assign-fonte-drawer/assign-fonte-drawer/assign-fonte-drawer.component";
import { AssignAdminDrawerComponent } from "../../../drawers/assign-admin-drawer/assign-admin-drawer/assign-admin-drawer.component";
import { Subscription } from 'rxjs';

interface propulsao {
  country :string,
  status: 'assigned',
  admins : object,
  dioceses: object | null,
  fonts : object | null,
}

@Component({
    selector: 'app-setting-propulsao-modal',
    standalone: true,
    templateUrl: './setting-propulsao-modal.component.html',
    styleUrl: './setting-propulsao-modal.component.scss',
    imports: [CommonModule, MaterialModule, ReactiveFormsModule, AssignDioceseDrawerComponent, AssignFonteDrawerComponent, AssignAdminDrawerComponent]
})
export class SettingPropulsaoModalComponent implements OnDestroy{

  @ViewChild('drawerDiocese') drawerDiocese!: MatDrawer;
  @ViewChild('drawerFonte') drawerFonte!: MatDrawer;
  @ViewChild('drawerAdmin') drawerAdmin!: MatDrawer;

  myForm!: FormGroup;
  myFormCountry!: FormGroup;
  currencies : string []=[];
  isLoading: boolean = false;
  propulsao : any;
  propulsaoName: any;
  dioceseChecked: boolean = false;
  resultChecked: boolean = false;
  countryChecked: boolean = false;
  adminChecked: boolean = false;
  dioceses: any [] | null=[];
  admins: any [] | null=[];
  fonts: any [] | null=[];
  selectError: boolean = false;
  showCountry : boolean = true;
  country : any | null;
  phone : boolean = false;
  backClose : boolean = false;
  moreDioceses : boolean = false;
  moreFontes : boolean = false;
  moreAdmins : boolean = false;
  readonly panelOpenState = signal(false);
  private subscriptions: Subscription = new Subscription();



  constructor(
              private fb : FormBuilder,
              private toastr: ToastrService,
              private propulsaoService : PropulsaoService,
              private store : Store<AppState>,
              private currenciesServices : CurrenciesService,
              private drawerService : DrawersService,
              private dialogRef : MatDialogRef<SettingPropulsaoModalComponent>,
              @Inject (MAT_DIALOG_DATA) public data :any
            )
   { 

    this.subscriptions.add(
      this.drawerService.openDrawerDiocese$.subscribe((isOpen) => {
        if (isOpen) {
        this.drawerDiocese.open();
        }
      })
    )

    this.subscriptions.add(
      this.drawerService.closeDrawerDiocese$.subscribe((close) => {
        if (close) {
        this.drawerDiocese.close();
        }
      })
     )

    this.subscriptions.add(
      this.drawerService.openDrawerFonte$.subscribe((isOpen) => {
        if (isOpen) {
        this.drawerFonte.open();
        }
      })
    )

    this.subscriptions.add(
      this.drawerService.closeDrawerFonte$.subscribe((close) => {
        if (close) {
        this.drawerFonte.close();
        }
      })
    )

    this.subscriptions.add(
      this.drawerService.openDrawerAdmin$.subscribe((isOpen) => {
        if (isOpen) {
        this.drawerAdmin.open();
        }
      })
    )

    this.drawerService.closeDrawerAdmin$.subscribe((close) => {
      if (close) {
       this.drawerAdmin.close();
      }
    });



    (screen.width < 800) ? this.phone = true : this.phone = false;
    
    this.myForm = this.fb.group({
      name:     [ '', [Validators.required] ],
      idcurrency:    [ '' ],
      description:  [ ''],
    });

    this.myFormCountry = this.fb.group({
      country:     [ '', [Validators.required] ],
    });

   }

  ngOnInit(): void {

    this.getCurrency();
    this.propulsao = this.data.propulsao;
    this.propulsaoName = this.data.propulsao.name;
    
    this.store.select('auth').subscribe(
      ( {dioceses, results, admins, country, fonts} )=>{
        this.dioceses = dioceses;
        // this.results = results;
        this.admins = admins;
        this.country = country;
        this.fonts = fonts;
        let propulsaoName = getDataSS('propulsaoName');
        this.myFormCountry.get('country')?.setValue(this.country);

        // cada vez a actualiza evalus sin no quedo nada guardado y elimina el item para q no haya nulls y ademas elimina el nombre de la prop
        if(!dioceses){
          sessionStorage.removeItem('diocesesPropulsao');
          // si no hay mas nada en el SS q elimine el nombre tambien
          // const resultsPropulsao = getDataSS('resultsPropulsao');
          const adminsPropulsao = getDataSS('adminsPropulsao');
          const fontsPropulsao = getDataSS('fontsPropulsao');
          const countryPropulsao = getDataSS('countryPropulsao');
          if(!adminsPropulsao && !fontsPropulsao && !countryPropulsao){
            sessionStorage.removeItem('propulsaoName');
          }
        }else{
            // si dioceses cambio y ademas todavia no guardo el nombre de la diocesis, lo guarda ahora
            if(!propulsaoName && propulsaoName !== '' && propulsaoName !== this.propulsaoName){
              saveDataSS('propulsaoName', this.propulsaoName);
            }
            saveDataSS('diocesesPropulsao', this.dioceses);
        }
        
        // if(!results){
        //   sessionStorage.removeItem('resultsPropulsao');
        //   // si no hay mas nada en el SS q elimine el nombre tambien
        //   const adminsPropulsao = getDataSS('adminsPropulsao');
        //   const fontsPropulsao = getDataSS('fontsPropulsao');
        //   const countryPropulsao = getDataSS('countryPropulsao');
        //   const diocesesPropulsao = getDataSS('diocesesPropulsao');

        //   if( !adminsPropulsao && !fontsPropulsao && !countryPropulsao && !diocesesPropulsao){
        //     sessionStorage.removeItem('propulsaoName');
        //   }
        // }else{
        //     // si result cambio y ademas todavia no guardo el nombre de la diocesis, lo guarda ahora
        //     if(!propulsaoName && propulsaoName !== '' && propulsaoName !== this.propulsaoName){
        //       saveDataSS('propulsaoName', this.propulsaoName);
        //     }
        //     saveDataSS('resultsPropulsao', this.results);
        // }

        if(!admins){
            sessionStorage.removeItem('adminsPropulsao');
            // si no hay mas nada en el SS q elimine el nombre tambien
            const fontsPropulsao = getDataSS('fontsPropulsao');
            const countryPropulsao = getDataSS('countryPropulsao');
            const diocesesPropulsao = getDataSS('diocesesPropulsao');
            // const resultsPropulsao = getDataSS('resultsPropulsao');
            if(!diocesesPropulsao && !countryPropulsao && !fontsPropulsao){
              sessionStorage.removeItem('propulsaoName');
            }
        }else{
           // si result cambio y ademas todavia no guardo el nombre de la diocesis, lo guarda ahora
           if(!propulsaoName && propulsaoName !== '' && propulsaoName !== this.propulsaoName){
            saveDataSS('propulsaoName', this.propulsaoName);
          }
          saveDataSS('adminsPropulsao', this.admins);
        }

        if(!country){
          sessionStorage.removeItem('countryPropulsao');
          this.showCountry = false;
          this.myFormCountry.get('country')?.setValue('');

          // si no hay mas nada en el SS q elimine el nombre tambien
          const diocesesPropulsao = getDataSS('diocesesPropulsao');
          // const resultsPropulsao = getDataSS('resultsPropulsao');
          const adminsPropulsao = getDataSS('adminsPropulsao');
          const fontsPropulsao = getDataSS('fontsPropulsao');
          if(!diocesesPropulsao && !adminsPropulsao && !fontsPropulsao){
            sessionStorage.removeItem('propulsaoName');
          }
        }else{
          // si result cambio y ademas todavia no guardo el nombre de la diocesis, lo guarda ahora
          if(!propulsaoName && propulsaoName !== '' && propulsaoName !== this.propulsaoName){
            saveDataSS('propulsaoName', this.propulsaoName);
          }
          saveDataSS('countryPropulsao', this.country)
          this.myFormCountry.get('country')?.setValue(this.country);
        }

        if(!fonts){
          sessionStorage.removeItem('fontsPropulsao');
          // si no hay mas nada en el SS q elimine el nombre tambien
          const diocesesPropulsao = getDataSS('diocesesPropulsao');
          // const resultsPropulsao = getDataSS('resultsPropulsao');
          const adminsPropulsao = getDataSS('adminsPropulsao');
          const countryPropulsao = getDataSS('countryPropulsao');
          if(!diocesesPropulsao && !adminsPropulsao && !countryPropulsao){
            sessionStorage.removeItem('propulsaoName');
          }
        }else{
          // si result cambio y ademas todavia no guardo el nombre de la diocesis, lo guarda ahora
          if(!propulsaoName && propulsaoName !== '' && propulsaoName !== this.propulsaoName){
            saveDataSS('propulsaoName', this.propulsaoName);
          }
          saveDataSS('fontsPropulsao', this.fonts);
        }
    })

    // this.store.select('auth').subscribe(
    //   ( {results} )=>{
    //     this.results = results;
    //     console.log(this.results);

    //     if(!results ){
          
    //       // no quiero tener null por eso saco el item
    //       sessionStorage.removeItem('resultsPropulsao');

    //       // si no hay mas nada en el SS q elimine el nombre tambien
    //       const resultsPropulsao = getDataSS('resultsPropulsao');
    //       const adminsPropulsao = getDataSS('adminsPropulsao');
    //       if(!resultsPropulsao && adminsPropulsao){
    //         sessionStorage.removeItem('propulsaoName');
    //       }
    //     }else{
    //       // si no tiene resultados guardados en el SS y ademas todavia no guardo el nombre de la diocesis, lo guarda ahora
    //       const propulsaoName = getDataSS('propulsaoName');
    //       if(!propulsaoName && propulsaoName !== '' && propulsaoName !== this.propulsaoName){
    //         saveDataSS('propulsaoName', this.propulsaoName)
    //       }
    //         saveDataSS('resultsPropulsao', results);
    //     }
    // })
  }


  onSave(){
    
    if ( !this.country || (!this.admins || this.admins.length === 0) ) {
      this.warningToast('Selecione administradores e país da propulsão')
      return;
    }

    const admins: any[] = [];
    const dioceses: any[] = [];
    const fonts: any[] = [];

   this.admins.forEach( (element) => admins.push(element.iduser));

   if(this.dioceses && this.dioceses.length > 0){
     this.dioceses.forEach( (element) => dioceses.push(element.iddiocese));
   }

   if(this.fonts && this.fonts.length > 0){
    this.fonts.forEach( (element) => fonts.push(element.idfonte));
   }



    const body : propulsao = {
         country : this.country,
         status: 'assigned',
         admins,
         dioceses: (dioceses.length > 0) ? dioceses : null,
         fonts: (fonts.length > 0) ? fonts : null,
        //  results: (results.length > 0) ? results : null,
    }

    this.isLoading = true;
    this.propulsaoService.configPropulsaoById(this.propulsao.idpropulsao, body).subscribe(
      ( {success} )=>{
        if(success){
          setTimeout(()=>{ this.isLoading = false },700);
          this.successToast('Propulsão criada corretamente');
          this.dialogRef.close('new-propulsao');
          this.resetPropulsaoConfig();
          console.log(this.fonts);

        }
      })
  }

  addCountryPropulsao(){
    this.showCountry = false;
    const country = this.myFormCountry.get('country')?.value;
    if(country !== ''){
      saveDataSS('countryPropulsao', country);
      this.store.dispatch(authActions.addCountryToPropulsao({country}));
      this.showCountry = true;
    }
  }
  removeCountry(){
    this.showCountry = false;
    this.myFormCountry.get('country')?.setValue('');
    sessionStorage.removeItem('countryPropulsao');
    this.store.dispatch(authActions.unSetCountryPropulsao());
  }
  
resetPropulsaoConfig(){

  this.store.dispatch(authActions.unSetDiocesesPropulsao());
  // this.store.dispatch(authActions.unSetResultsPropulsao());
  this.store.dispatch(authActions.unSetAdminsPropulsao());
  this.store.dispatch(authActions.unSetCountryPropulsao());
  this.store.dispatch(authActions.unSetFontsPropulsao());

  sessionStorage.removeItem('propulsaoName');
  sessionStorage.removeItem('diocesesPropulsao');
  // sessionStorage.removeItem('resultsPropulsao');
  sessionStorage.removeItem('adminsPropulsao');
  sessionStorage.removeItem('countryPropulsao');
  sessionStorage.removeItem('fontsPropulsao');
}

openDrawerDiocese( value:string){
  switch (value) {
    case 'diocese':
                    this.drawerService.openDrawerDiocese();
                    this.drawerService.closeDrawerFonte();
                    this.drawerService.closeDrawerAdmin();
                     
      break;

    case 'fonte':
                 this.drawerService.openDrawerFonte();
                 this.drawerService.closeDrawerDiocese();
                 this.drawerService.closeDrawerAdmin();

                 
      break;

    case 'admin':
                 this.drawerService.openDrawerAdmin();
                 this.drawerService.closeDrawerDiocese();
                 this.drawerService.closeDrawerFonte();
      break;

  
    default:
      break;
  }
}


  successToast( msg:string){
    this.toastr.success(msg, 'Sucesso!!', {
      positionClass: 'toast-bottom-right', 
      timeOut: 3500, 
      messageClass: 'message-toast',
      titleClass: 'title-toast'
    });
  }

  onSelectMoeda( event: any){
    const selectedValue = event.target.value;
  }

  getCurrency(){
    this.currenciesServices.getAllCurrencies().subscribe(
      ( {success, currencies} )=>{
        if(success){
          this.currencies = currencies;
          // currencies.forEach((element:any)=>{ this.currencies.push(element.name) })
        }
      })
  }

  warningToast( msg:string){
    this.toastr.warning(msg, 'Obrigatório!!', {
      positionClass: 'toast-bottom-right', 
      timeOut: 3500, 
      messageClass: 'message-toast',
      titleClass: 'title-toast'
    });
  }

  closeModal(){
    this.backClose = true;
    setTimeout( ()=>{ this.dialogRef.close() }, 400 )
  }

  validField( field: string ) {
    const control = this.myForm.controls[field];
    return control && control.errors && control.touched;
  }

  ngOnDestroy() {
    // Desuscribirse de todas las suscripciones
    this.subscriptions.unsubscribe();
  }
  
  

}

