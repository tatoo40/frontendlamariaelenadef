import { Component, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  UntypedFormArray,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  FormBuilder,
  AbstractControl,
} from '@angular/forms';

import {  RomaneoList , lineaRomaneo } from '../romaneo';
import { IngresoRomaneoService } from '../ingreso-romaneo.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DdMmYYYYDateSoloHoraCeroPipe } from 'src/app/dd-mm-yyyy-date-solo-hora-cero.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'agregar-ingreso-romaneo',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './agregar-ingreso-romaneo.component.html',
  styleUrls: ['./agregar-ingreso-romaneo.component.css'],
})
export class AgregarIngresoRomaneoComponent implements OnInit {


  submitted = false;
  addForm: any;
  rows: UntypedFormArray;
  invoice: RomaneoList = new RomaneoList();

  
  invoiceForm: FormGroup;
  
  ///////////////////////////////////////////////////////////
  importe_mo = 0;
  importe_iva_mo = 0;
  importe_total_mo = 0;
  obtengoIngresoRomaneo: RomaneoList[];
  clientes: any;
  articulos: any;
  fechaHoy:Date=new Date();

  clienteSeleccionado: any = {
    razon_social: '',
    rut: '',
    direccion: '',
    email: '',
    telefono_contacto: '',
  };

  clienteDatos = JSON.parse(localStorage.getItem('titular'));
  monedas = JSON.parse(localStorage.getItem('moneda'));
  empresaSel = JSON.parse(localStorage.getItem('empresas'));
  empresa = this.empresaSel[0];
  arrayTc = JSON.parse(localStorage.getItem('tipo_cambio_diario'));
  arrayParametros = JSON.parse(localStorage.getItem('cpt_parametros_x_fecha'));


  fechaBuscada = this.formatoFechaBd.transform(new Date());

  tipoCambioBuscado = this.arrayTc.find(
   (tipoCambioBuscado) => this.formatoFechaBd.transform(tipoCambioBuscado.fecha) === this.fechaBuscada
  );
 
  precioUnitarioCuartaBalanza = this.arrayParametros.find(
   (precioUnitarioCuartaBalanza) => this.formatoFechaBd.transform(precioUnitarioCuartaBalanza.fecha) === this.fechaBuscada
  );



  lotes: any;
 
  S: string = "S"; // Declaración y asignación de la propiedad 'S'
  N: string = "N"; // Declaración y asignación de la propiedad 'S'
  constructor(
    private fb: UntypedFormBuilder,
    private ingresoRomaneoService: IngresoRomaneoService,
    private router: Router,
    private formatoFechaBd: DdMmYYYYDateSoloHoraCeroPipe,
    private formBuilder: FormBuilder
  ) {
    
    this.initializeForm()


    this.ingresoRomaneoService.getRomaneos().subscribe((dato) => {
          
            this.obtengoIngresoRomaneo = dato;

            this.invoice.id =
             Math.max.apply(
              Math,
              this.obtengoIngresoRomaneo.map(function (o) {
                return o.id;
              })
            ) + 1;
          
        },
        (error) => {
          this.invoice.id = 1;
          console.error('Error fetching romaneos:', error);
        
    });

    this.addForm = this.fb.group({
      item: this.fb.array([this.itemControl()]),
    });

    this.fillAddControls();

    this.ingresoRomaneoService.getClientes().subscribe((dato) => {
      this.clientes = dato;
    });

    this.ingresoRomaneoService.getLotesDeSalida().subscribe((dato) => {
      this.lotes = dato;
    });

    
  //console.log(this.tipoCambioBuscado);
  //console.log(this.precioUnitarioCuartaBalanza);

    this.invoiceForm.get('tc')?.setValue(this.tipoCambioBuscado.valor);


    this.invoiceForm.get('precio_unitario_general')?.setValue(this.precioUnitarioCuartaBalanza.precio_vaca_cuarta_balanza);

   
  }


  itemControl(): UntypedFormGroup {
    return this.fb.group({
      cod_articulo: ['', Validators.required],
      nom_articulo: ['', Validators.required],
      cod_identidad: ['', Validators.required],
      peso_salida: ['0'],
      peso_primera: ['0'],
      peso_cuarta: ['0'],
    });
  }

