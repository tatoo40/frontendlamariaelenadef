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
import { Datos } from './titulares';
import { TitularesService } from './titulares.service'; 
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
  templateUrl: './titulares.component.html',
  styleUrls: ['./titulares.component.css'],
})
export class TitularesComponent implements OnInit {
  // INSTANCIO FORMULARIO Y SUS DATOS///////////////////////////////////////////////
 
  submitted = false;

  DatoList: Datos[] = [];
  filterArray: Datos[] = [];
  DatoDetail: Datos | null = null;


  ///OBTENGO DATOS DE LA SECCION QUE ESTOY TRABAJANDO////////////
  secciones = JSON.parse(localStorage.getItem('seccion'));
  categorias_cliente= JSON.parse(localStorage.getItem('catelgoria_cli'));
  categorias_prov= JSON.parse(localStorage.getItem('categoria_prov'));
  tipos_titulares= JSON.parse(localStorage.getItem('tipo_titular'));
  usuario = JSON.parse(localStorage.getItem('usuario_contectado'));


  empresas= JSON.parse(localStorage.getItem('empresas'));


  nombreSeccion = 'titulares';
  seccionTrabajo = this.secciones.filter(
    (seccion) => seccion.tabla === this.nombreSeccion
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

  constructor(
    ///////////////////////////////////////////CAMBIAR ACA////////////////////////
    private Datoservice: TitularesService,
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
      nombre_fantasia: ['', Validators.required],
      direccion: ['', Validators.required],
      email: ['', Validators.required],
      rut: ['', Validators.required],
      nombre_contacto: ['', Validators.required],
      observaciones: [''],
      razon_social : ['', Validators.required],
      telefono_contacto : ['', Validators.required],
      id_tipo_titular: ['', Validators.required],
      id_categoria_prov: ['', Validators.required],
      id_categoria_cliente: ['', Validators.required],
  
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
      (x) => x.nombre_fantasia.toLowerCase().indexOf(v.toLowerCase()) !== -1
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
        nombre_fantasia: dato.nombre_fantasia,
        direccion: dato.direccion,
        email: dato.email,
        rut: dato.rut,
        nombre_contacto: dato.nombre_contacto,
        observaciones:dato.observaciones,
        razon_social: dato.razon_social,
        telefono_contacto: dato.telefono_contacto,
        id_tipo_titular: dato.id_tipo_titular,
        id_categoria_prov: dato.id_categoria_prov,
        id_categoria_cliente: dato.id_categoria_cliente,     
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
        this.DatoDetail.nombre_fantasia = this.editDato.get('nombre_fantasia')?.value;
        this.DatoDetail.direccion= this.editDato.get('direccion')?.value;
        this.DatoDetail.email= this.editDato.get('email')?.value;
        this.DatoDetail.rut= this.editDato.get('rut')?.value;
        this.DatoDetail.nombre_contacto= this.editDato.get('nombre_fantasia')?.value;
        this.DatoDetail.observaciones= this.editDato.get('nombre_contacto')?.value;
        this.DatoDetail.razon_social= this.editDato.get('razon_social')?.value;
        this.DatoDetail.telefono_contacto= this.editDato.get('telefono_contacto')?.value;
        this.DatoDetail.id_tipo_titular= this.editDato.get('id_tipo_titular')?.value;
        this.DatoDetail.id_categoria_prov= this.editDato.get('id_categoria_prov')?.value;
        this.DatoDetail.id_categoria_cliente= this.editDato.get('id_categoria_cliente')?.value; 
        this.DatoDetail.id_empresa= this.empresas.id 
        this.DatoDetail.id_mod= this.usuario.id_mod

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
        this.DatoDetail.nombre_fantasia = this.editDato.get('nombre_fantasia')?.value;
        this.DatoDetail.direccion= this.editDato.get('direccion')?.value;
        this.DatoDetail.email= this.editDato.get('email')?.value;
        this.DatoDetail.rut= this.editDato.get('rut')?.value;
        this.DatoDetail.nombre_contacto= this.editDato.get('nombre_fantasia')?.value;
        this.DatoDetail.observaciones= this.editDato.get('nombre_contacto')?.value;
        this.DatoDetail.razon_social= this.editDato.get('razon_social')?.value;
        this.DatoDetail.telefono_contacto= this.editDato.get('telefono_contacto')?.value;
        this.DatoDetail.id_tipo_titular= this.editDato.get('id_tipo_titular')?.value;
        this.DatoDetail.id_categoria_prov= this.editDato.get('id_categoria_prov')?.value;
        this.DatoDetail.id_categoria_cliente= this.editDato.get('id_categoria_cliente')?.value; 
        this.DatoDetail.id_empresa= this.empresas.id;
        this.DatoDetail.id_mod= this.usuario.id_mod;
   

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
