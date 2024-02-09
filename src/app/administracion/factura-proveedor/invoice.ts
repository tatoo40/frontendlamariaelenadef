export class order {
    constructor(
        public id: number = 0,
        public nro_trans = 0,
        public cantidad: number = 0,    
        public precio_unitario: number = 0,            
        public importe_mo: number = 0,
        public importe_mn: number = 0,
        public importe_tr: number = 0,
        public importe_total_mo: number = 0,
        public importe_total_mn: number = 0,
        public importe_total_tr : number = 0,
        public importe_iva_basico_mo: number = 0,
        public importe_iva_basico_mn: number = 0,
        public importe_iva_basico_tr: number = 0,
        public importe_iva_minimo_mo: number = 0,
        public importe_iva_minimo_mn: number = 0,
        public importe_iva_minimo_tr: number = 0,
        public importe_iva_excento_mo: number = 0,
        public importe_iva_excento_mn: number = 0,
        public importe_iva_excento_tr: number = 0,
        public fecha: Date = new Date,
        public serie_fact_prov: string = '',
        public nro_fact_prov: number = 0,
        public id_moneda   : number = 0,
        public cantidad_stk: number = 0,
        public id_tasa_iva_cmp: number = 0,
        public conv_uni_cmp_a_stk: number = 0,
        public simbolo_moneda : string = '',       
        public id_titular: number = 0,
        public id_empresa: number = 0,   
        public tc : number = 0,
        public cod_docum: string = '',
        public cod_articulo: string = '',
        public nom_articulo: string='') {
    }

}

export class InvoiceList {
  
    constructor(
        public id: number = 0,
        public nro_trans = 0,
        public importe_mo: number = 0,
        public importe_mn: number = 0,
        public importe_tr: number = 0,
        public importe_total_mo: number = 0,
        public importe_total_mn: number = 0,
        public importe_total_tr : number = 0,

        public importe_iva_minimo_mo: number = 0,
        public importe_iva_minimo_mn: number = 0,
        public importe_iva_minimo_tr: number = 0,

        public importe_iva_excento_mo: number = 0,
        public importe_iva_excento_mn: number = 0,
        public importe_iva_excento_tr: number = 0,

        public importe_iva_basico_mo: number = 0,
        public importe_iva_basico_mn: number = 0,
        public importe_iva_basico_tr: number = 0,

        public fecha: Date = new Date,
        public nro_trans_ref: number = 0,
        public serie_fact_prov: string = '',
        public nro_fact_prov: number = 0,
        public id_moneda   : number = 0,
        public simbolo_moneda : string = '',         
        public id_titular: number = 0,
        public nombre_fantasia: string='',
        public razon_social: string='',
        public rut: string='',
        public direccion:string='',
        public email:string='',
        public telefono_contacto:string='',
        public id_empresa: number = 0,   
        public tc : number = 0,
        public cod_docum: string = '',
        public orders: order[] = [],
        public isSelected: boolean = false,
        public observaciones: string = '',
        public afecta_costo:string =''
   ) {

    }

}
  
  