  fillAddControls() {
    //this.addForm.setControl('item', this.setItem(this.invoice.lineasRomaneo));
  }

  setItem(order: any): UntypedFormArray {
    const fa = new UntypedFormArray([]);
    order[0].forEach((s: any) => {
      const peso_primera_calc = (s.cantidad2*this.invoiceForm.get('cantidad_kilos_declarados')?.value)/this.invoiceForm.get('cantidad_kilos_salida')?.value
      const peso_cuarta_calc = (s.cantidad2*this.invoiceForm.get('cantidad_kilos_cuarta_balanza')?.value)/this.invoiceForm.get('cantidad_kilos_salida')?.value

      fa.push(
        this.fb.group({

        
          cod_articulo: s.cod_articulo,
          nom_articulo: s.nombre_articulo,
          cod_identidad: s.cod_identidad,
          peso_salida: s.cantidad2,
          peso_primera: peso_primera_calc.toFixed(2),
          peso_cuarta: peso_cuarta_calc.toFixed(2),
        })

        
      );
    });
    return fa;
  }


  initializeForm(){


    this.invoiceForm = new FormGroup({

      id_titular: new FormControl,
      fecha: new FormControl,
      importe_mo_general: new FormControl,
      precio_general_unitario: new FormControl,
      serie_fact_prov: new FormControl,
      nro_fact_prov: new FormControl,
      id_moneda: new FormControl,
      tc: new FormControl,
      observaciones: new FormControl,
      nro_trans_ref: new FormControl,
      rut: new FormControl,
      direccion: new FormControl,
      email: new FormControl,
      telefono_contacto: new FormControl,
      nro_tropa: new FormControl,
      nro_romaneo: new FormControl,
      porcentaje_rendimiento: new FormControl,  
      cantidad_animales: new FormControl,  
      cantidad_kilos_declarados: new FormControl,
      cantidad_kilos_cuarta_balanza: new FormControl,
      cantidad_kilos_salida: new FormControl,  
      precio_unitario_general: new FormControl,  


    })


    this.invoiceForm = this.formBuilder.group({

      id_titular:['', Validators.required], 
      fecha:['', Validators.required],
      importe_mo_general:['', [Validators.required,this.nonZeroValidator]],
      id_moneda:['', Validators.required],
      tc:['', Validators.required],
      observaciones:[''],
      nro_trans_ref:['', Validators.required],
      rut:['', Validators.required],
      direccion:['', Validators.required],
      email:['', Validators.required],
      telefono_contacto:['', Validators.required],
      nro_tropa:[''],
      nro_romaneo:[''],
      porcentaje_rendimiento:['', Validators.required],  
      cantidad_animales:['', Validators.required],  
      cantidad_kilos_declarados:['', Validators.required], 
      cantidad_kilos_cuarta_balanza:['', Validators.required], 
      cantidad_kilos_salida:['', Validators.required], 
      precio_unitario_general:['']
    });
  }



  onLoteSelected() {
    const nroTransRef = this.invoiceForm.get('nro_trans_ref')?.value;

    //obtengo el nro_trans del lote de salida
    this.ingresoRomaneoService.getAnimalesLoteSalida(nroTransRef).subscribe((dato) => {
      //this.articulos = dato;
      this.invoiceForm.get('cantidad_animales')?.setValue(dato[0].length);


      const sumCantidad2 = dato[0].reduce((total, obj) => total + obj.cantidad2, 0);
      this.invoiceForm.get('cantidad_kilos_salida')?.setValue(sumCantidad2);


      console.log(sumCantidad2);

      this.addForm.setControl('item', this.setItem(dato));
    });

   
  }

  
  onClienteSelected() {
    const clienteId = this.invoiceForm.get('id_titular')?.value;
    //onsole.log(this.clienteDatos)
    this.clienteSeleccionado = this.clienteDatos.find(
      (cliente) => cliente.id === clienteId
    );

    this.invoiceForm.get('rut')?.setValue(this.clienteSeleccionado.rut);
    this.invoiceForm.get('telefono_contacto')?.setValue(this.clienteSeleccionado.telefono_contacto);
    this.invoiceForm.get('email')?.setValue(this.clienteSeleccionado.email);
    this.invoiceForm.get('direccion')?.setValue(this.clienteSeleccionado.direccion);


  
  }

