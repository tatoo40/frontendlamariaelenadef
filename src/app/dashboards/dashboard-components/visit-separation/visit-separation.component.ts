import { Component } from '@angular/core';
import { Datos } from 'src/app/reportes/inventario-stk/inventario-stk';
import { InventarioStkService } from 'src/app/reportes/inventario-stk/inventario-stk.service';
import { CtrlTrans } from 'src/app/services/ctrl-trans.service';
import { PermisosAccionService } from 'src/app/services/permisos-accion.service';
import { UtilesServices } from 'src/app/services/utiles-service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-visit-separation',
  templateUrl: './visit-separation.component.html',
  styleUrls: ['./visit-separation.component.css'],
})





export class VisitSeparationComponent {

  DatoList: Datos[] = [];
  filterArray: Datos[] = [];
  DatoDetail: Datos | null = null;
  DatoSector: Datos[];
  DatoDetailSector: Datos[];

  
  secciones = JSON.parse(localStorage.getItem('seccion'));
  tipos_ganado = JSON.parse(localStorage.getItem('tipo_ganado'));
  categoriaGanado = JSON.parse(localStorage.getItem('categoria_ganado'));
  tiposArticulo  = JSON.parse(localStorage.getItem('tipo_articulo'));
  empresas= JSON.parse(localStorage.getItem('empresas'));
  sectores= JSON.parse(localStorage.getItem('sector'));
  emprsasSel = this.empresas[0]
  nombreSeccion = 'Inventario de stock';
  nombreSeccionTabla = 'marcas_ganado';
  seccionTrabajo = this.secciones.filter(
    (seccion) => seccion.tabla === this.nombreSeccionTabla
  );
  seccion = this.seccionTrabajo[0].id;

  constructor(

    private Datoservice: InventarioStkService,
    private permisos: PermisosAccionService,
    private evaluoTrans: CtrlTrans,
    private utiles:UtilesServices


  ) {
   

    if (!this.permisos.evaluoPermisoAccionUsuario(4, this.seccion)) {
      imprimoMensajeError(
        'Accion no autorizada',
        'Usted no tiene permisos para realizar esta accion. Contactese con el administrador'
      );
      return;
    } else {


   
      this.Datoservice.getDatos(this.emprsasSel.id).subscribe((dato) => {
        this.DatoList = dato;
        this.filterArray = this.DatoList;
      
        
        // OBTENGO LOS SECTORES
        const resultadoSector = this.DatoList.reduce((acumulador, elemento) => {
          const codigoSector = `${elemento.codigo_sector}`;
   
    


          if (!acumulador[codigoSector]) {
            acumulador[codigoSector] = {
              codigo_sector: elemento.codigo_sector,
              nombre_sector: elemento.nombre_sector,
              cantidad: 0,
              kilos: 0
              // Agrega aquí otras propiedades si es necesario
            };
          }

          


    
          acumulador[codigoSector].cantidad += elemento.cantidad;
          acumulador[codigoSector].kilos += elemento.kilos;
    
          return acumulador;
        }, {});
   
        





        // Convertir el objeto resultado a un array de objetos
        this.DatoSector= Object.values(resultadoSector);









        // articulo sector
        const resultadoArticuloSector = this.DatoList.reduce((acumulador, elemento) => {
          const codigoArticuloSector = `${elemento.codigo_articulo}-${elemento.codigo_sector}`;
   
    


          if (!acumulador[codigoArticuloSector]) {
            acumulador[codigoArticuloSector] = {
              codigo_articulo: elemento.codigo_articulo,
              nombre_articulo: elemento.nombre_articulo,
              codigo_sector: elemento.codigo_sector,
              nombre_sector: elemento.nombre_sector,
              codigo_categoria_ganado:elemento.codigo_categoria_ganado,
              id_tipo_articulo:elemento.id_tipo_articulo,
              descripcion_corta:elemento.descripcion_corta,
              cantidad: 0,
              kilos: 0
              // Agrega aquí otras propiedades si es necesario
            };
          }

          


    
          acumulador[codigoArticuloSector].cantidad += elemento.cantidad;
          acumulador[codigoArticuloSector].kilos += elemento.kilos;
    
          return acumulador;
        }, {});
   
        


        // Convertir el objeto resultado a un array de objetos
        this.DatoDetailSector= Object.values(resultadoArticuloSector);







      });

          
          
    }


    
  }


  parseCodigoSectorToInt(codigoSector: string): number {
    return parseInt(codigoSector, 10); // La base 10 indica el sistema numérico
  }

  }

  


  function imprimoMensajeError(title: string, text: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: false,
    });
  }
  

