import { NgModule } from '@angular/core';
import { ConfiguracionSistemaRoutes } from './configuracion-sistema.routing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Service

import { TimeAgoPipe } from '../apps/ticketlist/date-ago.pipe';

import { UsuariosRxjsServiceService } from './usuarios/usuarios-rxjs-service.service';
import { RouterModule } from '@angular/router';

import { DatePipe, DecimalPipe } from '@angular/common';

// angular
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { DdMmYYYYDatePipe } from '../dd-mm-yyyy-date.pipe';
import { ObtengoDatosGeneralesService } from '../services/obtengo-datos-generales.service';

@NgModule({
  //declarations: [TimeAgoPipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(ConfiguracionSistemaRoutes),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    FlatpickrModule.forRoot(), 
  ],

  providers: [

  
    DatePipe,
    DecimalPipe,
    UsuariosRxjsServiceService,
    DatePipe,
    DecimalPipe,
    DdMmYYYYDatePipe,
    ObtengoDatosGeneralesService,
    
 
  ],
})
export class ConfiguracionSistemaModule {}
