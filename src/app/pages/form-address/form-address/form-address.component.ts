import {  Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subject, Subscription, delay, map, startWith, take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { getDataLS, getDataSS, saveDataLS } from 'src/app/shared/storage';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import * as authActions from '../../../shared/redux/auth.actions';
import { AppState } from 'src/app/shared/redux/app.reducer';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ErrorService } from 'src/app/services/error.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { GoogleMapsModule } from '@angular/google-maps';

interface City {
  name : string,
  province : string,
  country: string
}

interface AddressSegmentationPair {
  address: string;
  segmentation: string | undefined;
  coords: any
}


declare var google: any;

@Component({
  selector: 'app-form-address',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, GoogleMapsModule],
  templateUrl: './form-address.component.html',
  styleUrl: './form-address.component.scss'
})
export class FormAddressComponent {

  displayedColumns: string[] = ['acronym', 'description','action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('divMap') divMap!: ElementRef;
  @ViewChild('inputPlaces') inputPlaces!: ElementRef;
  @ViewChild ("addedAdress" , {static: true} ) addedAdress! : ElementRef;
  @ViewChild ("form", {static: true} ) form! : ElementRef;
  @ViewChild ("top", {static: true} ) top! : ElementRef;

  mapa!: google.maps.Map;
  markers: any[] = [];

  myForm!: FormGroup;
  bannerStatus: boolean =false;
  showForm:boolean = false;
  selected:boolean = false;
  placeToSendForm:any;
  lat : any;
  lng : any;
  confirm : boolean = false;
  address : string = '';
  userLogin = null;
  user! : any;
  subscription! : Subscription;
  showLabelAddressError : boolean = false;
  isEditing : boolean = false;
  cities : any[]=[];
  city : City | null;
  subscription$ : Subscription;
  flag : string = '';
  loggedUser:any;
  addresses : any[]=[];
  addressSegmentationPairs: AddressSegmentationPair[] = [];
  isLoading : boolean = false;
  showMap : boolean = false;
  phone : boolean = false;
  selectedLocationCoords: { lat: number, lng: number };

  addressOptions: Observable<string[]> | undefined;
  addressSegmentations: any [] = ["Casa", "Trabalho", "Escritório"];
  showSearchLabel : boolean = false;
  
    constructor( 
                 private fb: FormBuilder,
                 private rendered : Renderer2,
                 private errorService : ErrorService,
                 private authService : AuthService,
                 private toastr: ToastrService,
                 private store : Store<AppState>
              ) 
{
      this.markers=[];

      (screen.width <= 800) ? this.phone = true : this.phone = false;
      this.dataSource = new MatTableDataSource();
      
      this.myForm = this.fb.group({
            search: [ '' ],
            city: [ '', [ Validators.required]],
            neighborhood: [ '', [ Validators.required]],
            streetName:[ '',[ Validators.required]],
            streetNumber:[ '',[ Validators.required]],
            province: [ '',[ Validators.required]],
            pairAddress: [ ''],
            description: [ ''],
            postal_code: [ '',[ Validators.required]],
            coords: [ ''],
            address:[ ''],
    });

    const user = getDataSS('user');
    if(user){
      this.loggedUser = user;
    }
  
 }



ngOnInit() {



  this.checkLStorage();

  this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));
  
  this.addressOptions = this.myForm.get('pairAddress')?.valueChanges.pipe(
    startWith(''),
    map(value => this.filterByAddress(value || '')),
  );
  
}

private filterByAddress(value: string): string[] {
  const filterValue = value.toLowerCase();
  return this.addressSegmentations.filter(option => option.toLowerCase().includes(filterValue));
}

searchText: string = '';
resaltarCoincidencias(value: string, searchText: string): string {
  if (!value || !searchText) return value; // Handle empty values
  const searchValue = searchText.toLowerCase();
  const regex = new RegExp(searchValue, 'gi');
  return value.replace(regex, (match) => `<strong>${match}</strong>`); // Wrap matches in bold
}

onAddressSelected(address:any, event: MatAutocompleteSelectedEvent) {

  console.log(address.segmentation);
  const selectedValue = event.option.value;
  const pair = this.addressSegmentationPairs.find(pair => pair.address === address.address);

  const existingPair = this.addressSegmentationPairs.find(item => item.segmentation === selectedValue);
  if (existingPair) {
    this.warningToast('Não é possível repetir uma segmentação')
  } else {
    if(pair){
      pair.segmentation = selectedValue;
    }
    // ya guarde en LS la direccion pero falta la segmentacion
    let addressCompleteIndex = this.addresses.findIndex(item => item.address === address.address);
    if (addressCompleteIndex !== -1) {
      const tempAddress = {
        ...this.addresses[addressCompleteIndex],
        segmentation: address.segmentation
      };

        // Crear una copia del array y reemplazar el elemento
      const updatedAddresses = [...this.addresses];
      updatedAddresses[addressCompleteIndex] = tempAddress;
      this.addresses = updatedAddresses; // Actualizar el array con la copia modificada
      saveDataLS('addresses', this.addresses);
      this.store.dispatch(authActions.addFormAddress({formAddress: this.addresses}));
    }
  }

}

