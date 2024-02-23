import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { DdMmYYYYDateSoloPipe } from '../dd-mm-yyyy-date-solo.pipe';

import { ErrorService } from './error.service';
import { StockService } from './stock.service';

const base_url = environment.base_url;

interface UsuarioEmpresa {
  id_empresa: string;
}

@Injectable({
  providedIn: 'root'
})
export class ObtengoDatosGeneralesService {
  usuario_x_empresa: string;

  constructor(
    private http: HttpClient,
    private formatoFechaSinHora: DdMmYYYYDateSoloPipe,
    private _errorService:ErrorService
  ) {}

  async obtengoDatosEstructurasPrimarias() {
    const estructurasNecesarias = ['articulo', 'categoria_ganado', 'estado_ganado', 'motivo_mov_stock',
      'tipo_ganado', 'tipo_toma_peso', 'marca_ganado', 'tipos_mov_stock', 'rol', 'moneda', 'usuario', 'tipo_costeo', 'tipo_titular', 
      'tipo_cambio_diario', 'catelgoria_cli', 'accion', 'seccion', 'pasturas',
      'permisos_x_usuario_seccion', 'control_trans', 'controles_x_seccion_accion', 'categoria_prov', 'marca_ganado','unidades','tipo_articulo',
      'motivo_sanitario','cpt_parametros_x_fecha', 'tasas_iva',
      'cpt_evolucion_ganado', 'estado_pago', 'tipos_dosis','tipos_gasto'
    ];

  
  
  

//console.log('acasa')
    //const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    estructurasNecesarias.forEach(async element => {
      if (localStorage.getItem(element) === null) {
        await this.http.get(`${base_url}/general/${element}`)
          .subscribe({
            next:(resp)=>{
              localStorage.setItem(element, JSON.stringify(resp));
            },
            error:(e:HttpErrorResponse)=>{
              this._errorService.msjError(e);
            }
           
          });
      }
    });









  }

  async obtengoDatosEmpresaUsuario(id: string) {

          const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    
    


          const estructurasNecesariasEmpresa = [ 'deposito', 'dicose','titular', 'cpf_log',
          'sector', 'pasturas_x_sector','cpt_registro_lluvias','articulos_x_titular', 
          ,'cpt_pago_fact_prov','cpt_relaciono_snig','cpt_recaravaneo','cpt_parametros_x_empresa','tipos_archivo_lector'
          ];
      
          estructurasNecesariasEmpresa.forEach(async element => {
            if (localStorage.getItem(element) === null) {
              await this.http.get(`${base_url}/generalempresa/${element}/${id}`)
                .subscribe({
                  next:(resp)=>{
                    localStorage.setItem(element, JSON.stringify(resp));
                  },
                  error:(e:HttpErrorResponse)=>{
                    this._errorService.msjError(e);
                  }
                 
                });
            }
          });








  }

  async obtengoDatosEmpresas() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    await this.http.get(`${base_url}/generalPublic/empresa/`, { headers: headers })
      .subscribe((resp: any) => {
        localStorage.setItem('empresas', JSON.stringify(resp));
      });
  }

   ctrlMovContables(fechaCtrl: Date):boolean {
    const fechaCtrlFormato = this.formatoFechaSinHora.transform(fechaCtrl);
    if (localStorage.getItem('exiteMovCtbl') === 'true') {
      return true;
    }

    //const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    let existeMov: boolean = false;

      this.http.get(`${base_url}/general/cpf_contaux/fecha/${fechaCtrlFormato}`)
      .subscribe((resp: any) => {
        if (resp !== null) {
          localStorage.setItem('exiteMovCtbl', 'true');
          existeMov = true;
        } else {
          localStorage.setItem('exiteMovCtbl', 'false');
          existeMov = false;
        }
      });

    return existeMov;
  }


 
}
