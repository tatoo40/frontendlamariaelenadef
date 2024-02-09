import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, registerLocaleData } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import localeEs from "@angular/common/locales/es";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { ToastrModule } from 'ngx-toastr';

import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerComponent } from './shared/spinner.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { AuthGuard } from './guards/auth.guard';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { DdMmYYYYDateSoloPipe } from './dd-mm-yyyy-date-solo.pipe';
import { DdMmYYYYDateSoloHoraCeroPipe } from './dd-mm-yyyy-date-solo-hora-cero.pipe';
import { ObtengoDatosGeneralesService } from './services/obtengo-datos-generales.service';
import { DdMmYYYYDateSoloPipeFormatoVisulizacion } from './dd-mm-yyyy-date-solo-formato-visualizacion.pipe';
import { RoleGuard } from './guards/role.guard';
import { StockService } from './services/stock.service';
import { PorcentajeSinDecimalesPipe } from './porcentajeSinDecimales.pipe';
import { DdMmYyyyConBarras } from './dd-mm-yyyy-barra-date.pipe';
import { ImporteUsdListado } from './importe-usd-listado';


registerLocaleData(localeEs);

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, SpinnerComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    FeatherModule,
    FeatherModule.pick(allIcons),
    RouterModule.forRoot(Approutes),
    ToastrModule.forRoot(),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    

  ],
  providers: [
    
    AuthGuard,RoleGuard,
    { provide: LOCALE_ID, useValue: 'es-PE' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService,multi:true } ,
    { provide: DdMmYYYYDateSoloPipe },
    { provide: DdMmYyyyConBarras },
    { provide: ImporteUsdListado },
    { provide: DdMmYYYYDateSoloHoraCeroPipe},
    { provide: ObtengoDatosGeneralesService},
    { provide: DdMmYYYYDateSoloPipeFormatoVisulizacion},
    { provide: PorcentajeSinDecimalesPipe},
    { provide: StockService}

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
