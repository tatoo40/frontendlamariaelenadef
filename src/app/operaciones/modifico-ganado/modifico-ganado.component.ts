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
import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Datos } from './modifico-ganado';
import { FeatherModule } from 'angular-feather';
import { DdMmYYYYDatePipe } from 'src/app/dd-mm-yyyy-date.pipe';
import Swal from 'sweetalert2';
import { PermisosAccionService } from 'src/app/services/permisos-accion.service';
import { CtrlTrans } from 'src/app/services/ctrl-trans.service';
import { UtilesServices } from 'src/app/services/utiles-service';
import { NgSelectConfig, NgSelectModule } from '@ng-select/ng-select';
import { StockService } from 'src/app/services/stock.service';
import { ComponentsModule } from 'src/app/component/component.module';
import { ModificoGanadoService } from './modifico-ganado.service';

const appDatoSelector='app-modifico-ganado';

@Component({
  selector: appDatoSelector,
  standalone: true,
  imports: [
    CommonModule,
    FeatherModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgSelectModule,
    NgFor,
    CommonModule
    
  
  ],

  templateUrl: './modifico-ganado.component.html',
  styleUrls: ['./modifico-ganado.component.css'],
})
export class ModificoGanadoComponent implements OnInit {
  // INSTANCIO FORMULARIO Y SUS DATOS///////////////////////////////////////////////
  selectedCar: number;
  submitted = false;

  suggestions: string[] = ['Apple', 'Banana', 'Cherry', 'Date', 'Fig'];
  userInput: string = '';

  DatoList: Datos[] = [];
  filterArray: Datos[] = [];
  DatoDetail: Datos | null = null;











  ///OBTENGO DATOS DE LA SECCION QUE ESTOY TRABAJANDO////////////
  secciones = JSON.parse(localStorage.getItem('seccion'));

  empresas= JSON.parse(localStorage.getItem('empresas'));
  sectores = JSON.parse(localStorage.getItem('sector'));
  pasturas = JSON.parse(localStorage.getItem('pasturas'));
  tipoGanado = JSON.parse(localStorage.getItem('tipo_ganado'));
  razaGanado = JSON.parse(localStorage.getItem('marca_ganado'));
  categoriaGanado = JSON.parse(localStorage.getItem('categoria_ganado'));
  razaGanadoOrigin = JSON.parse(localStorage.getItem('marca_ganado'));
  categoriaGanadoOrigin = JSON.parse(localStorage.getItem('categoria_ganado'));
  tipoPeso = JSON.parse(localStorage.getItem('tipo_toma_peso'));
  articulos = JSON.parse(localStorage.getItem('articulo'));
  ganadoActivo:any;


  nombreSeccion = 'Cambio categoria';
  nombreSeccionTabla = 'cpt_recaravaneo';
  seccionTrabajo = this.secciones.filter(
    (seccion) => seccion.tabla === this.nombreSeccionTabla
    
  );
  seccion = this.seccionTrabajo[0].id;

  config: any;
  editDato: UntypedFormGroup | any;

  fecha: string | null = null;

  ///OBTENGO DATOS DE OTRAS ETNTIDADS QUE UTILIZO EN EL FORM////////////
  
  page = 1;
  pageSize = 10;

  _searchTerm = '';
  StackMoment: string | null = null;
  stack: string | null = null;
  stacktConvert: any | null = null;

    dias:string='dias';
    mensual:string='mensual';
    semanal:string='semanal';

  categoriaLabel: string;
  sexoLabel: string;
  pesoLabel: string;
  marcaLabel: any;
  articuloNuevo: any;
  nro_loteActual: any;
  cod_articuloActual: any;
    
  constructor(
    ///////////////////////////////////////////CAMBIAR ACA////////////////////////
    private Datoservice: ModificoGanadoService,
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private datePipe: DdMmYYYYDatePipe,
    private formBuilder: FormBuilder,
    private permisos: PermisosAccionService,
    private evaluoTrans: CtrlTrans,
    private utiles:UtilesServices,
    private configSel: NgSelectConfig, private stockService: StockService
  )  {

     //this.stockService.getGanadoActivo();

    this.stockService.getGanadoActivo().subscribe((resp) => {

      //console.log(resp);
      this.ganadoActivo = resp;
      

    });


    this.configSel.notFoundText = 'Custom not found';
    this.configSel.appendTo = 'body';
    this.configSel.bindValue = 'value';

    

    if (!this.permisos.evaluoPermisoAccionUsuario(4, this.seccion)) {
      imprimoMensajeError(
        'Accion no autorizada',
        'Usted no tiene permisos para realizar esta accion. Contactese con el administrador'
      );
      return;
    } else {
   
      this.Datoservice.getDatos().subscribe((dato) => {
        this.DatoList = dato;
        this.filterArray = this.DatoList;
      });

          
          
    }


    
  }


