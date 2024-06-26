import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { PdfViewerModule } from 'ng2-pdf-viewer';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

// perfect scrollbar
import { NgScrollbarModule } from 'ngx-scrollbar';

//Import all material modules
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Import Layouts
import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';

import { FilterPipe } from './pipe/filter.pipe';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ToastrModule } from 'ngx-toastr';

// redux
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appReducers } from './shared/redux/app.reducer';

import { environment } from 'src/environments/environment';
import { InterceptorService } from './services/interceptor.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AssignDioceseDrawerComponent } from './pages/drawers/assign-diocese-drawer/assign-diocese-drawer/assign-diocese-drawer.component';

export function HttpLoaderFactory(http: HttpClient): any {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, BlankComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TablerIconsModule.pick(TablerIcons),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgScrollbarModule,
    FullComponent,
    ToastrModule.forRoot(),
    PdfViewerModule,
    StoreModule.forRoot(appReducers),
    environment.imports,
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    NgbModule,


  ],
  providers:[
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
  
    },
  ],
  exports: [TablerIconsModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
