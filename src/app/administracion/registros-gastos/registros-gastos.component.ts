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
  ValidatorFn,
} from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Datos } from './registros-gastos';
import {  RegistrosGastosService } from './registros-gastos.service'; 
import { FeatherModule } from 'angular-feather';
import Swal from 'sweetalert2';
import { PermisosAccionService } from 'src/app/services/permisos-accion.service';
import { CtrlTrans } from 'src/app/services/ctrl-trans.service';
import { UtilesServices } from 'src/app/services/utiles-service';
import { DdMmYYYYDatePipe } from 'src/app/dd-mm-yyyy-date.pipe';
import { DdMmYYYYDateSoloHoraCeroPipe } from 'src/app/dd-mm-yyyy-date-solo-hora-cero.pipe';
import { InventarioStkService } from 'src/app/reportes/inventario-stk/inventario-stk.service';


const appDatoSelector='app-registros-gastos';

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
  templateUrl: './registros-gastos.component.html',

})
export class RegistrosGastosComponent implements OnInit {
  // INSTANCIO FORMULARIO Y SUS DATOS///////////////////////////////////////////////
 
  submitted = false;

  DatoList: Datos[] = [];
  filterArray: Datos[] = [];
  DatoDetail: Datos | null = null;


  ///OBTENGO DATOS DE LA SECCION QUE ESTOY TRABAJANDO////////////
  secciones = JSON.parse(localStorage.getItem('seccion'));
  monedas= JSON.parse(localStorage.getItem('moneda'));

 

  empresasSel= JSON.parse(localStorage.getItem('empresas'));
  empresas = this.empresasSel[0]


  tipos_gasto= JSON.parse(localStorage.getItem('tipos_gasto'));
  //tipos_gasto = this.tipos_gastoSel[0]
  arrayTc = JSON.parse(localStorage.getItem('tipo_cambio_diario'));

  nombreSeccion = 'Registro de gastos';
  nombreSeccionTabla = 'cpt_registros_gasto';
  seccionTrabajo = this.secciones.filter(
    (seccion) => seccion.tabla === this.nombreSeccionTabla
  );
  seccion = this.seccionTrabajo[0].id;

  fechaBuscada = this.fechaFormato.transform(new Date());

  tipoCambioBuscado = this.arrayTc.find(
    (tipoCambioBuscado) => this.fechaFormato.transform(tipoCambioBuscado.fecha) === this.fechaBuscada
   );

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
  articulosSel: import("/Users/tato/Desktop/ganaoFrontend/src/app/reportes/inventario-stk/inventario-stk").Datos[];
  articulos: import("/Users/tato/Desktop/ganaoFrontend/src/app/reportes/inventario-stk/inventario-stk").Datos[];

  constructor(
    ///////////////////////////////////////////CAMBIAR ACA////////////////////////
    private Datoservice: RegistrosGastosService,
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private datePipe: DdMmYYYYDatePipe,
    private formBuilder: FormBuilder,
    private permisos: PermisosAccionService,
    private evaluoTrans: CtrlTrans,
    private utiles:UtilesServices,
    private fechaFormato:DdMmYYYYDateSoloHoraCeroPipe,
    private inventarioStk:InventarioStkService,
    private readonly _datePipe: DatePipe,

  )  {

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


    const today = new Date();
    // Formatea la fecha al formato deseado (dd/MM/yyyy)
    const formattedDate = this.datePipe.transform(today, 'dd/mm/yyyy');

    this.editDato = this.fb.group({
      id: [''],
      fecha: [formattedDate, [Validators.required, this.validarFechaHoy()]], // Valor por defecto y validación de fecha
      id_tipo_gasto: ['', [Validators.required, this.soloNumeros]],
      id_moneda: ['', Validators.required],
      importe_mo: ['', Validators.required],
      descripcion:['', Validators.required],
      tc:['',Validators.required]



      //descripcion
     // fecha
      //cod_docum
      //importe_mo
      //importe_mn
      //importe_tr
      //tc
      //id_moneda
      //id_titular
      //id_empresa
      //id_tipo_gasto



    });
    const fechaHoy = new Date();

    // Formatear la fecha como 'yyyy-MM-dd' utilizando DatePipe
    this.fecha = this.datePipe.transform(fechaHoy, 'yyyy-MM-dd');


    this.editDato.controls.fecha.setValue(this.currentDate());
    this.editDato.controls.tc.setValue(this.tipoCambioBuscado.valor);
  
  }
  currentDate() {
    
    const currentDate = new Date();
    //console.log(currentDate)
    return currentDate.toISOString().substring(0,10);

  }

