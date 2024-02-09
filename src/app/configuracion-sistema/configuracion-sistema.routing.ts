import { Routes } from '@angular/router';



import { UsuariosComponent } from './usuarios/usuarios.component';
import { RolesComponent } from './roles/roles.component';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { AccionesxSeccionUsuarioComponent } from './acciones-x-seccion-usuario/acciones-x-seccion-usuario.component';
import { EmpresaComponent } from './empresa/empresa.component';

export const ConfiguracionSistemaRoutes: Routes = [
  {
    canActivate: [AuthGuard,RoleGuard],
    path: '',
    children: [
      
      {
        path: 'empresa',
        component: EmpresaComponent,
        data: {
          expectedRole: 1,
          title: 'Empresa',
          urls: [
            { title: 'Configuracion de sistema', url: '/empresa' },
            { title: 'Empresa' },
          ],
        },
      },    
      {
        
        path: 'usuarios',
        component: UsuariosComponent,
        data: {
          expectedRole:1,
          title: 'Usuarios',
          urls: [
            { title: 'Configuracion de sistema', url: '/dashboard' },
            { title: 'Usuarios' },
          ],
        },
      }, 
      {
        
        path: 'usuarios/:id',
        component: UsuariosComponent,
        data: {
          expectedRole:1,
          title: 'Usuarios',
          urls: [
            { title: 'Configuracion de sistema', url: '/dashboard' },
            { title: 'Usuarios' },
          ],
        },
      },
      {
        path: 'roles',
        component: RolesComponent,
        data: {
          expectedRole: 1,
          title: 'Roles',
          urls: [
            { title: 'Configuracion de sistema', url: '/roles' },
            { title: 'Roles' },
          ],
        },
      },
      {
        path: 'acciones-x-seccion-usuario',
        component: AccionesxSeccionUsuarioComponent,
        data: {
          expectedRole: 1,
          title: 'Acc. x Usu y seccion',
          urls: [
            { title: 'Configuracion de sistema', url: '/acciones-x-seccion-usuario' },
            { title: 'Acc. x Usu y seccion' },
          ],
        },
      }      

    ],
  },
];
