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

import { order, InvoiceList } from '../invoice';
import { FacturaProvService } from '../factura-proveedor.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DdMmYYYYDateSoloHoraCeroPipe } from 'src/app/dd-mm-yyyy-date-solo-hora-cero.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'agregar-factura-proveedor',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './agregar-factura-proveedor.component.html',
})
export class AgregarFacturasProvComponent implements OnInit {


  submitted = false;
  addForm: any;
  rows: UntypedFormArray;
  invoice: InvoiceList = new InvoiceList();

  
  invoiceForm: FormGroup;
  
  ///////////////////////////////////////////////////////////
  importe_mo = 0;
  importe_iva_basico_mo = 0;
  importe_iva_basico_mn = 0;
  importe_iva_basico_tr = 0;
  importe_iva_minimo_mo = 0;
  importe_iva_minimo_mn = 0;
  importe_iva_minimo_tr = 0;

  importe_iva_excento_mo = 0;
  importe_iva_excento_mn = 0;
  importe_iva_excento_tr = 0;

  importe_total_mo = 0;
  obtengoFacturasProv: InvoiceList[];
  proveedores: any;
  articulos: any;
  fechaHoy:Date=new Date();

  proveedorSeleccionado: any = {
    razon_social: '',
    rut: '',
    direccion: '',
    email: '',
    telefono_contacto: '',
  };

  proveedoresDatos = JSON.parse(localStorage.getItem('titular'));
  monedas = JSON.parse(localStorage.getItem('moneda'));
  empresa = JSON.parse(localStorage.getItem('empresas'));
  arrayTc = JSON.parse(localStorage.getItem('tipo_cambio_diario'));



  fechaBuscada = this.formatoFechaBd.transform(new Date());
  tipoCambioBuscado = this.arrayTc.find(
   (tipoCambioBuscado) => this.formatoFechaBd.transform(tipoCambioBuscado.fecha) === this.fechaBuscada
  );
 
  lotes: any;
 
  S: string = "S"; // Declaración y asignación de la propiedad 'S'
  N: string = "N"; // Declaración y asignación de la propiedad 'S'
  constructor(
    private fb: UntypedFormBuilder,
    private invoiceService: FacturaProvService,
    private router: Router,
    private formatoFechaBd: DdMmYYYYDateSoloHoraCeroPipe,
    private formBuilder: FormBuilder
  ) {
    
    this.initializeForm()



    
    this.invoiceService.getInvoicesWithLines().subscribe((dato) => {
      this.obtengoFacturasProv = dato;

      this.invoice.id =
        Math.max.apply(
          Math,
          this.obtengoFacturasProv.map(function (o) {
            return o.id;
          })
        ) + 1;


      this.addForm = this.fb.group({});
      
      this.rows = this.fb.array([]);
      this.addForm.addControl('rows', this.rows);
      this.rows.push(this.createItemFormGroup());

      this.invoiceService.getProveedoresParaFacturar().subscribe((dato) => {
        this.proveedores = dato;
      });

      this.invoiceService.getLotesDeEntradaACostear().subscribe((dato) => {
        this.lotes = dato;
      });

      this.invoiceForm.get('tc')?.setValue(this.tipoCambioBuscado.valor);
      //this.invoice.tc = this.tc.valor;
    });
  }

