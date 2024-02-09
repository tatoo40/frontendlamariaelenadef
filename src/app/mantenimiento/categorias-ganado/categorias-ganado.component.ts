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
import { Datos } from './categorias-ganado';
import { CategoriasGanadoService } from './categorias-ganado.service'; 
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
  templateUrl: './categorias-ganado.component.html',
  styleUrls: ['./categorias-ganado.component.css'],
})
export class CategoriasGanadoComponent implements OnInit {
  // INSTANCIO FORMULARIO Y SUS DATOS///////////////////////////////////////////////
 
  submitted = false;

  DatoList: Datos[] = [];
  filterArray: Datos[] = [];
  DatoDetail: Datos | null = null;


  ///OBTENGO DATOS DE LA SECCION QUE ESTOY TRABAJANDO////////////
  secciones = JSON.parse(localStorage.getItem('seccion'));
  tipos_ganado = JSON.parse(localStorage.getItem('tipo_ganado'));


  empresas= JSON.parse(localStorage.getItem('empresas'));


  nombreSeccion = 'Categorias ganado';
  nombreSeccionTabla = 'categorias_ganado';
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
  Hembra:string = 'Hembra';
  Macho:string = 'Macho';

  constructor(
    ///////////////////////////////////////////CAMBIAR ACA////////////////////////
    private Datoservice: CategoriasGanadoService,
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
      id_tipo_ganado: ['', Validators.required],
      cantidad_dientes:['', Validators.required],
      rango_dia_inicio:['', Validators.required],
      rango_dia_fin:['', Validators.required],
      abreviacion:['', Validators.required],   
      sexo:['',Validators.required]     
  
    });

    //this.getDato();
  }
  // filteredDatos: any[] = [];

  // filterDatos() {
  //   this.filteredDatos = this.filterArray.filter(dato => {
  //     const nombre = dato.descripcion;
  //     return nombre;
  //   });
  // }

 /*  getDato(): void {
    if (!this.permisos.evaluoPermisoAccionUsuario(4, this.seccion)) {
      imprimoMensajeError(
        'Accion no autorizada',
        'Usted no tiene permisos para realizar esta accion. Contactese con el administrador'
      );
      return;
    } else {
      
      var array = this.Datoservice
        .getDato()
        .subscribe((dato) => (this.filterArray = dato));
    }
  } */



  
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

    if (dato != null) {

      /////////////////CAMBIAR ACA/////////////////////////////
      //console.log(tipoCambio)
      this.DatoDetail = dato;
      this.editDato?.patchValue({
        descripcion: dato.descripcion,
        id_tipo_ganado:dato.id_tipo_ganado,
        cantidad_dientes:dato.cantidad_dientes,
        rango_dia_inicio:dato.rango_dia_inicio,   
        rango_dia_fin:dato.rango_dia_fin,
        abreviacion:dato.abreviacion,
        sexo:dato.sexo
        
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
        this.DatoDetail.descripcion = this.editDato.get('descripcion')?.value;
        this.DatoDetail.id_tipo_ganado= this.editDato.get('id_tipo_ganado')?.value;
        this.DatoDetail.cantidad_dientes = parseInt(this.editDato.get('cantidad_dientes')?.value);
        this.DatoDetail.rango_dia_inicio= parseInt(this.editDato.get('rango_dia_inicio')?.value);
        this.DatoDetail.rango_dia_fin = parseInt(this.editDato.get('rango_dia_fin')?.value);
        this.DatoDetail.abreviacion = this.editDato.get('abreviacion')?.value;
        this.DatoDetail.sexo = this.editDato.get('sexo')?.value;

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
      this.DatoDetail.descripcion = this.editDato.get('descripcion')?.value;
      this.DatoDetail.id_tipo_ganado= this.editDato.get('id_tipo_ganado')?.value;
      this.DatoDetail.cantidad_dientes = parseInt(this.editDato.get('cantidad_dientes')?.value);
      this.DatoDetail.rango_dia_inicio= parseInt(this.editDato.get('rango_dia_inicio')?.value);
      this.DatoDetail.rango_dia_fin = parseInt(this.editDato.get('rango_dia_fin')?.value);
      this.DatoDetail.abreviacion = this.editDato.get('abreviacion')?.value;
      this.DatoDetail.sexo = this.editDato.get('sexo')?.value;


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
