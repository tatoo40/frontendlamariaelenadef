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
import { TipoCambioDiario } from './tipo-cambio-diario';
import { TipoCambioDiarioRxjsServiceService } from './tipo-cambio-diario-rxjs-service.service';
import { FeatherModule } from 'angular-feather';
import { DdMmYYYYDatePipe } from 'src/app/dd-mm-yyyy-date.pipe';
import Swal from 'sweetalert2';
import { PermisosAccionService } from 'src/app/services/permisos-accion.service';
import { CtrlTrans } from 'src/app/services/ctrl-trans.service';
import { UtilesServices } from 'src/app/services/utiles-service';


@Component({
  selector: 'app-tipo-cambio-diario',
  standalone: true,
  imports: [
    CommonModule,
    FeatherModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
  ],
  templateUrl: './tipo-cambio-diario.component.html',
  styleUrls: ['./tipo-cambio-diario.component.css'],
})
export class TipoCambioDiarioComponent implements OnInit {
  form: FormGroup = new FormGroup({
    fecha: new FormControl(''),
    id_moneda: new FormControl(''),
    valor: new FormControl(''),
  });
  submitted = false;

  tipoCambioDiarioList: TipoCambioDiario[] = [];
  filterArray: TipoCambioDiario[] = [];
  tipoCambioDiarioDetail: TipoCambioDiario | null = null;

  secciones = JSON.parse(localStorage.getItem('seccion'));
  nombreSeccion = 'tipo_cambio_diario';
  seccionTrabajo = this.secciones.filter(
    (seccion) => seccion.tabla === this.nombreSeccion
  );
  seccion = this.seccionTrabajo[0].id;

  config: any;
  editTipoCambioDiario: UntypedFormGroup | any;

  fecha: string | null = null;

  monedas = JSON.parse(localStorage.getItem('moneda'));

  page = 1;
  pageSize = 7;

  _searchTerm = '';
  StackMoment: string | null = null;
  stack: string | null = null;
  stacktConvert: any | null = null;

  constructor(
    private tipoCambioDiarioService: TipoCambioDiarioRxjsServiceService,
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private datePipe: DdMmYYYYDatePipe,
    private formBuilder: FormBuilder,
    private permisos: PermisosAccionService,
    private evaluoTrans: CtrlTrans,
    private utiles:UtilesServices
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      id_moneda: ['', Validators.required],
      fecha: ['', Validators.required, this.utiles.fechaValidator],
      valor: ['', Validators.required],
    });

    this.editTipoCambioDiario = this.fb.group({
      id: [''],
      id_moneda: ['', Validators.required],
      valor: ['', Validators.required],
      fecha: ['', Validators.required, this.utiles.fechaValidator],
    });

    this.getTipoCambio();
  }
  filteredTipoCambios: any[] = [];

  filterTipoCambios() {
    this.filteredTipoCambios = this.filterArray.filter(tipoCambio => {
      const fecha = tipoCambio.fecha;
      return fecha;
    });
  }

  getTipoCambio(): void {
    if (!this.permisos.evaluoPermisoAccionUsuario(4, this.seccion)) {
      imprimoMensajeError(
        'Accion no autorizada',
        'Usted no tiene permisos para realizar esta accion. Contactese con el administrador'
      );
      return;
    } else {
      var array = this.tipoCambioDiarioService
        .getTipoCambio()
        .subscribe((tc) => (this.filterArray = tc));
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
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
    return this.tipoCambioDiarioList.filter(
      (x) => x.id !== -1
      //x.id.toLowerCase().indexOf(v.toLowerCase()) !== -1 ||
      //x.valor.toLowerCase().indexOf(v.toLowerCase()) !== -1
    );
  }

  // delete user...
  deleteTipoCambio(accion: number, id: number): void {
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
                (tipoCambio) => tipoCambio.id !== id
              );
              this.tipoCambioDiarioService.deleteTipoCambio(id).subscribe();
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
    editTipoCambioModal: any,
    tipoCambio: TipoCambioDiario | null
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
        this.openModal(editTipoCambioModal, tipoCambio);
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
          this.openModal(editTipoCambioModal, tipoCambio);
        }
      }
    }
  }

  // open model...
  openModal(editTipoCambioModal: any, tipoCambio: TipoCambioDiario | null) {
    this.modalService.open(editTipoCambioModal, {
      centered: true,
      backdrop: 'static',
    });

    if (tipoCambio != null) {
      if (tipoCambio.fecha) {
        const fechaFormateo = new Date(tipoCambio.fecha)
          .toISOString()
          .substring(0, 10);
        ///this.segundoPasoForm.controls['fecha'].setValue(currentDate);

        this.fecha = fechaFormateo;
      }

      //console.log(tipoCambio)
      this.tipoCambioDiarioDetail = tipoCambio;
      this.editTipoCambioDiario?.patchValue({
        id_moneda: tipoCambio.id_moneda,
        valor: tipoCambio.valor,
        fecha: tipoCambio.fecha,
      });
    }
  }

  // on submit data rom model...
  onSubmit() {
    //this.submitted = true;

    if (this.filterArray != null && this.tipoCambioDiarioDetail) {
      const index = this.filterArray.indexOf(this.tipoCambioDiarioDetail);

      if (this.editTipoCambioDiario != null) {
        this.tipoCambioDiarioDetail.valor =
          this.editTipoCambioDiario.get('valor')?.value;
        this.tipoCambioDiarioDetail.id_moneda =
          this.editTipoCambioDiario.get('id_moneda')?.value;


        const fechaFormateadaBD = this.datePipe.transform(
          this.editTipoCambioDiario.get('fecha')?.value
        );

        this.tipoCambioDiarioDetail.fecha = fechaFormateadaBD;
      }

      this.tipoCambioDiarioService
        .updateTipoCambio(
          this.tipoCambioDiarioDetail.id,
          this.tipoCambioDiarioDetail
        )
        .subscribe((tc) => {
          this.filterArray[index] = tc;
        });
    } else {
      this.tipoCambioDiarioDetail = new TipoCambioDiario();

      if (this.filterArray)
        this.tipoCambioDiarioDetail.id =
          Math.max.apply(
            Math,
            this.filterArray.map(function (o) {
              return o.id;
            })
          ) + 1;

      this.tipoCambioDiarioDetail.valor =
        this.editTipoCambioDiario?.get('valor')?.value;
      this.tipoCambioDiarioDetail.id_moneda =
        this.editTipoCambioDiario?.get('id_moneda')?.value;
      this.tipoCambioDiarioDetail.fecha = new Date();

      this.tipoCambioDiarioService
        .addTipoCambio(this.tipoCambioDiarioDetail as TipoCambioDiario)
        .subscribe((tc) => {
          //console.log(tc)
          this.filterArray.push(tc);
        });
    }
    this.modalService.dismissAll();
    this.tipoCambioDiarioDetail = null;

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
