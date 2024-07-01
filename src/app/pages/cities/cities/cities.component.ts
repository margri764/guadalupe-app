import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription, delay, take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { EditCityModalComponent } from '../../modals/edit-city-modal/edit-city-modal/edit-city-modal.component';
import { DeleteModalComponent } from '../../modals/delete-modal/delete-modal/delete-modal.component';
import axios from 'axios';
import Swal from 'sweetalert2';
import { getDataSS } from 'src/app/shared/storage';
import { Router } from '@angular/router';
import { ErrorService } from 'src/app/services/error.service';
import { DiocesisCidadeService } from 'src/app/services/diocesis-cidade.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';


interface City {
  name : string,
  province : string,
  country: string
}
declare var google: any;

@Component({
  selector: 'app-cities',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, GoogleMapsModule],
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.scss'
})
export class CitiesComponent {

  @ViewChild('divMap') divMap!: ElementRef;
  @ViewChild('inputPlaces') inputPlaces!: ElementRef;
  mapa!: google.maps.Map;
  markers: any[] = [];
  lat!: number;
  lng!: number;

  myForm!: FormGroup;
  bannerStatus: boolean =false;
  showForm:boolean = false;
  selected:boolean = false;
  placeToSendForm:any;
 
  confirm : boolean = false;
  address : string = '';
  userLogin = null;
  user! : any;
  subscription! : Subscription;
  showLabelAddressError : boolean = false;

