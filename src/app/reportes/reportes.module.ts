import { NgModule } from '@angular/core';
import { ReportesRoutes } from './reportes.routing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Service

import { TimeAgoPipe } from '../apps/ticketlist/date-ago.pipe';

import { RouterModule } from '@angular/router';

import { DatePipe, DecimalPipe } from '@angular/common';

// angular
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { DdMmYYYYDatePipe } from '../dd-mm-yyyy-date.pipe';
import { ObtengoDatosGeneralesService } from '../services/obtengo-datos-generales.service';
import { ImporteUsdListado } from '../importe-usd-listado';
import { DdMmYyyyConBarras } from '../dd-mm-yyyy-barra-date.pipe';


@NgModule({
  
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(ReportesRoutes),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    FlatpickrModule.forRoot(), 
  ],

  providers: [


    DatePipe,
    DecimalPipe,
    DdMmYYYYDatePipe,
    ImporteUsdListado,
    DdMmYyyyConBarras,
    ObtengoDatosGeneralesService,
    
 
  ],
})
export class ReportesModule {}
