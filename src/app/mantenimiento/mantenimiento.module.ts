import { NgModule } from '@angular/core';
import { MantenimientosRoutes } from './mantenimiento.routing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Service

import { TimeAgoPipe } from '../apps/ticketlist/date-ago.pipe';

import { TipoCambioDiarioRxjsServiceService } from './tipo-cambio-diario/tipo-cambio-diario-rxjs-service.service';
import { RouterModule } from '@angular/router';

import { DatePipe, DecimalPipe } from '@angular/common';

// angular
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { DdMmYYYYDatePipe } from '../dd-mm-yyyy-date.pipe';
import { ObtengoDatosGeneralesService } from '../services/obtengo-datos-generales.service';


@NgModule({
  
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(MantenimientosRoutes),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    FlatpickrModule.forRoot(), 
  ],

  providers: [

    TipoCambioDiarioRxjsServiceService,
    DatePipe,
    DecimalPipe,
    DdMmYYYYDatePipe,
    ObtengoDatosGeneralesService,
    
 
  ],
})
export class MantenimientoModule {}
