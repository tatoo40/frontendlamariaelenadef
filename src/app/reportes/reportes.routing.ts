import { Routes } from '@angular/router';


import { InventarioStkComponent } from './inventario-stk/inventario-stk.component';
import { ComprasGanadoComponent } from './compras-ganado/compras-ganado.component';
import { ComprasInsumoComponent } from './compras-insumos/compras-insumo.component';

export const ReportesRoutes: Routes = [
  {
    path: '',
    children: [
      
      {
        path: 'inventario-stock',
        component: InventarioStkComponent,
        data: {
          title: 'Inventario de stock',
          urls: [
            { title: 'Reportes', url: '/dashboard' },
            { title: 'Inventario de stock' },
          ],
        },
        
      },      
      {
        path: 'compras-ganado',
        component: ComprasGanadoComponent,
        data: {
          title: 'Compras de ganado',
          urls: [
            { title: 'Reportes', url: '/dashboard' },
            { title: 'Compras de ganado' },
          ],
        },
        
      }
      ,      
      {
        path: 'compras-insumos-servicios',
        component: ComprasInsumoComponent,
        data: {
          title: 'Compras de insumo',
          urls: [
            { title: 'Reportes', url: '/dashboard' },
            { title: 'Compras de insumos' },
          ],
        },
        
      }
      

    ],
    
  },
];
