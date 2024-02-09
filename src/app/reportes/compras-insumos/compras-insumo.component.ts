import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Datos } from './compras-insumo';
import { ComprasInsumoService } from './compras-insumo.service'; 
import { FeatherModule } from 'angular-feather';
import { DdMmYYYYDatePipe } from 'src/app/dd-mm-yyyy-date.pipe';
import { DdMmYyyyConBarras } from 'src/app/dd-mm-yyyy-barra-date.pipe';
import Swal from 'sweetalert2';
import { PermisosAccionService } from 'src/app/services/permisos-accion.service';
import { CtrlTrans } from 'src/app/services/ctrl-trans.service';
import { UtilesServices } from 'src/app/services/utiles-service';
import { ImporteUsdListado } from 'src/app/importe-usd-listado';
import * as XLSX from 'xlsx';
import { writeFile } from 'xlsx';
import { ExporterService } from 'src/app/services/exporter.service';

const appDatoSelector='app-compras-insumo';

@Component({
  selector: appDatoSelector,
  standalone: true,
  imports: [
    CommonModule,
    FeatherModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
  ],
  templateUrl: './compras-insumo.component.html',
  styleUrls: ['./compras-insumo.component.css'],
})
export class ComprasInsumoComponent implements OnInit {
  // INSTANCIO FORMULARIO Y SUS DATOS///////////////////////////////////////////////
 
  submitted = false;

  DatoList: Datos[] = [];
  filterArray: Datos[] = [];
  DatoDetail: Datos | null = null;
  DatoDetailArticulo: Datos[]
  DatoDetailProveedor: Datos[];
  DatoDetailFactura: Datos[];
   


  filtrosForm: UntypedFormGroup | any;

  ///OBTENGO DATOS DE LA SECCION QUE ESTOY TRABAJANDO////////////
  secciones = JSON.parse(localStorage.getItem('seccion'));
  tiposArticulo  = JSON.parse(localStorage.getItem('tipo_articulo'));
  empresas= JSON.parse(localStorage.getItem('empresas'));
  sectores= JSON.parse(localStorage.getItem('sector'));
  titulares= JSON.parse(localStorage.getItem('titular'));



 proveedores = this.titulares.filter((proveedor) => proveedor.id_categoria_prov === 3);




  nombreSeccion = 'Compras de insumos y servicios';
  nombreSeccionTabla = 'marcas_ganado';
  seccionTrabajo = this.secciones.filter(
    (seccion) => seccion.tabla === this.nombreSeccionTabla
  );
  seccion = this.seccionTrabajo[0].id;

  config: any;
  editDato: UntypedFormGroup | any;

  fecha: string | null = null;

  ///OBTENGO DATOS DE OTRAS ETNTIDADS QUE UTILIZO EN EL FORM////////////
  
  page = 1;
  pageSize = 30;

  _searchTerm = '';
  _fechaDesde = '';
  _fechaHasta = '';
  _id_tipo_articulo:number;
  _id_proveedor:number;
  _codigo_sector:number;
  _codigo_categoria_ganado:number;
  _agrupacion:string
  StackMoment: string | null = null;
  stack: string | null = null;
  stacktConvert: any | null = null;