onSaveForm(){
    
  if ( this.myForm.invalid ) {
    this.myForm.markAllAsTouched();
    return
  }

  if(!this.selectedLocationCoords){
    this.showErrorSwal('Erro na obtenção de coordenadas!', 'É necessário que o endereço seja obtido através do Google Maps', 'Se faltarem dados, eles podem ser preenchidos manualmente')
    return
  }

  let body = {
    ... this.myForm.value,
    address: `${this.myForm.get('streetName')?.value} ${this.myForm.get('streetNumber')?.value}`
  }

  // si se trata de una edicion, q elimine la entrada anterior por coordenada 
  if(this.isEditing){

    // recupero la Segmentation antes q se borre
    const addressToRemove = this.addressSegmentationPairs.find(item => item.coords.lat === body.coords.lat && item.coords.lng === body.coords.lng);

    this.addresses = this.addresses.filter(item => item.coords.lat !== body.coords.lat && item.coords.lng !== body.coords.lng);
    this.addressSegmentationPairs = this.addressSegmentationPairs.filter(item => item.coords.lat !== body.coords.lat && item.coords.lng !== body.coords.lng);

     this.addresses = [...this.addresses, body]
     const newAddress = {address: body.address, coords: body.coords,segmentation: addressToRemove?.segmentation}
     // const newAddress = {address: body.address, coords: body.coords, segmentation: '' }
     this.addressSegmentationPairs = [ ...this.addressSegmentationPairs, newAddress]; 
     this.myForm.reset();
     this.showMap = false;
     this.isEditing = false;
     this.goToTop();
  }else{
    // busco q no se repita la direccion
    const repetedAddress =  this.addresses.find( item => item.address === body.address);
    if(repetedAddress){
      this.warningToast('Você já tem esse endereço salvo');
      return;
    }

    body.coords = this.selectedLocationCoords;

    this.addresses = [...this.addresses, body]
    const newAddress = {address: body.address, coords: body.coords,segmentation: ''}
    this.addressSegmentationPairs = [ ...this.addressSegmentationPairs, newAddress]; 
    this.goToAddedAddress();
    this.myForm.reset();
  }
   this.showSearchLabel = false;

}

checkLStorage(){
  const addresses = getDataLS('addresses');
  if(addresses){
    this.addresses = addresses;
    this.store.dispatch(authActions.addFormAddress({formAddress:this.addresses}));
    this.addressSegmentationPairs = addresses.map((item:any) => ({
      address: item.address,
      segmentation: item.segmentation,
      coords: item.coords
  }));
  

  
  }
}

selectedIndex: number | null = null;

toggleCollapse(index: number) {
    if (this.selectedIndex === index) {
        this.selectedIndex = null; // Si ya está abierto, ciérralo
    } else {
        this.selectedIndex = index; // De lo contrario, ábrelo
    }
}

clearSearch(){
  this.searchText = '';
}

resetForm(){
  this.myForm.reset();
  this.isEditing = false;
  this.showMap = false;
}

onSearchChange(event: Event) {
  this.searchText = (event.target as HTMLInputElement).value;
}

removeAddress( option:any ){
  this.addresses = this.addresses.filter( item => item.address !== option.address);
  this.addressSegmentationPairs = this.addressSegmentationPairs.filter( item => item.address !== option.address);
  saveDataLS('addresses', this.addresses);
  this.store.dispatch(authActions.unSetFormAddress());
  this.store.dispatch(authActions.addFormAddress({formAddress:this.addresses}));
  if(this.addresses.length === 0){
    localStorage.removeItem('addresses');
  }
}

//obtengo la direccion actual y hago el dispatch de la direccion, si la selecciona como favorita se guarda en BD sino
addresByCoords(){

  this.isLoading = true;

  this.authService.getAddressByCoords(this.lat, this.lng).subscribe(
   (res) => { 
     if (res.status === 'OK') {
          console.log(res.results[0].formatted_address);

          setTimeout(()=>{ this.isLoading = false; this.showAddressSwal(res.results[0].formatted_address) },700)
          
         }
  })
}

ngAfterViewInit() {
  const opciones = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      this.lng = position.coords.longitude;
      this.lat = position.coords.latitude;
      this.cargarMapa(position);
      this.cargarAutocomplete();
    }, null, opciones);
  } else {
    console.log('navegador no compatible');
  }
 }

private cargarAutocomplete(){

  const autocomplete = new google.maps.places.Autocomplete(this.inputPlaces.nativeElement, {
    // types: ['locality'],
    // fields: ['address_components', 'geometry'],
    types: ['geocode'], // Cambiado a 'geocode' para obtener direcciones completas
    fields: ['address_components', 'geometry', 'name'],
  });

  autocomplete.addListener('place_changed', () => {
    const place: any = autocomplete.getPlace();
    this.showForm = place.geometry !== undefined;

      // Guardar las coordenadas de latitud y longitud en selectedLocationCoords
      this.selectedLocationCoords = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };


    if (this.showForm) {
      this.mapa.setCenter(place.geometry.location);
      const marker = new google.maps.Marker({
        position: place.geometry.location,
        map: this.mapa,
        title: 'Selected Location',
      });

      this.markers.push(marker);
      console.log(place);
      this.llenarFormulario(place);
    }
  });
  

    this.goToForm();


}

