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
import { Datos } from './ganado';
import { FeatherModule } from 'angular-feather';
import { DdMmYYYYDatePipe } from 'src/app/dd-mm-yyyy-date.pipe';
import Swal from 'sweetalert2';
import { PermisosAccionService } from 'src/app/services/permisos-accion.service';
import { CtrlTrans } from 'src/app/services/ctrl-trans.service';
import { UtilesServices } from 'src/app/services/utiles-service';
import { NgSelectConfig, NgSelectModule } from '@ng-select/ng-select';
import { StockService } from 'src/app/services/stock.service';
import { ComponentsModule } from 'src/app/component/component.module';
import { GanadoService } from './ganado.service';
import { Router } from '@angular/router';
import { FormDataService } from 'src/app/component/accion-masiva-form/data/formData.service';
import { DdMmYYYYDateSoloPipeFormatoVisulizacion } from 'src/app/dd-mm-yyyy-date-solo-formato-visualizacion.pipe';

const appDatoSelector='app-ganado';

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

  templateUrl: './ganado.component.html',
  styleUrls: ['./ganado.component.css'],
})
export class GanadoComponent implements OnInit {
  // INSTANCIO FORMULARIO Y SUS DATOS///////////////////////////////////////////////
  selectedCar: number;
  submitted = false;

  suggestions: string[] = ['Apple', 'Banana', 'Cherry', 'Date', 'Fig'];
  userInput: string = '';

  DatoList: Datos[] = [];
  filterArray: Datos[] = [];
  DatoDetail: Datos | null = null;
  CaravanaSeleccionada: string | null = null;

  inicio: boolean = true;
  traslado: boolean = false;
  sanidad:boolean = false;
  info: boolean = false;
  baja: boolean = false;
  pesada: boolean = false;
  recaravaneo: boolean = false;
  recategoria: boolean = false;
  caravanaEncontrada:any = []
  razaCaravanaEncontrada:string ='';
  categoriaCaravanaEncontrada:string ='';
  pesoCaravanaEncontrada:string ='';
  sectorCaravanaEncontrada:string=''
  








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
  motivoStockTodos = JSON.parse(localStorage.getItem('motivo_mov_stock'));
  dicoses = JSON.parse(localStorage.getItem('dicose'));
  motivos_sanitarios = JSON.parse(localStorage.getItem('motivo_sanitario'));
  madres = JSON.parse(localStorage.getItem('stockActivoVacasPrenadas'));
  ganadoActivo:any;
  strArrayDepositosOrigenes='';



  motivoStock = this.motivoStockTodos.filter(item => item.id_tipo_mov_stk === 1);
  motivoStockBaja = this.motivoStockTodos.filter(item => item.id_tipo_mov_stk === 2);


  nombreSeccion = 'Accion por individuo - Ganado';
  nombreSeccionTabla = 'cpt_altaganado';
  seccionTrabajo = this.secciones.filter(
    (seccion) => seccion.tabla === this.nombreSeccionTabla
    
  );
  seccion = this.seccionTrabajo[0].id;