  initializeForm(){


    this.invoiceForm = new FormGroup({

      id_titular: new FormControl,
      fecha: new FormControl,
      serie_fact_prov: new FormControl,
      nro_fact_prov: new FormControl,
      id_moneda: new FormControl,
      tc: new FormControl,
      afecta_costo: new FormControl,
      observaciones: new FormControl,
      nro_trans_ref: new FormControl,
      rut: new FormControl,
      direccion: new FormControl,
      email: new FormControl,
      telefono_contacto: new FormControl,

    })


    this.invoiceForm = this.formBuilder.group({

      id_titular:['', Validators.required], 
      fecha:['', Validators.required],
      serie_fact_prov:['', Validators.required],
      nro_fact_prov:['', [Validators.required,this.nonZeroValidator]],
      id_moneda:['', Validators.required],
      tc:['', Validators.required],
      afecta_costo:['', Validators.required],
      observaciones:[''],
      nro_trans_ref:['', Validators.required],
      rut:['', Validators.required],
      direccion:['', Validators.required],
      email:['', Validators.required],
      telefono_contacto:['', Validators.required],
      // Otros controles del formulario aquí
    });
  }

  
  onProveedorSelected() {
    const proveedorId = this.invoiceForm.get('id_titular')?.value;
    this.proveedorSeleccionado = this.proveedoresDatos.find(
      (prov) => prov.id === proveedorId
    );

    this.invoiceForm.get('rut')?.setValue(this.proveedorSeleccionado.rut);
    this.invoiceForm.get('telefono_contacto')?.setValue(this.proveedorSeleccionado.telefono_contacto);
    this.invoiceForm.get('email')?.setValue(this.proveedorSeleccionado.email);
    this.invoiceForm.get('direccion')?.setValue(this.proveedorSeleccionado.direccion);


    this.invoiceService.getArticulosFactxProv(proveedorId).subscribe((dato) => {
      this.articulos = dato;
    });
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

  get nro_fact_prov() {
    return this.invoiceForm.get('nro_fact_prov');
  }
  get serie_fact_prov() {
    return this.invoiceForm.get('serie_fact_prov');
  }
  get tc() {
    return this.invoiceForm.get('tc');
  }
  get afecta_costo() {
    return this.invoiceForm.get('afecta_costo');
  }

  get observaciones() {
    return this.invoiceForm.get('observaciones');
  }  
  get nro_trans_ref() {
    return this.invoiceForm.get('nro_trans_ref');
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
/////////////////////////////////////////////////////////////////////////////
    //this.importe_mo = this.importe_mo - totalCostOfItem;
    //this.importe_iva_mo = this.importe_iva_mo * 0.22;
    //this.importe_total_mo = this.importe_mo + this.importe_iva_mo;

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

  itemsChanged() {
    let total: number = 0;

    this.importe_iva_basico_mo   =  0
    this.importe_iva_excento_mo =  0
    this.importe_iva_minimo_mo  =   0


    for (
      let t = 0;
      t < (<UntypedFormArray>this.addForm.get('rows')).length;
      t++
    ) {
      if (
        this.addForm.get('rows')?.value[t].precio_unitario != '' &&
        this.addForm.get('rows')?.value[t].cantidad
      ) {
        
        
        // tengo que ver cada articulo y despues ver el tipo de iva
        const articuloLinea =  this.addForm.get('rows')?.value[t].cod_articulo;

        //console.log(articuloLinea);
        //console.log(this.articulos);
        const articuloBuscado = this.articulos.find(
          (articulo) => articulo.cod_articulo === articuloLinea
        );
        
        
        console.log(articuloBuscado);
   
        switch (articuloBuscado.descripcion_iva){

          case 'Excento':
          
            this.importe_iva_basico_mo   = this.importe_iva_basico_mo + 0
            this.importe_iva_excento_mo = this.importe_iva_excento_mo + 0
            this.importe_iva_minimo_mo  =  this.importe_iva_minimo_mo + 0

            console.log( this.importe_iva_excento_mo )
            console.log( this.importe_mo)
            console.log(100/articuloBuscado.porcentaje)      
    
          break;
          case 'Basico':
    
            this.importe_iva_excento_mo = this.importe_iva_excento_mo + 0
            this.importe_iva_minimo_mo  =  this.importe_iva_minimo_mo + 0
            this.importe_iva_basico_mo  =  this.importe_iva_basico_mo+this.addForm.get('rows')?.value[t].precio_unitario * this.addForm.get('rows')?.value[t].cantidad  * (articuloBuscado.porcentaje/100);
     
    
          break;
          case 'Minimo':
            this.importe_iva_excento_mo = this.importe_iva_excento_mo + 0
            this.importe_iva_basico_mo  =  this.importe_iva_basico_mo + 0
            this.importe_iva_minimo_mo = 
            this.importe_iva_minimo_mo  + 
            this.addForm.get('rows')?.value[t].precio_unitario * this.addForm.get('rows')?.value[t].cantidad  * (articuloBuscado.porcentaje/100);
          
          break;      
    
        }

        console.log(this.importe_iva_minimo_mo)

        
        total =
          this.addForm.get('rows')?.value[t].precio_unitario * this.addForm.get('rows')?.value[t].cantidad + total;
      }
    }

    this.importe_mo = total;
    console.log(this)
    this.importe_total_mo = this.importe_iva_excento_mo + this.importe_iva_minimo_mo + this.importe_iva_basico_mo + this.importe_mo;

   

  }

  ////////////////////////////////////////////////////////////////////

  saveDetail() {
    this.submitted = true;

    
    if (this.addForm.valid && this.invoiceForm.valid) {
      this.invoice.cod_docum = 'factprov';
      this.invoice.direccion = this.proveedorSeleccionado.direccion;
      this.invoice.email = this.proveedorSeleccionado.email;
      this.invoice.id_empresa = this.empresa.id;
      this.invoice.fecha = this.formatoFechaBd.transform(this.invoice.fecha);
      this.invoice.nombre_fantasia = this.empresa.nombre;
      this.invoice.rut = this.empresa.rut;
      this.invoice.razon_social = this.empresa.razon_social;
      this.invoice.telefono_contacto = this.empresa.telefono_contacto;

      this.invoice.importe_total_mo = this.importe_total_mo;
      this.invoice.importe_mo = this.importe_mo;
  
      

      this.invoice.importe_iva_basico_mo = this.importe_iva_basico_mo;
      this.invoice.importe_iva_excento_mo = this.importe_iva_excento_mo;
      this.invoice.importe_iva_minimo_mo = this.importe_iva_minimo_mo;

      this.invoice.importe_iva_basico_mn = this.importe_iva_basico_mn;
      this.invoice.importe_iva_excento_mn = this.importe_iva_excento_mn;
      this.invoice.importe_iva_minimo_mn = this.importe_iva_minimo_mn
      
      this.invoice.importe_iva_basico_tr = this.importe_iva_basico_tr;
      this.invoice.importe_iva_excento_tr = this.importe_iva_excento_tr;
      this.invoice.importe_iva_minimo_tr = this.importe_iva_minimo_tr


      //this.invoice.importe_iva_total_mo = this.importe_iva_basico_mo;
      //this.invoice.importe_iva_total_tr = this.importe_iva_basico_mo;
      //this.invoice.importe_iva_total_mm = this.importe_iva_basico_mo;

      this.invoice.observaciones =this.invoiceForm.get('observaciones')?.value;
      this.invoice.afecta_costo =this.invoiceForm.get('afecta_costo')?.value;
      this.invoice.id_moneda = parseInt(this.invoiceForm.get('id_moneda')?.value);
      this.invoice.id_titular =this.invoiceForm.get('id_titular')?.value;

      this.invoice.nro_fact_prov =this.invoiceForm.get('nro_fact_prov')?.value;
      this.invoice.serie_fact_prov =this.invoiceForm.get('serie_fact_prov')?.value;
      this.invoice.nro_trans_ref =this.invoiceForm.get('nro_trans_ref')?.value;
      this.invoice.tc = parseFloat(this.invoiceForm.get('tc')?.value);

      if (this.invoice.id_moneda === 2) {
        //es en dolares

        this.invoice.importe_total_tr = this.importe_total_mo;
        this.invoice.importe_tr = this.importe_mo;
        //this.invoice.importe_iva_tr = this.importe_iva_mo;

        this.invoice.importe_total_mn = this.importe_total_mo *  this.invoiceForm.get('tc')?.value;
        this.invoice.importe_mn = this.importe_mo * this.invoiceForm.get('tc')?.value;
        //this.invoice.importe_iva_mn = this.importe_iva_mo * this.invoiceForm.get('tc')?.value;
      } else {
        this.invoice.importe_total_tr = this.importe_total_mo / this.invoiceForm.get('tc')?.value;
        this.invoice.importe_tr = this.importe_mo / this.invoiceForm.get('tc')?.value;
        //this.invoice.importe_iva_tr = this.importe_iva_mo / this.invoiceForm.get('tc')?.value;

        this.invoice.importe_total_mn = this.importe_total_mo;
        this.invoice.importe_mn = this.importe_mo;
        //this.invoice.importe_iva_mn = this.importe_iva_mo;
      }


      console.log(this.invoice);
      for (
        let t = 0;
        t < (<UntypedFormArray>this.addForm.get('rows')).length;
        t++
      ) {
        let o: order = new order();

        o.cod_articulo = this.addForm.get('rows')?.value[t].cod_articulo;
        o.precio_unitario = this.addForm.get('rows')?.value[t].precio_unitario;
        o.cantidad = this.addForm.get('rows')?.value[t].cantidad;


  
        //console.log(articuloLinea);
        //console.log(this.articulos);
        const articuloBuscado = this.articulos.find(
          (articulo) => articulo.cod_articulo === o.cod_articulo
        );
        
        
        console.log(articuloBuscado);
   
        switch (articuloBuscado.descripcion_iva){

          case 'Excento':
          
            o.importe_iva_basico_mo   = o.importe_iva_basico_mo + 0
            o.importe_iva_excento_mo = o.importe_iva_excento_mo + 0
            o.importe_iva_minimo_mo  =  o.importe_iva_minimo_mo + 0

   
    
          break;
          case 'Basico':
    
            o.importe_iva_excento_mo = o.importe_iva_excento_mo + 0
            o.importe_iva_minimo_mo  =  o.importe_iva_minimo_mo + 0
            o.importe_iva_basico_mo  =  o.importe_iva_basico_mo+this.addForm.get('rows')?.value[t].precio_unitario * this.addForm.get('rows')?.value[t].cantidad  * (articuloBuscado.porcentaje/100);
     
    
          break;
          case 'Minimo':
            o.importe_iva_excento_mo = o.importe_iva_excento_mo + 0
            o.importe_iva_basico_mo  =  o.importe_iva_basico_mo + 0
            o.importe_iva_minimo_mo = 
            o.importe_iva_minimo_mo  + 
            this.addForm.get('rows')?.value[t].precio_unitario * this.addForm.get('rows')?.value[t].cantidad  * (articuloBuscado.porcentaje/100);
          
          break;      
    
        }

        //console.log(this.importe_iva_minimo_mo)




        o.importe_mo = o.cantidad * o.precio_unitario;
        o.importe_total_mo = o.importe_mo + o.importe_iva_minimo_mo+o.importe_iva_excento_mo+o.importe_iva_basico_mo;
        //o.importe_iva_mo = o.importe_total_mo - o.importe_mo;

        if (this.invoice.id_moneda === 2) {
          //es en dolares

          o.importe_total_tr = o.importe_total_mo;
          o.importe_tr = o.importe_mo;

          o.importe_iva_basico_tr = o.importe_iva_basico_mo;
          o.importe_iva_minimo_tr = o.importe_iva_minimo_mo;
          o.importe_iva_excento_tr = 0;
          
          o.importe_mn = o.importe_mo * this.invoiceForm.get('tc')?.value;
          o.importe_total_mn = o.importe_total_mo * this.invoiceForm.get('tc')?.value;

          o.importe_iva_basico_mn = o.importe_iva_basico_mo * this.invoiceForm.get('tc')?.value;
          o.importe_iva_minimo_mn = o.importe_iva_minimo_mo * this.invoiceForm.get('tc')?.value;
          o.importe_iva_excento_mn = 0;


        } else {
          o.importe_tr = o.importe_mo / this.invoiceForm.get('tc')?.value;
          o.importe_total_tr= o.importe_total_mo / this.invoiceForm.get('tc')?.value;

          o.importe_iva_basico_tr = o.importe_iva_basico_mo  / this.invoiceForm.get('tc')?.value;
          o.importe_iva_minimo_tr = o.importe_iva_minimo_mo  / this.invoiceForm.get('tc')?.value;
          o.importe_iva_excento_tr = 0;


          o.importe_total_mn = o.importe_total_mo;
          o.importe_mn = o.importe_mo;

          o.importe_iva_basico_mn = o.importe_iva_basico_mo;
          o.importe_iva_minimo_mn = o.importe_iva_minimo_mo;
          o.importe_iva_excento_mn = 0;


        }

        o.cod_docum = 'factprov';
        o.id_empresa = this.invoice.id_empresa;
        o.tc = parseFloat(this.invoiceForm.get('tc')?.value);
        o.id_titular = this.invoiceForm.get('id_titular')?.value;
        o.nro_fact_prov = this.invoiceForm.get('nro_fact_prov')?.value;
        o.serie_fact_prov= this.invoiceForm.get('serie_fact_prov')?.value;
        o.id_moneda = parseInt(this.invoiceForm.get('id_moneda')?.value);

        o.cantidad_stk = o.cantidad * articuloBuscado.factor_conv_cmp_a_stk,
        o.id_tasa_iva_cmp = articuloBuscado.id_tasa_iva,
        o.conv_uni_cmp_a_stk = articuloBuscado.factor_conv_cmp_a_stk,

        this.invoice.orders.push(o);

      }

      this.invoiceService.addInvoice(this.invoice).subscribe((dato) => {

        //this.invoice.splice(0, 0, this.invoice);

      });
      imprimoMensajeOk(
        'La factura proveedor fue grabada con exito',
        'Muchas Gracias'
      );    
      this.router.navigate(['/administracion/facturaProveedor']);
    
    } else {
    
      imprimoMensajeError(
        'Ha ocurrido un error al momento de querer grabar la factura proveedor',
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