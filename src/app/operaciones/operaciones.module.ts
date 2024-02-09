import { NgModule } from '@angular/core';
import { OperacionesRoutes } from './operaciones.routing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Service


import { RouterModule } from '@angular/router';

import { DatePipe, DecimalPipe } from '@angular/common';

// angular
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { DdMmYYYYDatePipe } from '../dd-mm-yyyy-date.pipe';
import { ObtengoDatosGeneralesService } from '../services/obtengo-datos-generales.service';
import { CsvService } from '../services/csv.service';
import { FormDataService } from '../component/accion-masiva-form/data/formData.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    RouterModule.forChild(OperacionesRoutes),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    FlatpickrModule.forRoot(),
    
  ],

  providers: [

  
    DatePipe,
    DecimalPipe,
    DatePipe,
    DecimalPipe,
    DdMmYYYYDatePipe,
    ObtengoDatosGeneralesService,CsvService,FormDataService
    
 
  ],
})
export class OperacionesModule {}
