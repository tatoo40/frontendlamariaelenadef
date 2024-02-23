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
import { Datos } from './articulos';
import { ArticulosService } from './articulos.service'; 
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
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.css'],
})
export class ArticulosComponent implements OnInit {
  // INSTANCIO FORMULARIO Y SUS DATOS///////////////////////////////////////////////
 
  submitted = false;

  DatoList: Datos[] = [];
  filterArray: Datos[] = [];
  DatoDetail: Datos | null = null;


  ///OBTENGO DATOS DE LA SECCION QUE ESTOY TRABAJANDO////////////
  secciones = JSON.parse(localStorage.getItem('seccion'));
  marcas_ganado= JSON.parse(localStorage.getItem('marca_ganado'));
  categorias_ganado= JSON.parse(localStorage.getItem('categoria_ganado'));
  tipos_articulo= JSON.parse(localStorage.getItem('tipo_articulo'));
  unidades_stock= JSON.parse(localStorage.getItem('unidades'));
  tasas_iva= JSON.parse(localStorage.getItem('tasas_iva'));
  usuario = JSON.parse(localStorage.getItem('usuario_contectado'));


  empresasSel= JSON.parse(localStorage.getItem('empresas'));
  empresas = this.empresasSel[0]

  nombreSeccion = 'Articulos';
  nombreSeccionTabla = 'articulos';
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

  constructor(
    ///////////////////////////////////////////CAMBIAR ACA////////////////////////
    private Datoservice: ArticulosService,
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
      nombre: ['', Validators.required],
      cod_articulo: ['', Validators.required],
      id_categoria_ganado: ['', Validators.required],
      id_marca_ganado: ['', Validators.required],
      id_tipo_articulo: ['', Validators.required],  
      id_unidad_stk: ['', Validators.required], 
      id_unidad_cmp: ['', Validators.required], 
      id_unidad_vta: ['', Validators.required], 
      factor_conv_cmp_a_stk: ['', Validators.required], 
      id_tasa_iva_cmp: ['', Validators.required], 
      id_tasa_iva_vta: ['', Validators.required], 

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

  filter(v: string) {
    return this.DatoList.filter(
      (x) => x.nombre.toLowerCase().indexOf(v.toLowerCase()) !== -1
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

        nombre: dato.nombre,
        cod_articulo: dato.cod_articulo,
        id_unidad_stk: dato.id_unidad_stk,
        id_categoria_ganado: dato.id_categoria_ganado,
        id_marca_ganado: dato.id_marca_ganado,
        id_tipo_articulo:dato.id_tipo_articulo,
        id_unidad_cmp:dato.id_unidad_cmp,
        id_unidad_vta: dato.id_unidad_vta,
        factor_conv_cmp_a_stk: dato.factor_conv_cmp_a_stk,
        id_tasa_iva_cmp: dato.id_tasa_iva_cmp,
        id_tasa_iva_vta: dato.id_tasa_iva_vta,
        
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
        this.DatoDetail.nombre = this.editDato.get('nombre')?.value;
        this.DatoDetail.cod_articulo= this.editDato.get('cod_articulo')?.value;
        this.DatoDetail.id_unidad_stk= this.editDato.get('id_unidad_stk')?.value;
        this.DatoDetail.id_categoria_ganado= this.editDato.get('id_categoria_ganado')?.value;
        this.DatoDetail.id_marca_ganado= this.editDato.get('id_marca_ganado')?.value;
        this.DatoDetail.id_tipo_articulo= this.editDato.get('id_tipo_articulo')?.value;
        this.DatoDetail.id_empresa= this.empresas.id 
        this.DatoDetail.id_unidad_cmp= this.editDato.get('id_unidad_cmp')?.value;
        this.DatoDetail.id_unidad_vta= this.editDato.get('id_unidad_vta')?.value;
        this.DatoDetail.factor_conv_cmp_a_stk= this.editDato.get('factor_conv_cmp_a_stk')?.value;
        this.DatoDetail.id_tasa_iva_cmp= this.editDato.get('id_tasa_iva_cmp')?.value;
        this.DatoDetail.id_tasa_iva_vta= this.editDato.get('id_tasa_iva_vta')?.value;

 

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
        this.DatoDetail.nombre = this.editDato.get('nombre')?.value;
        this.DatoDetail.cod_articulo= this.editDato.get('cod_articulo')?.value;
        this.DatoDetail.id_unidad_stk= this.editDato.get('id_unidad_stk')?.value;
        this.DatoDetail.id_categoria_ganado= this.editDato.get('id_categoria_ganado')?.value;
        this.DatoDetail.id_marca_ganado= this.editDato.get('id_marca_ganado')?.value;
        this.DatoDetail.id_tipo_articulo= this.editDato.get('id_tipo_articulo')?.value;
        this.DatoDetail.id_empresa= this.empresas.id 
        this.DatoDetail.id_unidad_cmp= this.editDato.get('id_unidad_cmp')?.value;
        this.DatoDetail.id_unidad_vta= this.editDato.get('id_unidad_vta')?.value;
        this.DatoDetail.factor_conv_cmp_a_stk= this.editDato.get('factor_conv_cmp_a_stk')?.value;
        this.DatoDetail.id_tasa_iva_cmp= this.editDato.get('id_tasa_iva_cmp')?.value;
        this.DatoDetail.id_tasa_iva_vta= this.editDato.get('id_tasa_iva_vta')?.value;


        console.log(this.DatoDetail);
   

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