  ngOnInit(): void {

  



  }
  get f(): { [key: string]: AbstractControl } {
    return this.invoiceForm.controls;
  }
  get id_titular() {
    return this.invoiceForm.get('id_titular');
  }
  get fecha() {
    return this.invoiceForm.get('fecha');
  }

  get id_moneda() {
    return this.invoiceForm.get('id_moneda');
  }

  get importe_mo_general() {
    return this.invoiceForm.get('importe_mo_general');
  }


  get nro_fact_prov() {
    return this.invoiceForm.get('nro_fact_prov');
  }
  get serie_fact_prov() {
    return this.invoiceForm.get('serie_fact_prov');
  }
  get tc() {
    return this.invoiceForm.get('tc');
  }

  get observaciones() {
    return this.invoiceForm.get('observaciones');
  }  
  get nro_trans_ref() {
    return this.invoiceForm.get('nro_trans_ref');
  }    
  get nro_tropa() {
    return this.invoiceForm.get('nro_tropa');
  }

  get nro_romaneo() {
    return this.invoiceForm.get('nro_romaneo');
  }  
  get porcentaje_rendimiento() {
    return this.invoiceForm.get('porcentaje_rendimiento');
  }    
  get cantidad_animales() {
    return this.invoiceForm.get('cantidad_animales');
  }    

  get cantidad_kilos_salida() {
    return this.invoiceForm.get('cantidad_kilos_salida');
  }  
  get cantidad_kilos_cuarta_balanza() {
    return this.invoiceForm.get('cantidad_kilos_cuarta_balanza');
  }    
  get cantidad_kilos_declarados() {
    return this.invoiceForm.get('cantidad_kilos_declarados');
  }    


  get precio_unitario_general() {
    return this.invoiceForm.get('precio_unitario_general');
  }   

  nonZeroValidator(control: FormControl) {
    const value = control.value;
    if (value !== 0) {
      return null; // El valor es válido
    } else {
      return { nonZero: true }; // El valor es cero, la validación falla
    }
  }


  ////////////////////////////////////////////////////////////////////////////////////
  onAddRow() {
    this.rows.push(this.createItemFormGroup());
  }

  onRemoveRow(rowIndex: number) {
    let totalCostOfItem =
      this.addForm.get('rows')?.value[rowIndex].precio_unitario *
      this.addForm.get('rows')?.value[rowIndex].cantidad;

    this.importe_mo = this.importe_mo - totalCostOfItem;
    this.importe_iva_mo = this.importe_iva_mo * 0.22;
    this.importe_total_mo = this.importe_mo + this.importe_iva_mo;

    this.rows.removeAt(rowIndex);
  }

  createItemFormGroup(): UntypedFormGroup {
    return this.fb.group({
      cod_articulo: ['', Validators.required],
      cantidad: ['', Validators.required],
      precio_unitario: ['', Validators.required],
      importe_mo: ['0'],
    });
  }
  itemsChangedKilos() {


    const nroTransRef = this.invoiceForm.get('nro_trans_ref')?.value;

    //obtengo el nro_trans del lote de salida
    this.ingresoRomaneoService.getAnimalesLoteSalida(nroTransRef).subscribe((dato) => {
      //this.articulos = dato;
      this.invoiceForm.get('cantidad_animales')?.setValue(dato[0].length);


      const sumCantidad2 = dato[0].reduce((total, obj) => total + obj.cantidad2, 0);
      this.invoiceForm.get('cantidad_kilos_salida')?.setValue(sumCantidad2);


      console.log(sumCantidad2);

      this.addForm.setControl('item', this.setItem(dato));
    
    })
  }

