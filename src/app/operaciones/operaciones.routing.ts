import { Routes } from '@angular/router';




import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { PasturasXPotreroComponent } from './pasturas_x_potrero/pasturas_x_potrero.component';
import { RegistroLluviasComponent } from './registroLluvias/registroLluvias.component';
import { RelacionSnigComponent } from './relacion-snig/relacion-snig.component';
import { CambioCategoriaComponent } from './cambio-categoria/cambio-categoria.component';
import { RecaravaneoComponent } from './recaravaneo/recaravaneo.component';
import { ModificoGanadoComponent } from './modifico-ganado/modifico-ganado.component';
import {  GanadoComponent } from './ganado/ganado.component';
import { MiGanadoComponent } from './miganado/miganado.component';


export const OperacionesRoutes: Routes = [
  {
    canActivate: [AuthGuard,RoleGuard],
    path: '',
    children: [
      
      {
        path: 'pasturas_x_potrero',
        component: PasturasXPotreroComponent,
        data: {
          expectedRole: 1,
          title: 'Pasturas por potrero',
          urls: [
            { title: 'Operaciones', url: '/pasturas_x_potrero' },
            { title: 'Pasturas por potrero' },
          ],
        },
      },
      
      {
        path: 'registro-lluvias',
        component:RegistroLluviasComponent,
        data: {
          expectedRole: 1,
          title: 'Registro lluvias',
          urls: [
            { title: 'Operaciones', url: '/registro-lluvias' },
            { title: 'Registro lluvias' },
          ],
        },
      },
      {
        path: 'relacion-snig',
        component:RelacionSnigComponent,
        data: {
          expectedRole: 1,
          title: 'Relacion snig',
          urls: [
            { title: 'Operaciones', url: '/relacion-snig' },
            { title: 'Relacion snig' },
          ],
        },
      }
      ,
      {
        path: 'miganado',
        component:MiGanadoComponent,
        data: {
          expectedRole: 1,
          title: 'Mi ganado disponible',
          urls: [
            { title: 'Operaciones', url: '/miganado' },
            { title: 'Mi ganado disponible' },
          ],
        },
      } 
      ,
      {
        path: 'ganado',
        component:GanadoComponent,
        data: {
          expectedRole: 1,
          title: 'Accion ind. ganado',
          urls: [
            { title: 'Operaciones', url: '/ganado' },
            { title: 'Accion ind. ganado' },
          ],
        },
      } 
      ,
      {
        path: 'modifico-ganado',
        component:ModificoGanadoComponent,
        data: {
          expectedRole: 1,
          title: 'Modifico ganado',
          urls: [
            { title: 'Operaciones', url: '/modifico-ganado' },
            { title: 'Modifico ganado' },
          ],
        },
      }
      ,
      {
        path: 'recaravaneo',
        component:RecaravaneoComponent,
        data: {
          expectedRole: 1,
          title: 'Recaravaneo',
          urls: [
            { title: 'Operaciones', url: '/recaravaneo' },
            { title: 'Recaravaneo' },
          ],
        },
      }      
    ],
  },
];