  ngOnInit() {


    this.editDato = this.fb.group({
      ///////////////////////////////////////////CAMBIAR ACA////////////////////////
     
      id: [''],
      observaciones: [''],
      fecha:['', Validators.required],
      cod_identidad:['', Validators.required],
      id_marca_ganado:['', Validators.required],
      id_categoria_ganado:['', Validators.required]

    });
    const currentDate = new Date().toISOString().substring(0, 10);
    this.editDato.controls['fecha'].setValue(currentDate);

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

  filter(v: string) {
    return this.DatoList.filter(
      (x) => x.observaciones.toLowerCase().indexOf(v.toLowerCase()) !== -1
    );
  }

  // delete user...
  deleteDato(accion: number, id: number): void {
    if (!this.permisos.evaluoPermisoAccionUsuario(3, this.seccion)) {
      imprimoMensajeError(
        'Accion no autorizada',
        'Usted no tiene permisos para realizar esta accion. Contactese con el administrador'
      );
    } else {
      const resultadoEvaluacionTrans = this.evaluoTrans.evaluoAccionTransPre(
        accion,
        this.seccion,
        this.filterArray
      );



      if (resultadoEvaluacionTrans[0].status === 'error') {
        imprimoMensajeError(
          'Error de registro',
          resultadoEvaluacionTrans[0].mensaje
        );
      } else {
        if (this.filterArray) {
          Swal.fire({
            title: 'Esta seguro que desea eliminar este registro?',
            text: '',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, borrarlo!',
            cancelButtonText: 'No, mantenerlo',
          }).then((result) => {
            if (result.value) {
              Swal.fire(
                'Proceso finalizado con exito!',
                'El registro se ha eliminado con exito.',
                'success'
              );

              this.filterArray = this.filterArray.filter(
                (dato) => dato.id !== id
              );
              this.Datoservice.deleteDato(id).subscribe();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire(
                'Proceso cancelado',
                'El registrno no ha sido elimiado :)',
                'error'
              );
            }
          });
        }
      }
    }
  }




  onSelected(value: string): void {

      //this.editDato.controls['cod_identidad'].setValue(0);
      //Obtengo datos 
      //obtengo resto de los datos y asigno a las variables correpondientes
      const codIdentidadABuscar = this.editDato.get('cod_identidad')?.value;

      const ganadoEncontrado = this.ganadoActivo.find(ganado => ganado.cod_identidad === codIdentidadABuscar);
      
      if (ganadoEncontrado) {

          this.categoriaLabel = ganadoEncontrado.descripcion_categoria;
          this.marcaLabel = ganadoEncontrado.descripcion_marca;
          this.sexoLabel = ganadoEncontrado.sexo;
          this.pesoLabel = ganadoEncontrado.peso_actual;
          this.nro_loteActual = ganadoEncontrado.nro_lote;
          this.cod_articuloActual =  ganadoEncontrado.cod_articulo;

          this.editDato.controls['id_categoria_ganado'].setValue(ganadoEncontrado.id_categoria_ganado);
          this.editDato.controls['id_marca_ganado'].setValue(ganadoEncontrado.id_marca_ganado);
          this.obtengoArticulo();
        // Ahora puedes utilizar los valores de peso y categoria como desees.
        // console.log(`Peso: ${peso}, Categoría: ${categoria}`);
      
      } else {

        imprimoMensajeError(
          'Error de registro',
          'No existe un animal activo en stock con esa caravana'
        );
       // console.log(`No se encontró ningún ganado con cod_identidad ${codIdentidadABuscar}`);
      
      }
      





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
        
        observacion: dato.observaciones,
        fecha: dato.fecha,
        cod_identidad: dato.cod_identidad,
        //cod_identidad_nueva: dato.cod_identidad_nueva,
        id_categoria_ganado: dato.id_categoria_ganado,
        id_marca_ganado: dato.id_marca_ganado,
        id_empresa: this.empresas.id


     
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

        const fechaFormateadaBD = this.datePipe.transform(this.editDato.get('fecha')?.value);
   
        this.DatoDetail.observaciones = this.editDato.get('observaciones')?.value;
        this.DatoDetail.cod_identidad = this.editDato.get('cod_identidad')?.value;
        this.DatoDetail.fecha = fechaFormateadaBD;
        this.DatoDetail.id_empresa= this.empresas.id;
        this.DatoDetail.cod_articulo=this.cod_articuloActual;
        this.DatoDetail.nro_lote= this.nro_loteActual; 
        this.DatoDetail.cod_identidad_nueva = this.editDato.get('cod_identidad')?.value;
        this.DatoDetail.id_marca_ganado = this.editDato.get('id_marca_ganado')?.value;
        this.DatoDetail.id_categoria_ganado = this.editDato.get('id_categoria_ganado')?.value;
        //obtengo el articulo en funcion de la marca y la categoraia
        this.DatoDetail.cod_articulo_nuevo = this.articuloNuevo[0].cod_articulo;



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

 
       
          const fechaFormateadaBD = this.datePipe.transform(this.editDato.get('fecha')?.value);



   
          this.DatoDetail.observaciones = this.editDato.get('observaciones')?.value;
          this.DatoDetail.cod_identidad = this.editDato.get('cod_identidad')?.value;
          this.DatoDetail.fecha = fechaFormateadaBD;
          this.DatoDetail.id_empresa= this.empresas.id;
          this.DatoDetail.cod_articulo=this.cod_articuloActual;
          this.DatoDetail.nro_lote= this.nro_loteActual; 
          this.DatoDetail.cod_identidad_nueva = this.editDato.get('cod_identidad')?.value;
          this.DatoDetail.id_marca_ganado = this.editDato.get('id_marca_ganado')?.value;
          this.DatoDetail.id_categoria_ganado = this.editDato.get('id_categoria_ganado')?.value;
    
          this.DatoDetail.cod_articulo_nuevo = this.articuloNuevo[0].cod_articulo;
          
          
          console.log(this.DatoDetail)

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


  async obtengoArticulo(): Promise<ResponseType> {
    // Replace 'ResponseType' with the actual type returned by getArticulo
    try {
      var id_marca = this.editDato.get('id_marca_ganado')?.value
      var id_categoria = this.editDato.get('id_categoria_ganado')?.value

      const resp = await this.stockService.getArticulo(id_marca, id_categoria).toPromise();
      this.articuloNuevo = resp;
      return this.articuloNuevo;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
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


