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
import { Datos } from './inventario-stk';
import { InventarioStkService } from './inventario-stk.service'; 
import { FeatherModule } from 'angular-feather';
import { DdMmYYYYDatePipe } from 'src/app/dd-mm-yyyy-date.pipe';
import Swal from 'sweetalert2';
import { PermisosAccionService } from 'src/app/services/permisos-accion.service';
import { CtrlTrans } from 'src/app/services/ctrl-trans.service';
import { UtilesServices } from 'src/app/services/utiles-service';

const appDatoSelector='app-titulares';

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
  templateUrl: './inventario-stk.component.html',
  styleUrls: ['./inventario-stk.component.css'],
})
export class InventarioStkComponent implements OnInit {
  // INSTANCIO FORMULARIO Y SUS DATOS///////////////////////////////////////////////
 
  submitted = false;

  DatoList: Datos[] = [];
  filterArray: Datos[] = [];
  DatoDetail: Datos | null = null;
  DatoDetailArticulo: Datos[]
  DatoDetailLote: Datos[];
  DatoDetailSector: Datos[];
   


  filtrosForm: UntypedFormGroup | any;

  ///OBTENGO DATOS DE LA SECCION QUE ESTOY TRABAJANDO////////////
  secciones = JSON.parse(localStorage.getItem('seccion'));
  tipos_ganado = JSON.parse(localStorage.getItem('tipo_ganado'));
  categoriaGanado = JSON.parse(localStorage.getItem('categoria_ganado'));
  tiposArticulo  = JSON.parse(localStorage.getItem('tipo_articulo'));
  empresas= JSON.parse(localStorage.getItem('empresas'));
  sectores= JSON.parse(localStorage.getItem('sector'));

  nombreSeccion = 'Inventario de stock';
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
  _id_tipo_articulo:number;
  _codigo_sector:number;
  _codigo_categoria_ganado:number;
  _agrupacion:string
  StackMoment: string | null = null;
  stack: string | null = null;
  stacktConvert: any | null = null;

