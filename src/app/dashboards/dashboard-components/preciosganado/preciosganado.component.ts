import { Component } from '@angular/core';
import { DdMmYYYYDateSoloPipe } from 'src/app/dd-mm-yyyy-date-solo.pipe';

import { StockService } from 'src/app/services/stock.service';
@Component({
  selector: 'app-preciosganado',
  templateUrl: './preciosganado.component.html'
})
export class PreciosGanadoComponent   {



  empresas= JSON.parse(localStorage.getItem('empresas'));
  emprsasSel = this.empresas[0];
  
  

// Obtener la fecha de hoy en formato de cadena YYYY-MM-DD
  //fechaHoy = new Date().toISOString().split('T')[0];
  fechaHoy = new Date();      
 
    // Obtener los parámetros almacenados en localStorage
  parametros_x_fecha = JSON.parse(localStorage.getItem('cpt_parametros_x_fecha'));

        // Encontrar el registro con la fecha de hoy
 
  parametros_reg:any
   
  //precio_vaca_invernada_cuarta_balanza = this.parametros_x_fechaSel.precio_vaca_invernada_cuarta_balanza
  //console.log(parametros_x_fechaSel)

  kilosTotales: number = 0;
  unidadesTotales: number = 0;
  entradasSemanales: number = 0;
  salidasSemanales: number = 0;


  constructor(private Datoservice: StockService,private formatoFecha:DdMmYYYYDateSoloPipe) {
    
    const fechaFormateada = this.formatoFecha.transform(this.fechaHoy);   
    //console.log(this.parametros_x_fecha)



    this.parametros_x_fecha.forEach(parametro => {
      if (this.formatoFecha.transform(parametro.fecha) === fechaFormateada) {
          this.parametros_reg = parametro;
          return; // Terminar el bucle forEach una vez que se encuentra el parámetro
      }
    });


    //console.log(fechaFormateada);
    //console.log(this.parametros_reg);

  }



}
