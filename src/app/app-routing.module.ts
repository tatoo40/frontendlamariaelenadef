import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { AuthGuard } from './guards/auth.guard';

export const Approutes: Routes = [
  {
    path: '',
    data:{expectedRole:2 },
    component: FullComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/authentication/login', pathMatch: 'full' },
      { path: '', redirectTo: '/authentication/register', pathMatch: 'full' },
      { path: '', redirectTo: '/authentication/seleccionempresa', pathMatch: 'full' },
      {
        path: 'dashboard',data: { expectedRole: 2 } ,
        loadChildren: () => import('./dashboards/dashboard.module').then(m => m.DashboardModule)
      },

      { path: 'configuracion-sistema', loadChildren: () => import('./configuracion-sistema/configuracion-sistema.module').then(m => m.ConfiguracionSistemaModule),data: { expectedRole: 1 }  },
      { path: 'operaciones', loadChildren: () => import('./operaciones/operaciones.module').then(m => m.OperacionesModule),data: { expectedRole: 2 }  },
      { path: 'mantenimientos', loadChildren: () => import('./mantenimiento/mantenimiento.module').then(m => m.MantenimientoModule),data: { expectedRole: 2 }  },
      { path: 'administracion', loadChildren: () => import('./administracion/administracion.module').then(m => m.AdministracionModule) },
      { path: 'reportes', loadChildren: () => import('./reportes/reportes.module').then(m => m.ReportesModule) },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./authentication/authentication.module').then(
            (m) => m.AuthenticationModule
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/authentication/404',
  },

];
