import { Routes } from '@angular/router';


import { ListadoFacturasProvComponent } from './factura-proveedor/lista-factura-proveedor/lista-factura-proveedor.component';
import { AgregarFacturasProvComponent } from './factura-proveedor/agregar-factura-proveedor/agregar-factura-proveedor.component';
import { VerFacturaProvComponent } from './factura-proveedor/ver-factura-proveedor/ver-factura-proveedor.component';
import { EditarFacturasProvComponent } from './factura-proveedor/editar-factura-proveedor/editar-factura-proveedor.component';
import { ListadoIngresosRomaneoComponent } from './ingreso-romaneo/lista-factura-proveedor/lista-ingreso-romaneo.component';
import { verIngresoRomaneoComponent } from './ingreso-romaneo/ver-ingreso-romaneo/ver-ingreso-romaneo.component';
import { AgregarIngresoRomaneoComponent } from './ingreso-romaneo/agregar-ingreso-romaneo/agregar-ingreso-romaneo.component';
import { PagoProveedorComponent } from './pago-proveedor/pago-proveedor.component';
//import { AjustesStockComponent } from './ajustes-stock/ajustes-stock.component';
import { RegistrosConsumosComponent } from './resgistros-consumos/resgistros-consumos.component';
import { RegistrosGastosComponent } from './registros-gastos/registros-gastos.component';



                 
export const AppsRoutes: Routes = [
  {
    path: '',
    children: [
  
      {
        path: 'facturaProveedor',
        component: ListadoFacturasProvComponent,
        data: {
          title: 'Factura proveedor',
          urls: [],
        },
      },
      {
        path: 'agregarFacturaProveedor',
        component: AgregarFacturasProvComponent,
        data: {
          title: 'Agregar factura',
          urls: [],
        },
      },
      {
        path: 'verFacturaProveedor/:id',
        component: VerFacturaProvComponent,
        data: {
          title: 'Ver Factura proveedor',
          urls: [],
        },
      },
      {
        path: 'editarFacturaProveedor/:id',
        component: EditarFacturasProvComponent,
        data: {
          title: '',
          urls: [],
        },
      },
      {
        path: 'ingreso-romaneo',
        component: ListadoIngresosRomaneoComponent,
        data: {
          title: 'Ingreso romaneo',
          urls: [],
        },
      },  
      {
        path: 'verIngresoRomaneo/:id',
        component: verIngresoRomaneoComponent,
        data: {
          title: 'Ver ingreso de romaneo',
          urls: [],
        },
      },      
      {
        path: 'agregarRomaneo',
        component: AgregarIngresoRomaneoComponent,
        data: {
          title: 'Agregar ingreso romaneo',
          urls: [],
        },
      },      
      {
        path: 'pago-proveedor',
        component: PagoProveedorComponent,
        data: {
          title: 'Pago proveedor',
          urls: [
            { title: 'Administracion', url: '/dashboard' },
            { title: 'Pago proveedor' },
          ],
        },
      }       
      ,      
      {
        path: 'registros-consumos',
        component: RegistrosConsumosComponent,
        data: {
          title: 'Registro de consumos',
          urls: [
            { title: 'Administracion', url: '/dashboard' },
            { title: 'Registro de consumos' },
          ],
        },
      }       
      ,      
      {
        path: 'registros-gastos',
        component: RegistrosGastosComponent,
        data: {
          title: 'Registro de gastos',
          urls: [
            { title: 'Administracion', url: '/dashboard' },
            { title: 'Registro de gastos' },
          ],
        },
      }       
      ,      
      {
        path: 'ajustes-stock',
        component: RegistrosGastosComponent,
        data: {
          title: 'Ajustes de stock',
          urls: [
            { title: 'Administracion', url: '/dashboard' },
            { title: 'Ajuste de stock' },
          ],
        },
      }                         
    ],
  },
];