  itemsChanged() {
    let total: number = 0;

    for (
      let t = 0;
      t < (<UntypedFormArray>this.addForm.get('rows')).length;
      t++
    ) {
      if (
        this.addForm.get('rows')?.value[t].precio_unitario != '' &&
        this.addForm.get('rows')?.value[t].cantidad
      ) {
        total =
          this.addForm.get('rows')?.value[t].precio_unitario *
            this.addForm.get('rows')?.value[t].cantidad +
          total;
      }
    }
    this.importe_mo = total;
    this.importe_iva_mo = this.importe_mo * 0.22;
    this.importe_total_mo = this.importe_mo + this.importe_iva_mo;
  }

  ////////////////////////////////////////////////////////////////////

  saveDetail() {
    this.submitted = true;

    
    if (this.addForm.valid && this.invoiceForm.valid) {
      this.invoice.cod_docum = 'ingRomaneo';
      this.invoice.direccion = this.clienteSeleccionado.direccion;
      this.invoice.email = this.clienteSeleccionado.email;
      this.invoice.id_empresa = this.empresa.id;
      this.invoice.fecha = this.formatoFechaBd.transform(this.invoice.fecha);
      this.invoice.nombre_fantasia = this.empresa.nombre;
      this.invoice.rut = this.empresa.rut;
      this.invoice.razon_social = this.empresa.razon_social;
      this.invoice.telefono_contacto = this.empresa.telefono_contacto;

      
      this.invoice.importe_mo = this.invoiceForm.get('importe_mo_general')?.value;
      this.invoice.importe_total_mo =this.invoiceForm.get('importe_mo_general')?.value*1.22;
      this.invoice.importe_iva_mo = this.invoice.importe_total_mo-this.invoice.importe_mo ;


      this.invoice.observaciones =this.invoiceForm.get('observaciones')?.value;
      this.invoice.id_moneda = parseInt(this.invoiceForm.get('id_moneda')?.value);
      this.invoice.id_titular =this.invoiceForm.get('id_titular')?.value;


      this.invoice.nro_trans_ref =this.invoiceForm.get('nro_trans_ref')?.value;
      this.invoice.tc = parseFloat(this.invoiceForm.get('tc')?.value);
      this.invoice.nro_tropa = parseFloat(this.invoiceForm.get('nro_tropa')?.value);
      this.invoice.nro_romaneo = parseFloat(this.invoiceForm.get('nro_romaneo')?.value);
      this.invoice.porcentaje_rendimiento = parseFloat(this.invoiceForm.get('porcentaje_rendimiento')?.value);
      this.invoice.cantidad_animales = parseFloat(this.invoiceForm.get('cantidad_animales')?.value);
      this.invoice.cantidad_kilos_declarados = parseFloat(this.invoiceForm.get('cantidad_kilos_declarados')?.value);
      this.invoice.cantidad_kilos_cuarta_balanza = parseFloat(this.invoiceForm.get('cantidad_kilos_cuarta_balanza')?.value);
      this.invoice.cantidad_kilos_salida = parseFloat(this.invoiceForm.get('cantidad_kilos_salida')?.value);
      this.invoice.precio_unitario_general = parseFloat(this.invoiceForm.get('precio_unitario_general')?.value);




      if (this.invoice.id_moneda === 2) {
        //es en dolares

        this.invoice.importe_total_tr = this.invoice.importe_total_mo;
        this.invoice.importe_tr = this.invoice.importe_mo;
        this.invoice.importe_iva_tr = this.invoice.importe_iva_mo;

        this.invoice.importe_total_mn = this.invoice.importe_total_mo *  this.invoiceForm.get('tc')?.value;
        this.invoice.importe_mn = this.invoice.importe_mo * this.invoiceForm.get('tc')?.value;
        this.invoice.importe_iva_mn = this.invoice.importe_iva_mo * this.invoiceForm.get('tc')?.value;
      } else {
        this.invoice.importe_total_tr =  this.invoice.importe_total_mo / this.invoiceForm.get('tc')?.value;
        this.invoice.importe_tr =  this.invoice.importe_mo / this.invoiceForm.get('tc')?.value;
        this.invoice.importe_iva_tr =  this.invoice.importe_iva_mo / this.invoiceForm.get('tc')?.value;

        this.invoice.importe_total_mn = this.invoice.importe_total_mo;
        this.invoice.importe_mn = this.invoice.importe_mo
        this.invoice.importe_iva_mn = this.invoice.importe_iva_mo;
      }

      for (
        let t = 0;
        t < (<UntypedFormArray>this.addForm.get('item')).length;
        t++
      ) 
       {
        let o: lineaRomaneo = new lineaRomaneo();

        o.cantidad = 1
        o.cod_articulo = this.addForm.get('item')?.value[t].cod_articulo;
        o.precio_unitario = this.invoiceForm.get('precio_unitario_general')?.value;
        o.cantidad = this.addForm.get('item')?.value[t].cantidad;



        o.cod_docum = 'ingRomaneo';
        o.id_empresa = this.invoice.id_empresa;
        o.tc = parseFloat(this.invoiceForm.get('tc')?.value);
        o.id_titular = this.invoiceForm.get('id_titular')?.value;
        o.id_moneda = parseInt(this.invoiceForm.get('id_moneda')?.value);



        o.kilos_salida= this.addForm.get('item')?.value[t].peso_salida,
        o.kilos_calc_declarado= this.addForm.get('item')?.value[t].peso_primera,      
        o.kilos_calc_cuarta_balanza= this.addForm.get('item')?.value[t].peso_cuarta
        o.cod_identidad=this.addForm.get('item')?.value[t].cod_identidad
        o.fecha=this.formatoFechaBd.transform(this.invoice.fecha),
        o.serie_fact_prov = 'A',
        o.nro_fact_prov=0,
        o.simbolo_moneda = '',      
        o.nom_articulo =this.addForm.get('item')?.value[t].nom_articulo;

        

        o.importe_mo_peso_salida = (this.addForm.get('item')?.value[t].peso_salida*this.invoice.importe_mo)/this.invoiceForm.get('cantidad_kilos_salida')?.value,
        o.importe_mo_peso_entrada = (this.addForm.get('item')?.value[t].peso_primera*this.invoice.importe_total_mo)/this.invoiceForm.get('cantidad_kilos_declarados')?.value,
        o.importe_mo_peso_cuarta_balanza = (this.addForm.get('item')?.value[t].peso_cuarta*this.invoice.importe_total_mo)/this.invoiceForm.get('cantidad_kilos_cuarta_balanza')?.value

     
        o.importe_mo =  o.importe_mo_peso_salida;
        o.importe_total_mo = o.importe_mo * 1.22;
        o.importe_iva_mo = o.importe_total_mo - o.importe_mo;

        if (this.invoice.id_moneda === 2) {
          //es en dolares

          o.importe_total_tr = o.importe_total_mo;
          o.importe_tr = o.importe_mo;
          o.importe_iva_tr = o.importe_iva_mo;

          
          o.importe_mn = o.importe_mo * this.invoiceForm.get('tc')?.value;
          o.importe_iva_mn = o.importe_iva_mo * this.invoiceForm.get('tc')?.value;
          o.importe_total_mn = o.importe_total_mo * this.invoiceForm.get('tc')?.value;

        } else {

          o.importe_tr = o.importe_mo / this.invoiceForm.get('tc')?.value;
          o.importe_iva_tr = o.importe_iva_mo / this.invoiceForm.get('tc')?.value;
          o.importe_total_tr= o.importe_total_mo / this.invoiceForm.get('tc')?.value;

          o.importe_total_mn = o.importe_total_mo;
          o.importe_mn = o.importe_mo;
          o.importe_iva_mn = o.importe_iva_mo;
        
        }        


        this.invoice.lineasRomaneo.push(o);

      }

      this.ingresoRomaneoService.addRomaneo(this.invoice).subscribe((dato) => {

        //this.invoice.splice(0, 0, this.invoice);

      });
      imprimoMensajeOk(
        'El ingreso del romaneo fue grabada con exito',
        'Muchas Gracias'
      );    
      this.router.navigate(['/administracion/ingreso-romaneo']);
    
    } else {
    
      imprimoMensajeError(
        'Ha ocurrido un error al momento de querer grabar el ingreso del romaneo',
        'Comuniquese con el administrador'
      );
      // El formulario no es válido, mostrar un mensaje de error o realizar alguna acción
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