llenarFormulario(place:any){

  const getAddressComp = (type: any, index:any) => {
    const component = place.address_components.find(
      (comp: any) => comp.types[0] === type
    );

    return component && component.long_name ? component.long_name : '';
  };

  const city = getAddressComp('locality',0);
  const state = getAddressComp('administrative_area_level_1',0);
  const neighborhood = getAddressComp('sublocality_level_1',0);
  const province = getAddressComp('administrative_area_level_1', 2);
  const streetNumber = getAddressComp('street_number',0);
  const streetName = getAddressComp('route',0);
  const postal_code = getAddressComp('postal_code', 0)
  const address = `${streetName} ${streetNumber}`;

  const componentForm ={
                          city,
                          province,
                          streetName,
                          neighborhood,
                          postal_code,
                          streetNumber
                          // state,
                        };


  Object.entries(componentForm).forEach( entry =>{
    const [key, value]= entry;
    this.myForm.controls[key].setValue(value);
  });

  console.log(this.myForm.value);

}

cargarMapa( position:any){


  const opciones={
    center : new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
    zoom: 17,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  this.mapa= new google.maps.Map(this.rendered.selectRootElement(this.divMap.nativeElement),opciones)


   const markerPosition= new google.maps.Marker({
    position: this.mapa.getCenter(),
    title: ''
   });

   markerPosition.setMap(this.mapa);
   this.markers.push(markerPosition);


}

setPinOnMap( address:any){

  this.goToForm();
  // this.showForm = true;
  
  const location = new google.maps.LatLng( address.coords.lat, address.coords.lng );
  
  const marker = new google.maps.Marker({
    position: location,
    map: this.mapa,
    title: 'Localização selecionada'
  });
  
  this.mapa.setCenter(location);
  
  // const selectedAdress = this.addresses.find( item => item.address === address.address )

  console.log(this.addresses);
  console.log(address);
  const selectedAdress= this.addresses.find(item => item.coords.lat === address.coords.lat && item.coords.lng === address.coords.lng);
  // this.addressSegmentationPairs = this.addressSegmentationPairs.filter(item => item.coords.lat !== body.coords.lat && item.coords.lng !== body.coords.lng);
  console.log(selectedAdress);

  this.myForm.patchValue({
      city: selectedAdress.city,
      streetName: selectedAdress.streetName,
      streetNumber: selectedAdress.streetNumber,
      province: selectedAdress.province,
      neighborhood: selectedAdress.neighborhood,
      postal_code: selectedAdress.postal_code,
      description: selectedAdress.description,
      coords: selectedAdress.coords,
  })

  this.selectedLocationCoords = selectedAdress.coords;

  this.isEditing = true;

}

showAddressSwal( msg : string) {
  
  Swal.fire({
    icon: 'question',
    title: "Este é o seu endereço?",
    text: msg,
    footer: "",
    allowOutsideClick: false,  
    allowEscapeKey: false,
  }).then((result) => {
    if (result.isConfirmed ) {
      // this.router.navigateByUrl('/login')
    }
  });
}

goToAddedAddress(){

  setTimeout( () => {

    this.addedAdress.nativeElement.scrollIntoView(
    { 
      alignToTop: true,
      block: "center",
    });
   }
  )
}

goToTop(){

  setTimeout( () => {

    this.top.nativeElement.scrollIntoView(
    { 
      alignToTop: true,
      block: "center",
    });
   }
  )
}
goToForm(){

  setTimeout( () => {

    this.form.nativeElement.scrollIntoView(
    { 
      alignToTop: true,
      block: "center",
    });
   }
  )
}

remainingCharacters: number = 100;
limitCharacters(event: any) {
  const maxLength = 100;
  const textarea = event.target as HTMLTextAreaElement;
  const currentLength = textarea.value.length;
  const remaining = maxLength - currentLength;
  if (remaining >= 0) {
    this.remainingCharacters = remaining;
  } else {
    textarea.value = textarea.value.substring(0, maxLength);
  }
}

warningToast( msg:string){
  this.toastr.warning(msg, 'Verificar!!', {
    positionClass: 'toast-bottom-right', 
    timeOut: 3500, 
    messageClass: 'message-toast',
    titleClass: 'title-toast'
  });
}

validField( field: string ) {
  const control = this.myForm.controls[field];
  return control && control.errors && control.touched;
}

showErrorSwal( title : string, msg : string, footer : string) {
  Swal.fire({
    icon: 'error',
    title: title,
    text: msg,
    footer: footer,
    allowOutsideClick: false,  
    allowEscapeKey: false,
  }).then((result) => {
    if (result.isConfirmed) {
    }
  });
}

get f(){
  return this.myForm.controls;
}


ngOnDestroy(): void {
  if(this.subscription){
    this.subscription.unsubscribe();
  }
}

                  
}
                
      