  config: any;
  editDato: UntypedFormGroup | any;
  trasladoForm: UntypedFormGroup | any;
  bajaForm: UntypedFormGroup | any;
  infoForm: UntypedFormGroup | any;
  sanidadForm: UntypedFormGroup | any;
  recaravaneoForm: UntypedFormGroup | any;
  recategoriaForm: UntypedFormGroup | any;
  pesadaForm: UntypedFormGroup | any;
  optionsDato: UntypedFormGroup | any;
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
    private Datoservice: GanadoService,
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private datePipe: DdMmYYYYDatePipe,
    private formBuilder: FormBuilder,
    private permisos: PermisosAccionService,
    private router: Router,
    private evaluoTrans: CtrlTrans,
    private utiles:UtilesServices,
    private configSel: NgSelectConfig, private stockService: StockService,
    private formDataService: FormDataService,
    private datePipeVisualizacion:DdMmYYYYDateSoloPipeFormatoVisulizacion

    )  {




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
      dias:['', Validators.required],
      fecha:['', Validators.required],
      cod_identidad:['', Validators.required],
      id_marca_ganado:['', Validators.required],
      id_categoria_ganado:['', Validators.required],
      id_motivos_stk:['', Validators.required],
      peso:['', Validators.required],
      fecha_registro:['', Validators.required],
      fecha_ingreso:['', Validators.required],
      propietario:['', Validators.required],
      bania_garrapata:[false, Validators.required],
      parasitos_internos:[false, Validators.required],
      carbunco:[false, Validators.required],
      clostridiosis:[false, Validators.required],
      nro_lote:[0, Validators.required],
      id_sector:['', Validators.required], 
      cod_identidad_madre:[''], 


    });

    this.trasladoForm = this.fb.group({
      id: [''],
      id_sector_destino: ['', Validators.required],
      observaciones: [''],

    });

    this.bajaForm = this.fb.group({
      id: [''],
      id_motivos_stk: ['', Validators.required],
      nro_lote: [''],
      observaciones: [''],

    });
    this.optionsDato = this.fb.group({
      ///////////////////////////////////////////CAMBIAR ACA////////////////////////
     
      id: [''],
      fecha: [''],

    });

    this.infoForm = this.fb.group({
      ///////////////////////////////////////////CAMBIAR ACA////////////////////////
     
      id: [''],
      fecha: [''],

    });


    this.pesadaForm = this.fb.group({
      ///////////////////////////////////////////CAMBIAR ACA////////////////////////
     
      id: [''],
      nuevo_peso:['', Validators.required],

    });
    this.recaravaneoForm = this.fb.group({
      ///////////////////////////////////////////CAMBIAR ACA////////////////////////
     
      id: [''],
      cod_identidad_nueva:['', Validators.required],
      observaciones: [''],

    });

    this.recategoriaForm = this.fb.group({
      ///////////////////////////////////////////CAMBIAR ACA////////////////////////
     
      id: [''],
      id_categoria_ganado:['', Validators.required],
      observaciones: [''],

    });



    this.sanidadForm = this.fb.group({
      ///////////////////////////////////////////CAMBIAR ACA////////////////////////
     
      id: [''],
      id_motivo_sanitario:['', Validators.required],
      resultadoTest:[''],
      observaciones: [''],

    });



    const currentDate = new Date().toISOString().substring(0, 10);
    this.editDato.controls['fecha'].setValue(currentDate);
    this.editDato.controls['fecha_registro'].setValue(currentDate);
    this.editDato.controls['fecha_ingreso'].setValue(currentDate);

  }

  
 

  mostrarFormularioInfo(caravanaSel) {

    this.inicio = false; // Oculta el formulario de inicio
    this.baja = false; // Muestra el formulario de traslado
    this.info = true; // Muestra el formulario de traslado



    this.caravanaEncontrada = this.ganadoActivo.find(ganado => ganado.cod_identidad === caravanaSel);

    console.log(this.caravanaEncontrada)

    this.razaCaravanaEncontrada = this.caravanaEncontrada.descripcion_marca
    this.categoriaCaravanaEncontrada = this.caravanaEncontrada.descripcion_categoria
    this.pesoCaravanaEncontrada = this.caravanaEncontrada.peso_actual
    this.sectorCaravanaEncontrada = this.caravanaEncontrada.descripcion_sector

  }



  mostrarFormularioSanidad(caravanaSel) {
    this.inicio = false; // Oculta el formulario de inicio
    this.sanidad = true; // Muestra el formulario de traslado

    this.caravanaEncontrada = this.ganadoActivo.find(ganado => ganado.cod_identidad === caravanaSel);
    this.razaCaravanaEncontrada = this.caravanaEncontrada.descripcion_marca
    this.categoriaCaravanaEncontrada = this.caravanaEncontrada.descripcion_categoria
    this.pesoCaravanaEncontrada = this.caravanaEncontrada.peso_actual
    this.sectorCaravanaEncontrada = this.caravanaEncontrada.descripcion_sector


  }





  mostrarFormularioTraslado(caravanaSel) {
    this.inicio = false; // Oculta el formulario de inicio
    this.traslado = true; // Muestra el formulario de traslado


    console.log(caravanaSel)

    let arrayCaravana: { caravana: string }[] = [];

    // Agregar una caravana en la posición 0 del array
    const nuevaCaravana = caravanaSel ; // Cambia '123456789' por el valor de la caravana que quieras agregar
    arrayCaravana[0] = { caravana: nuevaCaravana };
  
    this.stockService.getDepositoStkSeleccionadoInd(arrayCaravana).subscribe((resp) => {

      //console.log(resp);
      const arrayDepositos = [];

      for (const key in resp) {
        if (resp.hasOwnProperty(key)) {
          const deposito = {
            id: key,
            nombre: resp[key],
          };
          arrayDepositos.push(deposito);
        }
      }
      
      // Extraer los nombres de las estancias utilizando map()
      const nombresDepositos = arrayDepositos.map(deposito => deposito.nombre);
      
      // Unir los nombres en una cadena utilizando join()
      const depositosString = nombresDepositos.join(', ');
      
      //console.log(depositosString);

      this.strArrayDepositosOrigenes = depositosString;


  })

  }


  mostrarFormularioBaja(caravanaSel) {
    this.inicio = false; // Oculta el formulario de inicio
    this.baja = true; // Muestra el formulario de traslado

    this.caravanaEncontrada = this.ganadoActivo.find(ganado => ganado.cod_identidad === caravanaSel);
    this.razaCaravanaEncontrada = this.caravanaEncontrada.descripcion_marca
    this.categoriaCaravanaEncontrada = this.caravanaEncontrada.descripcion_categoria
    this.pesoCaravanaEncontrada = this.caravanaEncontrada.peso_actual
    this.sectorCaravanaEncontrada = this.caravanaEncontrada.descripcion_sector
  
  }


  mostrarFormularioPesada(caravanaSel) {
    this.inicio = false; // Oculta el formulario de inicio
    this.pesada = true; // Muestra el formulario de traslado

    this.caravanaEncontrada = this.ganadoActivo.find(ganado => ganado.cod_identidad === caravanaSel);
    this.razaCaravanaEncontrada = this.caravanaEncontrada.descripcion_marca
    this.categoriaCaravanaEncontrada = this.caravanaEncontrada.descripcion_categoria
    this.pesoCaravanaEncontrada = this.caravanaEncontrada.peso_actual
    this.sectorCaravanaEncontrada = this.caravanaEncontrada.descripcion_sector
  
  }

  mostrarFormularioRecaravaneo(caravanaSel) {
    this.inicio = false; // Oculta el formulario de inicio
    this.recaravaneo = true; // Muestra el formulario de traslado

    this.caravanaEncontrada = this.ganadoActivo.find(ganado => ganado.cod_identidad === caravanaSel);
    this.razaCaravanaEncontrada = this.caravanaEncontrada.descripcion_marca
    this.categoriaCaravanaEncontrada = this.caravanaEncontrada.descripcion_categoria
    this.pesoCaravanaEncontrada = this.caravanaEncontrada.peso_actual
    this.sectorCaravanaEncontrada = this.caravanaEncontrada.descripcion_sector
  
  }


  mostrarFormularioRecategoria(caravanaSel) {
    this.inicio = false; // Oculta el formulario de inicio
    this.recategoria = true; // Muestra el formulario de traslado

    this.caravanaEncontrada = this.ganadoActivo.find(ganado => ganado.cod_identidad === caravanaSel);
    this.razaCaravanaEncontrada = this.caravanaEncontrada.descripcion_marca
    this.categoriaCaravanaEncontrada = this.caravanaEncontrada.descripcion_categoria
    this.pesoCaravanaEncontrada = this.caravanaEncontrada.peso_actual
    this.sectorCaravanaEncontrada = this.caravanaEncontrada.descripcion_sector
  
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
      (x) => x.cod_identidad.toLowerCase().indexOf(v.toLowerCase()) !== -1
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




  
  accionesDato(accion:number, 
        optionsDatoModal: any,
    cod_identidad:string): void {
    
    if (!this.permisos.evaluoPermisoAccionUsuario(2, this.seccion)) {
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
       
        this.openOptionsModal(accion, optionsDatoModal, cod_identidad);
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
          //this.obtengoArticulo();
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
    dato: string | null
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


  openOptionsModal(accion, optionsDatoModal: any, dato: string | null) {

    this.CaravanaSeleccionada = dato;
    console.log(this.CaravanaSeleccionada)
    this.modalService.open(optionsDatoModal, {
      centered: true,
      backdrop: 'static',
    });


  }


  
  // open model...
  openModal(editDatoModal: any, dato: string | null) {
    this.modalService.open(editDatoModal, {
      centered: true,
      backdrop: 'static',
    });


      this.CaravanaSeleccionada = dato;
      
    
  }


  async submitTraslado(form: any) {

    if (!form.valid) return;

    const codIdentidadABuscar = this.CaravanaSeleccionada ;

    const ganadoEncontrado = this.ganadoActivo.find(ganado => ganado.cod_identidad === codIdentidadABuscar);
      

    const currentDate = new Date().toISOString().substring(0, 10);
    const fechaFormateadaBD = this.datePipeVisualizacion.transform(currentDate);  

        this.DatoDetail = new Datos

        this.DatoDetail.id_sector_destino = this.trasladoForm.get('id_sector_destino')?.value;
        this.DatoDetail.observaciones = this.trasladoForm.get('observaciones')?.value;
        this.DatoDetail.cod_identidad = codIdentidadABuscar;
        this.DatoDetail.fecha = fechaFormateadaBD;
        this.DatoDetail.id_empresa= this.empresas.id;
        this.DatoDetail.cod_articulo= ganadoEncontrado.cod_articulo;
        this.DatoDetail.nro_lote= ganadoEncontrado.nro_lote;
        this.DatoDetail.id_marca_ganado = ganadoEncontrado.id_marca_ganado;
        this.DatoDetail.id_categoria_ganado = ganadoEncontrado.id_categoria_ganado;
        this.DatoDetail.id_motivos_stk = 6;
        this.DatoDetail.peso = ganadoEncontrado.peso_actual;
        this.DatoDetail.carbunco= false;      
        this.DatoDetail.bania_garrapata = false; 
        this.DatoDetail.parasitos_internos= false      
        this.DatoDetail.clostridiosis = false; 

        //console.log(this.DatoDetail);

        this.Datoservice.realizoAccion(this.DatoDetail as Datos)
        .subscribe(
          response =>{
            console.log('Artículo insertado:', response);


            if (response.status=== 400) {
              // El servidor respondió con un código 400 (Bad Request)
              const numeroTransaccion = response.nro_trans ?? 0;
              const mensaje = `${response.message}<br/><span style="font-size: smaller;">Nro. transaccion: ${numeroTransaccion}</span>`
              imprimoMensajeError(
                mensaje,
                'Muchas Gracias'
              );   
            } else {
              // La solicitud se procesó con éxito
              //console.log('Artículo insertado:', response.data);
              imprimoMensajeOk(
                'Traslado realizado con exito',
                'Muchas Gracias'
              );   
                        // console.log(dato);
              this.filterArray = [...this.filterArray, response];
              this.filterArray.sort((a, b) => b.id - a.id);
              // Lógica si la inserción fue exitosa
            }




            //this.router.navigate(['/operaciones/ganado']);
          },
          error=>{
            console.error('Error al insertar el artículo:', error.error.message);
            imprimoMensajeError(
              error.error.message,
              'Muchas Gracias'
            );    
          // this.router.navigate(['/operaciones/ganado']);

          }

        ); 
   
        this.modalService.dismissAll();
        this.DatoDetail = null;
    
        //this.fecha = '';
        this.ngOnInit();
  }

  

  async submitBaja(form: any) {

    if (!form.valid) return;

    const codIdentidadABuscar = this.CaravanaSeleccionada ;

    const ganadoEncontrado = this.ganadoActivo.find(ganado => ganado.cod_identidad === codIdentidadABuscar);
      

    const currentDate = new Date().toISOString().substring(0, 10);
    const fechaFormateadaBD = this.datePipeVisualizacion.transform(currentDate);  

        this.DatoDetail = new Datos

        this.DatoDetail.id_motivos_stk = this.bajaForm.get('id_motivos_stk')?.value;
        this.DatoDetail.observaciones = this.bajaForm.get('observaciones')?.value;
        this.DatoDetail.cod_identidad = codIdentidadABuscar;
        this.DatoDetail.fecha = fechaFormateadaBD;
        this.DatoDetail.id_empresa= this.empresas.id;
        this.DatoDetail.cod_articulo= ganadoEncontrado.cod_articulo;
        this.DatoDetail.nro_lote= ganadoEncontrado.nro_lote;
        this.DatoDetail.id_marca_ganado = ganadoEncontrado.id_marca_ganado;
        this.DatoDetail.id_categoria_ganado = ganadoEncontrado.id_categoria_ganado;
        this.DatoDetail.peso = ganadoEncontrado.peso_actual;
        this.DatoDetail.carbunco= false;      
        this.DatoDetail.bania_garrapata = false; 
        this.DatoDetail.parasitos_internos= false      
        this.DatoDetail.clostridiosis = false; 

        //console.log(this.DatoDetail);

        this.Datoservice.realizoAccion(this.DatoDetail as Datos)
        .subscribe(
          response =>{
            console.log('Artículo dado de baja:', response);


            if (response.status=== 400) {
              // El servidor respondió con un código 400 (Bad Request)
              const numeroTransaccion = response.nro_trans ?? 0;
              const mensaje = `${response.message}<br/><span style="font-size: smaller;">Nro. transaccion: ${numeroTransaccion}</span>`
              imprimoMensajeError(
                mensaje,
                'Muchas Gracias'
              );   
            } else {
              // La solicitud se procesó con éxito
              //console.log('Artículo insertado:', response.data);
              imprimoMensajeOk(
                'Baja dada con exito',
                'Muchas Gracias'
              );   
                        // console.log(dato);
              this.filterArray = [...this.filterArray, response];
              this.filterArray.sort((a, b) => b.id - a.id);
              // Lógica si la inserción fue exitosa
            }




            //this.router.navigate(['/operaciones/ganado']);
          },
          error=>{
            console.error('Error al insertar el artículo:', error.error.message);
            imprimoMensajeError(
              error.error.message,
              'Muchas Gracias'
            );    
          // this.router.navigate(['/operaciones/ganado']);

          }

        ); 
   
        this.modalService.dismissAll();
        this.DatoDetail = null;
    
        //this.fecha = '';
        this.ngOnInit();

  }


  async submitPesada(form: any) {

    if (!form.valid) return;

    const codIdentidadABuscar = this.CaravanaSeleccionada ;

    const ganadoEncontrado = this.ganadoActivo.find(ganado => ganado.cod_identidad === codIdentidadABuscar);
      

    const currentDate = new Date().toISOString().substring(0, 10);
    const fechaFormateadaBD = this.datePipeVisualizacion.transform(currentDate);  

        this.DatoDetail = new Datos


        this.DatoDetail.nueva_pesada = this.pesadaForm.get('nueva_pesada')?.value;
        this.DatoDetail.id_motivos_stk = 11;
        this.DatoDetail.observaciones = this.pesadaForm.get('observaciones')?.value;
        this.DatoDetail.cod_identidad = codIdentidadABuscar;
        this.DatoDetail.fecha = fechaFormateadaBD;
        this.DatoDetail.id_empresa= this.empresas.id;
        this.DatoDetail.cod_articulo= ganadoEncontrado.cod_articulo;
        this.DatoDetail.nro_lote= ganadoEncontrado.nro_lote;
        this.DatoDetail.id_marca_ganado = ganadoEncontrado.id_marca_ganado;
        this.DatoDetail.id_categoria_ganado = ganadoEncontrado.id_categoria_ganado;
        this.DatoDetail.peso = ganadoEncontrado.peso_actual;
        this.DatoDetail.carbunco= false;      
        this.DatoDetail.bania_garrapata = false; 
        this.DatoDetail.parasitos_internos= false      
        this.DatoDetail.clostridiosis = false; 

        //console.log(this.DatoDetail);

        this.Datoservice.realizoAccion(this.DatoDetail as Datos)
        .subscribe(
          response =>{
            console.log('Se ha realizado el cambio de peso:', response);


            if (response.status=== 400) {
              // El servidor respondió con un código 400 (Bad Request)
              const numeroTransaccion = response.nro_trans ?? 0;
              const mensaje = `${response.message}<br/><span style="font-size: smaller;">Nro. transaccion: ${numeroTransaccion}</span>`
              imprimoMensajeError(
                mensaje,
                'Muchas Gracias'
              );   
            } else {
              // La solicitud se procesó con éxito
              //console.log('Artículo insertado:', response.data);
              imprimoMensajeOk(
                'Pesada realizada con exito',
                'Muchas Gracias'
              );   
                        // console.log(dato);
              this.filterArray = [...this.filterArray, response];
              this.filterArray.sort((a, b) => b.id - a.id);
              // Lógica si la inserción fue exitosa
            }




            //this.router.navigate(['/operaciones/ganado']);
          },
          error=>{
            console.error('Error al registrar el nuevo peso del artículo:', error.error.message);
            imprimoMensajeError(
              error.error.message,
              'Muchas Gracias'
            );    
          // this.router.navigate(['/operaciones/ganado']);

          }

        ); 
   
        this.modalService.dismissAll();
        this.DatoDetail = null;
    
        //this.fecha = '';
        this.ngOnInit();
  }



  async submitRecaravaneo(form: any) {

    if (!form.valid) return;

    const codIdentidadABuscar = this.CaravanaSeleccionada ;

    const ganadoEncontrado = this.ganadoActivo.find(ganado => ganado.cod_identidad === codIdentidadABuscar);
      

    const currentDate = new Date().toISOString().substring(0, 10);
    const fechaFormateadaBD = this.datePipeVisualizacion.transform(currentDate);  

        this.DatoDetail = new Datos


        this.DatoDetail.cod_identidad_nueva = this.recaravaneoForm.get('cod_identidad_nueva')?.value;
        this.DatoDetail.id_motivos_stk = 18;
        this.DatoDetail.observaciones = this.recaravaneoForm.get('observaciones')?.value;
        this.DatoDetail.cod_identidad = codIdentidadABuscar;
        this.DatoDetail.fecha = fechaFormateadaBD;
        this.DatoDetail.id_empresa= this.empresas.id;
        this.DatoDetail.cod_articulo= ganadoEncontrado.cod_articulo;
        this.DatoDetail.nro_lote= ganadoEncontrado.nro_lote;
        this.DatoDetail.id_marca_ganado = ganadoEncontrado.id_marca_ganado;
        this.DatoDetail.id_categoria_ganado = ganadoEncontrado.id_categoria_ganado;
        this.DatoDetail.peso = ganadoEncontrado.peso_actual;
        this.DatoDetail.carbunco= false;      
        this.DatoDetail.bania_garrapata = false; 
        this.DatoDetail.parasitos_internos= false      
        this.DatoDetail.clostridiosis = false; 

        //console.log(this.DatoDetail);

        this.Datoservice.realizoAccion(this.DatoDetail as Datos)
        .subscribe(
          response =>{
            console.log('Se ha realizado el recaravaneo:', response);


            if (response.status=== 400) {
              // El servidor respondió con un código 400 (Bad Request)
              const numeroTransaccion = response.nro_trans ?? 0;
              const mensaje = `${response.message}<br/><span style="font-size: smaller;">Nro. transaccion: ${numeroTransaccion}</span>`
              imprimoMensajeError(
                mensaje,
                'Muchas Gracias'
              );   
            } else {
              // La solicitud se procesó con éxito
              //console.log('Artículo insertado:', response.data);
              imprimoMensajeOk(
                'Recaravaneo realizada con exito',
                'Muchas Gracias'
              );   
                        // console.log(dato);
              this.filterArray = [...this.filterArray, response];
              this.filterArray.sort((a, b) => b.id - a.id);
              // Lógica si la inserción fue exitosa
            }




            //this.router.navigate(['/operaciones/ganado']);
          },
          error=>{
            console.error('Error al registrar el recaravaneo del artículo:', error.error.message);
            imprimoMensajeError(
              error.error.message,
              'Muchas Gracias'
            );    
          // this.router.navigate(['/operaciones/ganado']);

          }

        ); 
   
        this.modalService.dismissAll();
        this.DatoDetail = null;
    
        //this.fecha = '';
        this.ngOnInit();
  }



  async submitRecategoria(form: any) {

    if (!form.valid) return;

    const codIdentidadABuscar = this.CaravanaSeleccionada ;

    const ganadoEncontrado = this.ganadoActivo.find(ganado => ganado.cod_identidad === codIdentidadABuscar);
      

    const currentDate = new Date().toISOString().substring(0, 10);
    const fechaFormateadaBD = this.datePipeVisualizacion.transform(currentDate);  

        this.DatoDetail = new Datos


        let articulo:any = await this.obtengoArticuloPar(ganadoEncontrado.id_marca_ganado, this.editDato.get('id_categoria_ganado')?.value);
            
        let codArticulo = articulo[0].cod_articulo;


        this.DatoDetail.id_categoria_ganado = this.recategoriaForm.get('id_categoria_ganado')?.value;
        this.DatoDetail.id_motivos_stk = 17;
        this.DatoDetail.observaciones = this.recategoriaForm.get('observaciones')?.value;
        this.DatoDetail.cod_identidad = codIdentidadABuscar;
        this.DatoDetail.fecha = fechaFormateadaBD;
        this.DatoDetail.id_empresa= this.empresas.id;
        this.DatoDetail.cod_articulo= codArticulo;
        this.DatoDetail.nro_lote= ganadoEncontrado.nro_lote;
        this.DatoDetail.id_marca_ganado = ganadoEncontrado.id_marca_ganado;
        this.DatoDetail.cod_identidad = ganadoEncontrado.cod_identidad;
        this.DatoDetail.peso = ganadoEncontrado.peso_actual;
        this.DatoDetail.carbunco= false;      
        this.DatoDetail.bania_garrapata = false; 
        this.DatoDetail.parasitos_internos= false      
        this.DatoDetail.clostridiosis = false; 

        //console.log(this.DatoDetail);

        this.Datoservice.realizoAccion(this.DatoDetail as Datos)
        .subscribe(
          response =>{
            console.log('Se ha realizado el cambio de categoria:', response);


            if (response.status=== 400) {
              // El servidor respondió con un código 400 (Bad Request)
              const numeroTransaccion = response.nro_trans ?? 0;
              const mensaje = `${response.message}<br/><span style="font-size: smaller;">Nro. transaccion: ${numeroTransaccion}</span>`
              imprimoMensajeError(
                mensaje,
                'Muchas Gracias'
              );   
            } else {
              // La solicitud se procesó con éxito
              //console.log('Artículo insertado:', response.data);
              imprimoMensajeOk(
                'Cambio de categoria realizado con exito',
                'Muchas Gracias'
              );   
                        // console.log(dato);
              this.filterArray = [...this.filterArray, response];
              this.filterArray.sort((a, b) => b.id - a.id);
              // Lógica si la inserción fue exitosa
            }




            //this.router.navigate(['/operaciones/ganado']);
          },
          error=>{
            console.error('Error al registrar el cambio del artículo:', error.error.message);
            imprimoMensajeError(
              error.error.message,
              'Muchas Gracias'
            );    
          // this.router.navigate(['/operaciones/ganado']);

          }

        ); 
   
        this.modalService.dismissAll();
        this.DatoDetail = null;
    
        //this.fecha = '';
        this.ngOnInit();
  }




  async submitSanidad(form: any) {

    if (!form.valid) return;

    const codIdentidadABuscar = this.CaravanaSeleccionada ;

    const ganadoEncontrado = this.ganadoActivo.find(ganado => ganado.cod_identidad === codIdentidadABuscar);
      

    const currentDate = new Date().toISOString().substring(0, 10);
    const fechaFormateadaBD = this.datePipeVisualizacion.transform(currentDate);  

        this.DatoDetail = new Datos




        this.DatoDetail.id_motivo_sanitario = this.sanidadForm.get('id_motivo_sanitario')?.value;
        this.DatoDetail.id_motivos_stk = 12;
        this.DatoDetail.observaciones = this.sanidadForm.get('observaciones')?.value;
        this.DatoDetail.cod_identidad = codIdentidadABuscar;
        this.DatoDetail.fecha = fechaFormateadaBD;
        this.DatoDetail.id_empresa= this.empresas.id;
        this.DatoDetail.cod_articulo= ganadoEncontrado.cod_articulo;
        this.DatoDetail.nro_lote= ganadoEncontrado.nro_lote;
        this.DatoDetail.id_marca_ganado = ganadoEncontrado.id_marca_ganado;
        this.DatoDetail.cod_identidad = ganadoEncontrado.cod_identidad;
        this.DatoDetail.id_categoria_ganado = ganadoEncontrado.id_categoria_ganado;
        this.DatoDetail.peso = ganadoEncontrado.peso_actual;
        this.DatoDetail.carbunco= false;      
        this.DatoDetail.bania_garrapata = false; 
        this.DatoDetail.parasitos_internos= false      
        this.DatoDetail.clostridiosis = false; 
        this.DatoDetail.resultadoTest = this.sanidadForm.get('resultadoTest')?.value;

        //console.log(this.DatoDetail);

        this.Datoservice.realizoAccion(this.DatoDetail as Datos)
        .subscribe(
          response =>{
            console.log('Se ha realizado la sanidad:', response);


            if (response.status=== 400) {
              // El servidor respondió con un código 400 (Bad Request)
              const numeroTransaccion = response.nro_trans ?? 0;
              const mensaje = `${response.message}<br/><span style="font-size: smaller;">Nro. transaccion: ${numeroTransaccion}</span>`
              imprimoMensajeError(
                mensaje,
                'Muchas Gracias'
              );   
            } else {
              // La solicitud se procesó con éxito
              //console.log('Artículo insertado:', response.data);
              imprimoMensajeOk(
                'Sanidad realizada con exito',
                'Muchas Gracias'
              );   
                        // console.log(dato);
              this.filterArray = [...this.filterArray, response];
              this.filterArray.sort((a, b) => b.id - a.id);
              // Lógica si la inserción fue exitosa
            }




            //this.router.navigate(['/operaciones/ganado']);
          },
          error=>{
            console.error('Error al registrar la sanidad del artículo:', error.error.message);
            imprimoMensajeError(
              error.error.message,
              'Muchas Gracias'
            );    
          // this.router.navigate(['/operaciones/ganado']);

          }

        ); 
   
        this.modalService.dismissAll();
        this.DatoDetail = null;
    
        //this.fecha = '';
        this.ngOnInit();
  }









  // on submit data rom model...
  async onSubmit() {
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


          let articulo:any = await this.obtengoArticuloPar(this.editDato.get('id_marca_ganado')?.value, this.editDato.get('id_categoria_ganado')?.value);
            
          let codArticulo = articulo[0].cod_articulo;

          this.DatoDetail.observaciones = this.editDato.get('observaciones')?.value;
          this.DatoDetail.cod_identidad = this.editDato.get('cod_identidad')?.value;
          this.DatoDetail.fecha = this.editDato.get('fecha')?.value;
          this.DatoDetail.fecha_registro = this.editDato.get('fecha_registro')?.value;
          this.DatoDetail.fecha_ingreso = this.editDato.get('fecha_ingreso')?.value;
          this.DatoDetail.id_empresa= this.empresas.id;
          this.DatoDetail.cod_articulo= codArticulo;
          this.DatoDetail.nro_lote= this.editDato.get('nro_lote')?.value;
          this.DatoDetail.dias = this.editDato.get('dias')?.value;
          this.DatoDetail.id_marca_ganado = this.editDato.get('id_marca_ganado')?.value;
          this.DatoDetail.id_categoria_ganado = this.editDato.get('id_categoria_ganado')?.value;
          this.DatoDetail.id_motivos_stk = this.editDato.get('id_motivos_stk')?.value;
          this.DatoDetail.peso = this.editDato.get('peso')?.value;
          this.DatoDetail.propietario = this.editDato.get('propietario')?.value;
          this.DatoDetail.carbunco= this.editDato.get('carbunco')?.value;      
          this.DatoDetail.bania_garrapata = this.editDato.get('bania_garrapata')?.value; 
          this.DatoDetail.parasitos_internos= this.editDato.get('parasitos_internos')?.value;      
          this.DatoDetail.clostridiosis = this.editDato.get('clostridiosis')?.value; 


          //console.log(this.DatoDetail)

          this.Datoservice.addDato(this.DatoDetail as Datos)
          .subscribe(
            response =>{
              console.log('Artículo insertado:', response);


              if (response.status=== 400) {
                // El servidor respondió con un código 400 (Bad Request)
                const numeroTransaccion = response.nro_trans ?? 0;
                const mensaje = `${response.message}<br/><span style="font-size: smaller;">Nro. transaccion: ${numeroTransaccion}</span>`
                imprimoMensajeError(
                  mensaje,
                  'Muchas Gracias'
                );   
              } else {
                // La solicitud se procesó con éxito
                //console.log('Artículo insertado:', response.data);
                imprimoMensajeOk(
                  'Registro dado de alta',
                  'Muchas Gracias'
                );   
                           // console.log(dato);
                this.filterArray = [...this.filterArray, response];
                this.filterArray.sort((a, b) => b.id - a.id);
                // Lógica si la inserción fue exitosa
              }




              //this.router.navigate(['/operaciones/ganado']);
            },
            error=>{
              console.error('Error al insertar el artículo:', error.error.message);
              imprimoMensajeError(
                error.error.message,
                'Muchas Gracias'
              );    
             // this.router.navigate(['/operaciones/ganado']);

            }

          ); 





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


  
  async obtengoArticuloPar(marca, categoria): Promise<ResponseType> {
    // Replace 'ResponseType' with the actual type returned by getArticulo
    try {
      var id_marca = marca
      var id_categoria = categoria

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

function imprimoMensajeOk(title: string, text: string) {
  Swal.fire({
    title: title,
    text: text,
    icon: 'success',
    showCancelButton: false,
  });
}