  displayedColumns: string[] = ['img','name', 'province','country', 'action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  cities : any[]=[];
  city : City | null;
  subscription$ : Subscription;
  flag : string = '';
  loggedUser:any;
  isLoading : boolean = false;
  phone : boolean = false;

  
    constructor( private fb: FormBuilder,
                 private rendered : Renderer2,
                 private errorService : ErrorService,
                 private diocesisCityService : DiocesisCidadeService,
                 private toastr: ToastrService,
                 private router : Router,
                 private dialog : MatDialog
) 
{
    this.markers=[];
    
    this.myForm = this.fb.group({
      search:   [ '' ],
      name:     [ '', [ Validators.required]],
      province:  [ '' ],
      country:  [ '',[ Validators.required]],
    });

    const user = getDataSS('user');
    if(user){
      this.loggedUser = user;
    }

    if (this.loggedUser.role === 'webmaster') {
      const position = this.displayedColumns.length - 1;
      this.displayedColumns.splice(position, 0, 'propulsao');
    }

    (screen.width < 800) ? this.phone = true : this.phone = false;

    this.dataSource = new MatTableDataSource();
  
 }




// bien el codigo de abajo ver bien xq tambien ouede querer guardar una nueva direccion favorita y ver si hay q disparar action "address"
  ngOnInit() {
    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));
    this.getInitialCities();
  }

  get f(){
    return this.myForm.controls;
  }

  getInitialCities(){

    this.isLoading = true;
    this.diocesisCityService.getAllCities().subscribe(
      ( {success, cities} )=>{
        if(success){
          this.cities = cities;
          if(cities && cities.length > 0){
            this.dataSource.data = cities;
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'name': return item.name;
                case 'province': return item.province;
                case 'country': return item.country;
                case 'propulsao': return item.propulsao_name;
                default: return '';
              }
            };
          }
    
        setTimeout(()=>{ this.isLoading = false }, 700)
        }

      })

  }

  postCity(){
    
    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return;
    }
  
    const body = {...this.myForm.value, flag: this.flag }
    this.isLoading = true;
    console.log(body);

    this.diocesisCityService.postCity(body).subscribe(
      ( {success} )=>{
        if(success){
          setTimeout(()=>{ this.isLoading = false }, 700);
          this.getInitialCities();
          this.successToast('Cidade adicionada com sucesso'); 
          this.myForm.reset();
          this.city = null;
        }
      }
    )
  }

  editCity(city:any){
    const dialogRef = this.dialog.open(EditCityModalComponent,{
      maxWidth: (this.phone) ? "97vw": '800px',
      maxHeight: (this.phone) ? "90vh": '90vh',
      data: {city}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if(result === 'edit-city'){
          this.getInitialCities() 
        }
      } 
    });
  }

  onRemove( city:any ){

    this.openDeleteModal('delCity');

    this.subscription$ =this.diocesisCityService.authDelCity$.pipe(take(1)).subscribe(
      (auth)=>{
        if(auth){
          this.isLoading = true;

              if(city.propulsao_name && city.propulsao_name[0] !== null && city.propulsao_name.length > 0){
                this.showWarningSwal(city.propulsao_name);
                this.isLoading = false;
              }else{
      
                this.diocesisCityService.deleteCityById( city.idcity ).subscribe(
                ( {success} )=>{
      
                  setTimeout(()=>{ this.isLoading = false }, 1200);
          
                  if(success){
                    this.getInitialCities();
                    this.successToast("Cidade eliminada com sucesso.");
                  }
                })
              }
              
        }else{
          this.subscription$.unsubscribe();
        }
      })
  }

  async getCountryInfo(countryCode: string): Promise<any> {
    try {
      const response = await axios.get(`https://restcountries.com/v3.1/alpha/${countryCode}`);
      return response.data[0];
    } catch (error) {
      console.error('Error al obtener la información del país:', error);
      throw error;
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

  warningToast( msg:string){
    this.toastr.warning(msg, 'Verificar!!', {
      positionClass: 'toast-bottom-right', 
      timeOut: 3500, 
      messageClass: 'message-toast',
      titleClass: 'title-toast'
    });
  }

  showWarningSwal( propulsaosName:any) {

    Swal.fire({
      title: "Si precisar excluir, faça-o através das propulsões associadas.!",
      text: `Esta cidade está atribuída às seguintes propulsões: "${propulsaosName.join('", "')}", ` ,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Login como administrador"
    }).then((result)=>{
      if(result.isConfirmed){
        this.router.navigateByUrl('/dashboard/administradores')
      }
    })
  }

  openDeleteModal( action:string ){

    this.dialog.open(DeleteModalComponent,{
      maxWidth: (this.phone) ? "98vw": '',
      panelClass: "custom-modal-picture",    
      data: { component: "city", action }
      });
  }

  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    const savedPageSize =  localStorage.getItem('cityPageSize');
    if (savedPageSize) {
      this.paginator.pageSize = +savedPageSize;
    }
    this.paginator.page.subscribe((event) => {
      localStorage.setItem('cityPageSize', event.pageSize.toString());
    });

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

  private cargarAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(this.inputPlaces.nativeElement, {
      // types: ['locality'],
      // fields: ['address_components', 'geometry'],
      types: ['geocode'], // Cambiado a 'geocode' para obtener direcciones completas
      fields: ['address_components', 'geometry', 'name'],
    });

    autocomplete.addListener('place_changed', () => {
      const place: any = autocomplete.getPlace();
      this.showForm = place.geometry !== undefined;

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
  }

  private cargarMapa(position: any) {
    const opciones = {
      center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.mapa = new google.maps.Map(this.divMap.nativeElement, opciones);

    const markerPosition = new google.maps.Marker({
      position: this.mapa.getCenter(),
      map: this.mapa,
      title: 'Current Location',
    });

    this.markers.push(markerPosition);
  }

  llenarFormulario(place:any){


    const getAddresComp = (type: any, index: number) => {
      const component = place.address_components.find(
        (comp: any) => comp.types[0] === type
      );
    
      return component && component.long_name ? component.long_name : '';
    };
    
    const name = getAddresComp('locality', 0);
    const province = getAddresComp('administrative_area_level_1', 2);
    const country = getAddresComp('country', 3);


    const componentForm ={
      name,
      province ,
      country
    };


    Object.entries(componentForm).forEach( entry =>{
      const [key, value]= entry;
      this.myForm.controls[key].setValue(value);
    });

    console.log(this.myForm.value);


    // Obtén la información del país directamente desde Google Maps
    const countryInfo = place.address_components.find((component: any) =>
      component.types.includes('country')
    );


    const flagURL = countryInfo?.short_name
    ? `https://restcountries.com/v3.1/alpha/${countryInfo.short_name}`
      : null;

    if (flagURL) {
      fetch(flagURL)
        .then((response) => response.json())
        .then((data) => {
          const flag = data[0]?.flags?.png || null;
            this.flag = flag;
            this.city = { ...this.myForm.value, flag };
        })
        .catch((error) => {
          console.error('Error al obtener la información de la bandera:', error);
        });
    } else {
      this.city = { ...this.myForm.value };
      console.error('No se pudo obtener la URL de la bandera.');
    }


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  validField( field: string ) {
    const control = this.myForm.controls[field];
    return control && control.errors && control.touched;
  }

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
                  
}
                
      