  constructor(
    ///////////////////////////////////////////CAMBIAR ACA////////////////////////
    private Datoservice: ComprasInsumoService,
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private datePipe: DdMmYYYYDatePipe,
    private datePipeConBarras: DdMmYyyyConBarras,
    private importeUsdListado:ImporteUsdListado,
    private formBuilder: FormBuilder,
    private permisos: PermisosAccionService,
    private evaluoTrans: CtrlTrans,
    private utiles:UtilesServices,
    private exportarExcel: ExporterService
  )  {
    //console.log(this.proveedores);


    if (!this.permisos.evaluoPermisoAccionUsuario(4, this.seccion)) {
      imprimoMensajeError(
        'Accion no autorizada',
        'Usted no tiene permisos para realizar esta accion. Contactese con el administrador'
      );
      return;
    
    } else {
   
        this.Datoservice.getDatos(this.empresas.id).subscribe((dato) => {
        this.DatoList = dato;
        this.filterArray = this.DatoList;

        //this.filtrosForm.controls['agrupacion'].setValue('factura');

        //ARRAY POR FACTURA
        const resultadoFactura= this.DatoList.reduce((acumulador, elemento) => {
        const codigoFactura = `${elemento.serie_fact_prov}-${elemento.nro_fact_prov}`;
     
            if (!acumulador[codigoFactura]) {
              acumulador[codigoFactura] = {
                fecha: elemento.fecha,
                cod_articulo: elemento.cod_articulo,
                serie_fact_prov: elemento.serie_fact_prov,
                nro_fact_prov: elemento.nro_fact_prov,
                nombre_fantasia:elemento.nombre_fantasia,
                importe_total_mo:elemento.importe_total_mo,
                peso:elemento.peso,
                cantidad:elemento.cantidad,
                descripcion:elemento.descripcion,
                unidad_stock:elemento.unidad_stock,
                // Agrega aquí otras propiedades si es necesario
              };
            }
  
          
          //acumulador[codigoFactura].cantidad += elemento.cantidad;
         // acumulador[codigoFactura].kilos += elemento.kilos;
    
          return acumulador;

        }, {});
     
        //console.log(resultadoFactura)
  
  
        // Convertir el objeto resultado a un array de objetos
        this.DatoDetailFactura =  Object.values(resultadoFactura);     

      });

          
          
    }


    
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`
    //return `${day}/${month}/${year}`;
  }


  ngOnInit() {



    this.filtrosForm = this.fb.group({
      ///////////////////////////////////////////CAMBIAR ACA////////////////////////
     
      id: [''],
      id_proveedor:[''],
      codigo_sector:[''],
      codigo_categoria_ganado:[''],
      agrupacion:[''],
      fechaHasta:[''],
      fechaDesde:[''],

    });

    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    this.fechaDesde = this.formatDate(primerDiaMes); // Asigna la fecha formateada al control
    this.fechaHasta = this.formatDate(hoy);

    this.id_proveedor = -1;
    this.agrupacion = 'factura';

    this.aplicaFiltros();


  }
 


  
  get f(): { [key: string]: AbstractControl } {
    return this.editDato.controls;
  }



  get fechaDesde(): string {
    return this._fechaDesde;
  }

  set fechaDesde(val: string) {
    this._fechaDesde = val;
    this.filterArray = this.aplicaFiltros();
  }


  get fechaHasta(): string {
    return this._fechaHasta;
  }
  set fechaHasta(val: string) {
    this._fechaHasta = val;
    this.filterArray = this.aplicaFiltros();
  }

  get id_proveedor(): number {
    return this._id_proveedor;
  }

  
  set id_proveedor(val: number) {
    this._id_proveedor = val;
    this.filterArray = this.aplicaFiltros();
    //this.agrupacion = 'articulo';
    //this.filtrosForm.controls['agrupacion'].setValue('articulo');
    
  }



  filterProveedor(v: number) {

    return this.DatoList.filter(
      (x) => parseInt(x.id_proveedor,10) == v
    );

  }


  

  aplicaFiltros(){

    let datosAVisualizar;
    let arrayUtilizar 
   //this.filterArray = [];
    //Primero veo que aray utlizar en funcion de la vista
    arrayUtilizar = this.DatoDetailFactura

  
    if (this.fechaDesde && this.fechaHasta && arrayUtilizar) {
      // Convierte las fechas desde y hasta al formato de Date
      const fechaDesdeFiltro = new Date(convertirFecha(this.fechaDesde));
      const fechaHastaFiltro = new Date(convertirFecha(this.fechaHasta));

      // Filtra las facturas comprendidas entre las fechas desde y hasta
      datosAVisualizar = arrayUtilizar.filter(dato => {
          const fechaFactura = new Date(dato.fecha); // Suponiendo que dato.fecha es la fecha de la factura

          // Formatea las fechas de factura para que puedan ser comparadas
          const fechaFacturaFormatted = new Date(this.datePipe.transform(fechaFactura, 'yyyy-MM-dd'));
          const fechaDesdeFormatted = new Date(this.datePipe.transform(fechaDesdeFiltro, 'yyyy-MM-dd'));
          const fechaHastaFormatted = new Date(this.datePipe.transform(fechaHastaFiltro, 'yyyy-MM-dd'));

          // Compara si la fecha de la factura está entre las fechas desde y hasta
          return fechaFacturaFormatted >= fechaDesdeFormatted && fechaFacturaFormatted <= fechaHastaFormatted;
      });
    }
    //console.log(datosAVisualizar)
   // datosAVisualizar =  arrayUtilizar;
   if (datosAVisualizar && this.id_proveedor.toString()!='-1') {
      datosAVisualizar = datosAVisualizar.filter(dato => dato.nombre_fantasia === this.id_proveedor);
   }
    


   switch (this.agrupacion){

    case 'proveedor':

      ////////////////////////PROVEEDOR
      const resultadoProveedor = datosAVisualizar.reduce((acumulador, elemento) => {
      const codigoProveedor= `${elemento.nombre_fantasia}`;
    

          if (!acumulador[codigoProveedor]) {
            acumulador[codigoProveedor] = {
              cod_articulo: elemento.cod_articulo,
              nombre_fantasia:elemento.nombre_fantasia,
              unidad_stock:elemento.unidad_stock,
              importe_total_mo:0,
              peso:0,
              cantidad:0,

              // Agrega aquí otras propiedades si es necesario
            };
          }

          


          //console.log(elemento.kilos);
    
          acumulador[codigoProveedor].cantidad += elemento.cantidad;
          acumulador[codigoProveedor].peso += elemento.peso;
          acumulador[codigoProveedor].importe_total_mo += elemento.importe_total_mo;

          return acumulador;
        }, {});
    
        


        // Convertir el objeto resultado a un array de objetos
        this.DatoDetailProveedor= Object.values(resultadoProveedor);  
        return this.DatoDetailProveedor;
    
    break;

    case 'articulo':

    ////////////////////////PROVEEDOR
    const resultadoArticulo= datosAVisualizar.reduce((acumulador, elemento) => {
    const codigoArticulo= `${elemento.codigo_articulo}`;
  

        if (!acumulador[codigoArticulo]) {
          acumulador[codigoArticulo] = {
            cod_articulo: elemento.cod_articulo,
            unidad_stock:elemento.unidad_stock,
            importe_total_mo:0,
            peso:0,
            cantidad:0,

            // Agrega aquí otras propiedades si es necesario
          };
        }

        


        //console.log(elemento.kilos);
  
        acumulador[codigoArticulo].cantidad += elemento.cantidad;
        acumulador[codigoArticulo].peso += elemento.peso;
        acumulador[codigoArticulo].importe_total_mo += elemento.importe_total_mo;

        return acumulador;
      }, {});
  
      


      // Convertir el objeto resultado a un array de objetos
      this.DatoDetailArticulo= Object.values(resultadoArticulo);  
      return this.DatoDetailArticulo;
  
  break;



    case 'factura':
        
      return datosAVisualizar;
 
    break;
    


  }  







  }






  get agrupacion(): string {
    return this._agrupacion;
  }

  
  set agrupacion(val: string) {
    this._agrupacion = val;
    this.filterArray = this.aplicaFiltros();
 
  }




  filter(v: string) {
    return this.DatoList.filter(
      (x) => x.nombre_fantasia.toLowerCase().indexOf(v.toLowerCase()) !== -1 ||
      x.nombre_fantasia.toLowerCase().indexOf(v.toLowerCase()) !== -1
    );
  }


  sumarKilos(): number {
    return this.filterArray.reduce((acc, dato) => acc + dato.kilos, 0);
  }



  chequeoApertura(
    accion: number,
    editDatoModal: any,
    dato: Datos | null
  ) {
    //var arrayPaso: any[];
    if (!this.permisos.evaluoPermisoAccionUsuario(accion, this.seccion)) {
      imprimoMensajeError(
        'Accion no autorizada',
        'Usted no tiene permisos para realizar esta accion. Contactese con el administrador'
      );
      return;
    } else {
      if (this.filterArray.length === 0) {
        this.openModal(editDatoModal, dato);
      } else {
        const resultadoEvaluacionTrans = this.evaluoTrans.evaluoAccionTransPre(
          accion,
          this.seccion,
          this.filterArray
        );

        //e.log(resultadoEvaluacionTrans)

        if (resultadoEvaluacionTrans[0].status === 'error') {
          imprimoMensajeError(
            'Error de registro',
            'Ya existe un registro para el dia de hoy'
          );
        } else {
          this.openModal(editDatoModal, dato);
        }
      }
    }
  }

  // open model...
  openModal(editDatoModal: any, dato: Datos | null) {
    this.modalService.open(editDatoModal, {
      centered: true,
      backdrop: 'static',
    });

    if (dato != null) {

      /////////////////CAMBIAR ACA/////////////////////////////
      //console.log(tipoCambio)
      this.DatoDetail = dato;
      this.editDato?.patchValue({
        nombre_articulo: dato.nombre_articulo,
   
     
      });
    }
  }

  // on submit data rom model...


  // close model...
  closeBtnClick() {
    this.modalService.dismissAll();
    this.ngOnInit();
  }

  exportAsXLSX():void{

    var DatosAEnviar:any
    switch (this.agrupacion){

      case 'factura':
        DatosAEnviar = this.DatoDetailFactura;
      break;
      case 'proveedor':
        DatosAEnviar= this.DatoDetailProveedor;
      break;
      case 'articulo':
        DatosAEnviar= this.DatoDetailArticulo;
      break;            
    }
    
    this.exportarExcel.exportToExcel(DatosAEnviar,'comprasdeganado');

  }

  private saveExcelFile(buffer: any, fileName: string): void {
    const data: any = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    writeFile(data, `${fileName}.xlsx`);
  }
  
}

function convertirFecha(fecha: string): string {
  const partes = fecha.split('/');
  // Asegurarse de que las partes tengan el formato correcto (DD/MM/YYYY)
  const fechaISO = partes[2] + '-' + partes[1] + '-' + partes[0];
  return fechaISO;
}



function imprimoMensajeError(title: string, text: string) {
  Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: false,
  });
}
