import { NgModule } from '@angular/core';
import { AppsRoutes } from './administracion.routing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Service
import { FacturaProvService } from './factura-proveedor/factura-proveedor.service';
import { RouterModule } from '@angular/router';

import { DatePipe, DecimalPipe } from '@angular/common';

// angular
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { InvoiceService } from '../apps/invoice/invoice.service';
import { IngresoRomaneoService } from './ingreso-romaneo/ingreso-romaneo.service';
import { PagoProveedorService } from './pago-proveedor/pago-proveedor.service';
import { DdMmYYYYDatePipe } from '../dd-mm-yyyy-date.pipe';

@NgModule({
  //declarations: [TimeAgoPipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(AppsRoutes),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    FlatpickrModule.forRoot(), 
  ],

  providers: [

    DatePipe,
    DecimalPipe,
    FacturaProvService,
    InvoiceService,
    IngresoRomaneoService,
    PagoProveedorService,
    DdMmYYYYDatePipe
  ],
})
export class AdministracionModule {}