   soloNumeros(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null; // Permitir valores vacíos
    }
    const regex = /^\d*\.?\d*$/; // Expresión regular para permitir números decimales
    if (!regex.test(value)) {
      return { 'soloNumerosDecimales': true }; // Retornar error si no son números decimales
    }
    return null; // Retornar null si es válido
  }

    // Función para validar que la fecha seleccionada no sea anterior al día de hoy
    validarFechaHoy(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } | null => {
        const selectedDate = new Date(control.value);
        const today = new Date();
        //console.log(this.fechaFormato.transform(today));
        //console.log(this.fechaFormato.transform(selectedDate));
        
        if (this.fechaFormato.transform(selectedDate)> this.fechaFormato.transform(today)) {
          return { 'fechaAnterior': true }; // Retorna un error si la fecha es anterior al día de hoy
        }
        return null; // Retorna null si la fecha es válida
      };
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
      (x) => x.descripcion.toLowerCase().indexOf(v.toLowerCase()) !== -1
    );
  }

  // delete user...
  deleteDato(accion: number, id: number): void {
    if (!this.permisos.evaluoPermisoAccionUsuario(accion, this.seccion)) {
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
    let importe_mn_calc =  0;
    let importe_tr_calc = 0;



    
    if (dato != null) {
      if (dato.id_moneda === 1) {

        importe_mn_calc = dato.importe_mo;
        importe_tr_calc = dato.importe_mo / dato.tc;
  
      } else if (dato.id_moneda === 2) {
        
        importe_mn_calc = dato.importe_mo;
        importe_tr_calc = dato.importe_mo * dato.tc;
      }
      /////////////////CAMBIAR ACA/////////////////////////////
      //console.log(tipoCambio)
      this.DatoDetail = dato;
      this.editDato?.patchValue({

    //
  

      //importe_mn
      //importe_tr
      //tc






        fecha: dato.fecha,
        id_tipo_gasto: dato.id_tipo_gasto,
        descripcion: dato.descripcion,
        cod_docum:'reggasto',
        id_empresa:this.empresas.id,
        id_titular:0,
        tc:dato.tc,
        id_moneda:dato.id_moneda,
        importe_mo: dato.importe_mo,
        importe_mn: importe_mn_calc,
        importe_tr: importe_tr_calc
      



        
      });
    }
  }

  // on submit data rom model...

  onSubmit() {
    this.submitted = true;

    let importe_mn_calc =  0;
    let importe_tr_calc = 0;






    if (this.filterArray != null && this.DatoDetail) {
        const index = this.filterArray.indexOf(this.DatoDetail);

        if (this.editDato != null) {
            const fechaFormateadaBD = this.datePipe.transform(this.editDato.get('fecha')?.value);
            this.DatoDetail.fecha = fechaFormateadaBD;

            this.DatoDetail.id_tipo_gasto = parseInt(this.editDato.get('id_tipo_gasto')?.value);
            this.DatoDetail.descripcion = (this.editDato.get('descripcion')?.value);
            this.DatoDetail.cod_docum = 'reggasto';
            this.DatoDetail.id_empresa = this.empresas.id;
            this.DatoDetail.tc =(this.editDato.get('tc')?.value);
            this.DatoDetail.id_moneda = parseInt(this.editDato.get('id_moneda')?.value);
            this.DatoDetail.id_titular=0;
            this.DatoDetail.importe_mo=this.editDato.get('importe_mo')?.value;


            if (this.DatoDetail.id_moneda === 1) {

              importe_mn_calc = this.DatoDetail.importe_mo;
              importe_tr_calc = this.DatoDetail.importe_mo / this.DatoDetail.tc;
        
            } else if (this.DatoDetail.id_moneda=== 2) {
 
              importe_mn_calc = this.DatoDetail.importe_mo;
              importe_tr_calc = this.DatoDetail.importe_mo * this.DatoDetail.tc;

       
            }

            this.DatoDetail.importe_mn=importe_mn_calc;
            this.DatoDetail.importe_tr=importe_tr_calc;

        }

        this.Datoservice.updateDato(this.DatoDetail.id, this.DatoDetail)
            .subscribe(
                (dato) => {
                    this.filterArray[index] = dato;
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'Los datos se han actualizado correctamente.'
                    });
                },
                (error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error al actualizar los datos.'
                    });
                }
            );
    } else {
        this.DatoDetail = new Datos();

        if (this.filterArray) {
            this.DatoDetail.id = Math.max.apply(Math, this.filterArray.map(function (o) {
                return o.id;
            })) + 1;
        }

        const fechaFormateadaBD = this.datePipe.transform(this.editDato.get('fecha')?.value);
        this.DatoDetail.fecha = fechaFormateadaBD;

        this.DatoDetail.id_tipo_gasto = parseInt(this.editDato.get('id_tipo_gasto')?.value);
        this.DatoDetail.descripcion = (this.editDato.get('descripcion')?.value);
        this.DatoDetail.cod_docum = 'reggasto';
        this.DatoDetail.id_empresa = this.empresas.id;
        this.DatoDetail.tc =(this.editDato.get('tc')?.value);
        this.DatoDetail.id_moneda = parseInt(this.editDato.get('id_moneda')?.value);
        this.DatoDetail.id_titular=0;
        this.DatoDetail.importe_mo=this.editDato.get('importe_mo')?.value;


        if (this.DatoDetail.id_moneda === 1) {

          importe_mn_calc = this.DatoDetail.importe_mo;
          importe_tr_calc = this.DatoDetail.importe_mo / this.DatoDetail.tc;
    
        } else if (this.DatoDetail.id_moneda=== 2) {

          importe_mn_calc = this.DatoDetail.importe_mo;
          importe_tr_calc = this.DatoDetail.importe_mo * this.DatoDetail.tc;

   
        }

        this.DatoDetail.importe_mn=importe_mn_calc;
        this.DatoDetail.importe_tr=importe_tr_calc;


        // Eliminar la propiedad 'observaciones' del objeto
        delete this.DatoDetail.observaciones;

        // Eliminar la propiedad 'id_articulo' del objeto
        delete this.DatoDetail.id_articulo;


        // Eliminar la propiedad 'id_articulo' del objeto
        delete this.DatoDetail.cantidad;


        this.Datoservice.addDato(this.DatoDetail as Datos)
            .subscribe(
                (dato) => {


                    if (dato.status === 'success') {
                      
                      this.filterArray = [...this.filterArray, dato.data];
                      this.filterArray.sort((a, b) => b.id - a.id);
                      // Mostrar mensaje de éxito
                      this.showSuccessMessage('Los datos se han actualizado correctamente.');
                  } else {
                      // Mostrar mensaje de error
                      let mensajeError =dato.message;
                      this.showErrorMessage(dato.message);
                      //this.showErrorMessage(mensajeError);
                  }



                },
                (error) => {
                  // Mostrar mensaje de error
                  this.showErrorMessage('Hubo un error al actualizar los datos.');
              }
            );




    }
    this.modalService.dismissAll();
    this.DatoDetail = null;
    this.ngOnInit();
}

// close model...
closeBtnClick() {
    this.modalService.dismissAll();
    this.ngOnInit();
}
showSuccessMessage(message: string) {
  Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: message
  });
}

showErrorMessage(message: string) {
  Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message
  });
}
}
function imprimoMensajeError(title: string, text: string) {
  Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: false,
  })
}