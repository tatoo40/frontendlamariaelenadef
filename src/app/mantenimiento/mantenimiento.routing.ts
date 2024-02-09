import { Routes } from '@angular/router';



import { TipoCambioDiarioComponent } from './tipo-cambio-diario/tipo-cambio-diario.component';
import { TitularesComponent } from './titulares/titulares.component';
import { ArticulosComponent } from './articulos/articulos.component';
import { CategoriasGanadoComponent } from './categorias-ganado/categorias-ganado.component';
import { RazasGanadoComponent } from './razas-ganado/razas-ganado.component';
import { DepositosComponent } from './depositos/depositos.component';
import { EmpresaComponent } from '../configuracion-sistema/empresa/empresa.component';
import { SanitariosComponent } from './sanitarios/sanitarios.component';
import { DicosesComponent } from './dicoses/dicoses.component';
import { SectoresComponent } from './sectores/sectores.component';
import { PasturasComponent } from './pasturas/pasturas.component';
import { ArticulosTitularComponent } from './articulos-titular/articulos-titular.component';
import { ArticuloEvolucionaComponent } from './articulo-evolucion/articulo-evolucion.component';

export const MantenimientosRoutes: Routes = [
  {
    path: '',
    children: [
      
      {
        path: 'tipo-cambio-diario',
        component: TipoCambioDiarioComponent,
        data: {
          title: 'Tipo de cambio diario',
          urls: [
            { title: 'Mantenimiento', url: '/dashboard' },
            { title: 'Tipo de cambio diario' },
          ],
        },
      },



      {
        path: 'titulares',
        component: TitularesComponent,
        data: {
          title: 'Titulares',
          urls: [
            { title: 'Mantenimiento', url: '/dashboard' },
            { title: 'Titulares' },
          ],
        },
      },
      {
        path: 'categorias-ganado',
        component: CategoriasGanadoComponent,
        data: {
          title: 'Categorias ganado',
          urls: [
            { title: 'Mantenimiento', url: '/dashboard' },
            { title: 'Categorias ganado' },
          ],
        },
      },
      {
        path: 'razas-ganado',
        component: RazasGanadoComponent,
        data: {
          title: 'Razas ganado',
          urls: [
            { title: 'Mantenimiento', url: '/dashboard' },
            { title: 'Razas ganado' },
          ],
        },
      },
      
      {
        path: 'articulos',
        component: ArticulosComponent,
        data: {
          title: 'Articulos',
          urls: [
            { title: 'Mantenimiento', url: '/dashboard' },
            { title: 'Articulos' },
          ],
        },
      },     
      
      
      {
        path: 'depositos',
        component: DepositosComponent,
        data: {
          title: 'Depositos',
          urls: [
            { title: 'Mantenimiento', url: '/dashboard' },
            { title: 'Depositos' },
          ],
        },
      },
    
      {
        path: 'motivos-sanitarios',
        component: SanitariosComponent,
        data: {
          title: 'Motivos sanitarios',
          urls: [
            { title: 'Mantenimiento', url: '/dashboard' },
            { title: 'Motivos sanitarios' },
          ],
        },
      },
    
      {
        path: 'dicoses',
        component: DicosesComponent,
        data: {
          title: 'Dicoses',
          urls: [
            { title: 'Mantenimiento', url: '/dashboard' },
            { title: 'Dicoses' },
          ],
        },
      }
      ,
    
      {
        path: 'sectores',
        component: SectoresComponent,
        data: {
          title: 'Sectores',
          urls: [
            { title: 'Mantenimiento', url: '/dashboard' },
            { title: 'Sectores' },
          ],
        },
      }      
      ,
    
      {
        path: 'pasturas',
        component: PasturasComponent,
        data: {
          title: 'Pasturas',
          urls: [
            { title: 'Mantenimiento', url: '/dashboard' },
            { title: 'Pasturas' },
          ],
        },
      }   
      ,
    
      {
        path: 'articulos-titular',
        component: ArticulosTitularComponent,
        data: {
          title: 'Articulos por titular',
          urls: [
            { title: 'Mantenimiento', url: '/dashboard' },
            { title: 'Articulos por titular' },
          ],
        },
      }       
      ,
    
      {
        path: 'articulo-evoluciona',
        component: ArticuloEvolucionaComponent,
        data: {
          title: 'Articulo evoluciona',
          urls: [
            { title: 'Mantenimiento', url: '/dashboard' },
            { title: 'Articulo evoluciona' },
          ],
        },
      }   
    ],
  },
];
