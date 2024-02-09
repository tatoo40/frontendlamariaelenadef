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
import { Datos } from './pasturas_x_potrero';
import { PasturasXPotreroService } from './pasturas_x_potrero.service'; 
import { FeatherModule } from 'angular-feather';
import { DdMmYYYYDatePipe } from 'src/app/dd-mm-yyyy-date.pipe';
import Swal from 'sweetalert2';
import { PermisosAccionService } from 'src/app/services/permisos-accion.service';
import { CtrlTrans } from 'src/app/services/ctrl-trans.service';
import { UtilesServices } from 'src/app/services/utiles-service';

const appDatoSelector='app-pasturas_x_potrero';

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
  templateUrl: './pasturas_x_potrero.component.html',
  styleUrls: ['./pasturas_x_potrero.component.css'],
})
export class PasturasXPotreroComponent implements OnInit {
  // INSTANCIO FORMULARIO Y SUS DATOS///////////////////////////////////////////////
 
  submitted = false;

  DatoList: Datos[] = [];
  filterArray: Datos[] = [];
  DatoDetail: Datos | null = null;


  ///OBTENGO DATOS DE LA SECCION QUE ESTOY TRABAJANDO////////////
  secciones = JSON.parse(localStorage.getItem('seccion'));

  empresas= JSON.parse(localStorage.getItem('empresas'));
  sectores = JSON.parse(localStorage.getItem('sector'));
  pasturas = JSON.parse(localStorage.getItem('pasturas'));

  nombreSeccion = 'Pasturas por potrero';
  nombreSeccionTabla = 'pasturas_x_sector';
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
  fecha_estimada_fin_pastoreo: Date;

  constructor(
    ///////////////////////////////////////////CAMBIAR ACA////////////////////////
    private Datoservice: PasturasXPotreroService,
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
      descripcion: ['', Validators.required],
      observaciones: [''],
      fecha_siembra:['', Validators.required],
      fecha_pastoreo:['', Validators.required],
      fecha_estimada_fin_pastoreo:['', Validators.required],
      fecha_fin_pastoreo:[''],
      id_pastura:['', Validators.required],      
      id_sector:['', Validators.required],   
       
 



    });


  }

  // Función para sumar días a la fecha de "fecha_pastoreo"
  sumarDiasAFecha(fecha: Date, dias: number): Date {
    const resultado = new Date(fecha);
    resultado.setDate(resultado.getDate() + dias);
    return resultado;
  }

  // Función para inicializar la fecha de "fecha_estimada_fin_pastoreo"
  inicializarFechaEstimadaFinPastoreo() {
    const diasEstimados = 30; // Cambiar el número de días estimados según necesites
    const fechaPastoreo = this.editDato.get('fecha_pastoreo').value;

    if (fechaPastoreo) {
      this.fecha_estimada_fin_pastoreo = this.sumarDiasAFecha(new Date(fechaPastoreo), diasEstimados);
    }
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
        


        descripcion: dato.descripcion,
        observaciones: dato.observaciones,
        fecha_siembra: dato.fecha_siembra,
        fecha_pastoreo: dato.fecha_pastoreo,
        fecha_estimada_fin_pastoreo: dato.fecha_estimada_fin_pastoreo,
        fecha_fin_pastoreo: dato.fecha_fin_pastoreo,
        id_pastura: dato.id_pastura,    
        id_sector: dato.id_sector,
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

        const fechaFormateadaSiembraBD = this.datePipe.transform(this.editDato.get('fecha_siembra')?.value);
        const fechaFormateadaPastoreoBD = this.datePipe.transform(this.editDato.get('fecha_pastoreo')?.value);
        const fechaFormateadaFinEstimadaPastoreoBD = this.datePipe.transform(this.editDato.get('fecha_estimada_fin_pastoreo')?.value);
        const fechaFormateadaFinPastoreoBD = this.datePipe.transform(this.editDato.get('fecha_fin_pastoreo')?.value);


        this.DatoDetail.descripcion = this.editDato.get('descripcion')?.value;
        this.DatoDetail.observaciones = this.editDato.get('observaciones')?.value;
        this.DatoDetail.fecha_siembra = fechaFormateadaSiembraBD;
        this.DatoDetail.fecha_pastoreo = fechaFormateadaPastoreoBD
        this.DatoDetail.fecha_estimada_fin_pastoreo = fechaFormateadaFinEstimadaPastoreoBD
        this.DatoDetail.fecha_fin_pastoreo = fechaFormateadaFinPastoreoBD
        this.DatoDetail.id_pastura= this.editDato.get('id_pastura')?.value;
        this.DatoDetail.id_sector= this.editDato.get('id_sector')?.value;
        this.DatoDetail.id_empresa= this.empresas.id

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

 
          const fechaFormateadaSiembraBD = this.datePipe.transform(this.editDato.get('fecha_siembra')?.value);
          const fechaFormateadaPastoreoBD = this.datePipe.transform(this.editDato.get('fecha_pastoreo')?.value);
          const fechaFormateadaFinEstimadaPastoreoBD = this.datePipe.transform(this.editDato.get('fecha_estimada_fin_pastoreo')?.value);
          const fechaFormateadaFinPastoreoBD = this.datePipe.transform(this.editDato.get('fecha_fin_pastoreo')?.value);
  

/////////////////CAMBIAR ACA/////////////////////////////
      this.DatoDetail.descripcion = this.editDato.get('descripcion')?.value;
      this.DatoDetail.observaciones = this.editDato.get('observaciones')?.value;
      this.DatoDetail.fecha_siembra = fechaFormateadaSiembraBD;
      this.DatoDetail.fecha_pastoreo = fechaFormateadaPastoreoBD
      this.DatoDetail.fecha_estimada_fin_pastoreo = fechaFormateadaFinEstimadaPastoreoBD
      this.DatoDetail.fecha_fin_pastoreo = fechaFormateadaFinPastoreoBD
      this.DatoDetail.id_pastura= this.editDato.get('id_pastura')?.value;
      this.DatoDetail.id_sector= this.editDato.get('id_sector')?.value;
      this.DatoDetail.id_empresa= this.empresas.id

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