  constructor(
    ///////////////////////////////////////////CAMBIAR ACA////////////////////////
    private Datoservice: InventarioStkService,
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private datePipe: DdMmYYYYDatePipe,
    private formBuilder: FormBuilder,
    private permisos: PermisosAccionService,
    private evaluoTrans: CtrlTrans,
    private utiles:UtilesServices
  )  {

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
        //this.DatoDetail = this.DatoList;
        
        this.id_tipo_articulo = -1;
        this.filtrosForm.controls['id_tipo_articulo'].setValue(-1);
        

        //genero los tres tipos de array para las distintas vistas
       // console.log(this.DatoList);



        // Agrupar por código de artículo y sumarizar kilos y kilos_dos
        const resultadoArticulo = this.DatoList.reduce((acumulador, elemento) => {
          const codigoArticulo = `${elemento.codigo_articulo}`;
   

          if (!acumulador[codigoArticulo]) {
            acumulador[codigoArticulo] = {
              codigo_articulo: elemento.codigo_articulo,
              nombre_articulo: elemento.nombre_articulo,
              codigo_categoria_ganado:elemento.codigo_categoria_ganado,
              id_tipo_articulo:elemento.id_tipo_articulo,
              descripcion_corta:elemento.descripcion_corta,
              cantidad: 0,
              kilos: 0
              // Agrega aquí otras propiedades si es necesario
            };
          }

          


          //console.log(elemento.kilos);
    
          acumulador[codigoArticulo].cantidad += elemento.cantidad;
          acumulador[codigoArticulo].kilos += elemento.kilos;
    
          return acumulador;
        }, {});
   
        


        // Convertir el objeto resultado a un array de objetos
        this.DatoDetailArticulo= Object.values(resultadoArticulo);
        


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






       // console.log(this.DatoList);

        const resultadoLote = this.DatoList.reduce((acumuladorLote, elemento) => {
      
          const nroLote = `${elemento.codigo_articulo}-${elemento.nro_lote}-${elemento.codigo_sector}`;

          //const nroLote = elemento.nro_lote;
    



          if (!acumuladorLote[nroLote]) {
            acumuladorLote[nroLote] = {
              nro_lote:elemento.nro_lote,
              codigo_articulo: elemento.codigo_articulo,
              nombre_articulo: elemento.nombre_articulo,
              codigo_sector: elemento.codigo_sector,
              nombre_sector: elemento.nombre_sector,
              id_tipo_articulo:elemento.id_tipo_articulo,
              codigo_categoria_ganado:elemento.codigo_categoria_ganado,
              descripcion_corta:elemento.descripcion_corta,
              cantidad: 0,
              kilos: 0
              // Agrega aquí otras propiedades si es necesario
            };
          }
          


     //     console.log(elemento.kilos);
    
          acumuladorLote[nroLote].cantidad += elemento.cantidad;
          acumuladorLote[nroLote].kilos += elemento.kilos;
    
          return acumuladorLote;
        }, {});        
        
        this.DatoDetailLote = Object.values(resultadoLote);
        
     

      });

          
          
    }


    
  }


  ngOnInit() {


    this.editDato = this.fb.group({
      ///////////////////////////////////////////CAMBIAR ACA////////////////////////
      id: [''],
      descripcion: ['', Validators.required],
      id_tipo_ganado: ['', Validators.required],
  
    });


    this.filtrosForm = this.fb.group({
      ///////////////////////////////////////////CAMBIAR ACA////////////////////////
     
      id: [''],
      id_tipo_articulo:[''],
      codigo_sector:[''],
      codigo_categoria_ganado:[''],
      agrupacion:[''],
    });


  }
 


  
  get f(): { [key: string]: AbstractControl } {
    return this.editDato.controls;
  }

  //search...
  get searchTerm(): string {
    return this._searchTerm;
  }
  set searchTerm(val: string) {
    this._searchTerm = val;
    this.filterArray = this.filter(val);
  }

  //search...
  get id_tipo_articulo(): number {
    return this._id_tipo_articulo;
  }

  
  set id_tipo_articulo(val: number) {
    this._id_tipo_articulo = val;
    this.filterArray = this.filterTipoArticulo(val);
    this.agrupacion = 'articulo';
    this.filtrosForm.controls['agrupacion'].setValue('articulo');
    
  }

  filterTipoArticulo(v: number) {

    return this.DatoList.filter(
      (x) => parseInt(x.id_tipo_articulo,10) == v
    );

  }


  get codigo_categoria_ganado(): number {
    return this._codigo_categoria_ganado;
  }


  set codigo_categoria_ganado(val: number) {
    this._codigo_categoria_ganado = val;
    this.filterArray = this.aplicaFiltros();

  }

  aplicaFiltros(){

    let datosAVisualizar;
    let arrayUtilizar 
   //this.filterArray = [];
    //Primero veo que aray utlizar en funcion de la vista
    switch (this.agrupacion){

      case 'articulo':

         arrayUtilizar = this.DatoDetailArticulo
      
      break;
 
      case 'sector':

         arrayUtilizar = this.DatoDetailSector
   
      break;
      

      case 'lote':

         arrayUtilizar = this.DatoDetailLote

      break;

      case 'caravana':

         arrayUtilizar = this.DatoList

      break;


    }  
  

    datosAVisualizar =  arrayUtilizar;


    // Tipo articulo
    let id_tipo_articulo_filtro = this.id_tipo_articulo;

    if (datosAVisualizar !== undefined && datosAVisualizar !== null) {
     
      datosAVisualizar = datosAVisualizar.filter(

        (x) => parseInt(x.id_tipo_articulo,10) == id_tipo_articulo_filtro
      
      );

    } else {
      // Puedes manejar el caso en el que datosAVisualizar sea undefined o null
      // por ejemplo, asignando un array vacío:
      datosAVisualizar = [];
    }



    

    //Codigo categoria de articulo
    if (this.codigo_categoria_ganado !== undefined  && this.codigo_categoria_ganado.toString() !== "-1" ) {

      let codigo_categoria_ganado_filtro = this.codigo_categoria_ganado;

      if (codigo_categoria_ganado_filtro!=0){  
   
        datosAVisualizar = datosAVisualizar.filter(
          
        (x) => parseInt(x.codigo_categoria_ganado,10) == codigo_categoria_ganado_filtro
        
        );

      }

    }




    if (this.codigo_sector !== undefined && this.codigo_sector.toString() !== "-1") {
          // Tipo articulo
          let codigo_sector_filtro = this.codigo_sector;

          datosAVisualizar = datosAVisualizar.filter(

            (x) => parseInt(x.codigo_sector,10) == codigo_sector_filtro
          
          );

         
    }      
    //console.log(datosAVisualizar);
    
    return datosAVisualizar

  }






  get agrupacion(): string {
    return this._agrupacion;
  }

  
  set agrupacion(val: string) {
    this._agrupacion = val;
    this.filterArray = this.aplicaFiltros();
 
  }






  //search...
  get codigo_sector(): number {
  
    return this._codigo_sector;
  
  }
  set codigo_sector(val: number) {
  
    this._codigo_sector = val;
    this.filterArray = this.aplicaFiltros();

  
  }


  filter(v: string) {
    return this.DatoList.filter(
      (x) => x.nombre_articulo.toLowerCase().indexOf(v.toLowerCase()) !== -1 ||
      x.nro_lote.toLowerCase().indexOf(v.toLowerCase()) !== -1
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
  onSubmit() {
    this.submitted = true;

    if (this.filterArray != null && this.DatoDetail) {
      const index = this.filterArray.indexOf(this.DatoDetail);
/////////////////CAMBIAR ACA/////////////////////////////

      if (this.editDato != null) {
        this.DatoDetail.nombre_articulo = this.editDato.get('nombre_articulo')?.value;
        

      }
/////////////////CAMBIAR ACA/////////////////////////////
      this.Datoservice
        .updateDato(
          this.DatoDetail.id,
          this.DatoDetail
        )
        .subscribe((dato) => {
          this.filterArray[index] = dato;
        });
    } else {
      this.DatoDetail = new Datos();

      if (this.filterArray)
        this.DatoDetail.id =
          Math.max.apply(
            Math,
            this.filterArray.map(function (o) {
              return o.id;
            })
          ) + 1;

      

/////////////////CAMBIAR ACA/////////////////////////////
this.DatoDetail.nombre_articulo = this.editDato.get('nombre_articulo')?.value;

   

      this.Datoservice.addDato(this.DatoDetail as Datos).subscribe((dato) => {
        //console.log(dato);
        this.filterArray = [...this.filterArray, dato];
        this.filterArray.sort((a, b) => b.id - a.id);
      });


    }
    this.modalService.dismissAll();
    this.DatoDetail = null;

    //this.fecha = '';
    this.ngOnInit();
  }

  // close model...
  closeBtnClick() {
    this.modalService.dismissAll();
    this.ngOnInit();
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
