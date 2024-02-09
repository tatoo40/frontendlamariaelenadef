export class lineaRomaneo {
    constructor(
        public id: number = 0,
        public nro_trans = 0,
        public cantidad: number = 0,    
        public precio_unitario: number = 0,            
        public importe_mo: number = 0,
        public importe_mn: number = 0,
        public importe_tr: number = 0,
        public kilos_salida:number= 0,
        public kilos_calc_declarado:number=0,        
        public kilos_calc_cuarta_balanza:number=0,
        public cod_identidad:string='',
        public importe_total_mo: number = 0,
        public importe_total_mn: number = 0,
        public importe_total_tr : number = 0,
        public importe_iva_mo: number = 0,
        public importe_iva_mn: number = 0,
        public importe_iva_tr: number = 0,
        public fecha: Date = new Date,
        public serie_fact_prov: string = '',
        public nro_fact_prov: number = 0,
        public id_moneda   : number = 0,
        public simbolo_moneda : string = '',       
        public id_titular: number = 0,
        public id_empresa: number = 0,   
        public tc : number = 0,
        public cod_docum: string = '',
        public cod_articulo: string = '',
        public nom_articulo: string='',
        public importe_mo_peso_salida: number = 0,
        public importe_mo_peso_entrada: number = 0,
        public importe_mo_peso_cuarta_balanza: number = 0,) {
    }

}

export class RomaneoList {
  
    constructor(
        public id: number = 0,
        public nro_trans = 0,
        public importe_mo: number = 0,
        public importe_mn: number = 0,
        public importe_tr: number = 0,
        public importe_total_mo: number = 0,
        public importe_total_mn: number = 0,
        public importe_total_tr : number = 0,
        public importe_iva_mo: number = 0,
        public importe_iva_mn: number = 0,
        public importe_iva_tr: number = 0,
        public cantidad_animales:number=0,
        public cantidad_kilos_declarados=0,
        public cantidad_kilos_cuarta_balanza=0,
        public cantidad_kilos_salida=0,
        public porcentaje_rendimiento = 0,
        public fecha: Date = new Date,
        public nro_trans_ref: number = 0,
        public nro_romaneo: number = 0,
        public nro_tropa: number = 0,
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
        public lineasRomaneo: lineaRomaneo[] = [],
        public isSelected: boolean = false,
        public observaciones: string = '',
        public afecta_costo:string ='',
        public precio_unitario_general = 0,
   ) {

    }

}
  
  
