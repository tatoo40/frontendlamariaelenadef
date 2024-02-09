import { Component } from '@angular/core';

import { StockService } from 'src/app/services/stock.service';
@Component({
  selector: 'app-project-counter',
  templateUrl: './project-counter.component.html'
})
export class ProjectCounterComponent   {



  empresas= JSON.parse(localStorage.getItem('empresas'));
  emprsasSel=this.empresas[0]

  kilosTotales: number = 0;
  unidadesTotales: number = 0;

  entradasSemanales: number = 0;
  salidasSemanales: number = 0;


  constructor(private Datoservice: StockService) {

    this.Datoservice.getIndicadoresKilosTotales(this.emprsasSel.id).subscribe((indicador) => {

      if (indicador && Array.isArray(indicador) && indicador.length > 0) {
        // Accede directamente a las propiedades kilos y unidades del primer elemento del array
        this.kilosTotales = indicador[0].kilos ?? 0;
        this.unidadesTotales = indicador[0].unidades ?? 0;
      } else {
        // Si no hay datos o la estructura no es la esperada, asigna valores predeterminados
        this.kilosTotales = 0;
        this.unidadesTotales = 0;
      }
    });


    this.Datoservice.getIndicadoresSalidasSemanales(this.emprsasSel.id).subscribe((indicador) => {

      //console.log(indicador)
      if (indicador && Array.isArray(indicador) && indicador.length > 0) {
        // Accede directamente a las propiedades kilos y unidades del primer elemento del array
        this.salidasSemanales=  indicador.length;
  
      } else {
        // Si no hay datos o la estructura no es la esperada, asigna valores predeterminados
         this.salidasSemanales=  0;
        
      }
      
     



    });


    this.Datoservice.getIndicadoresEntradasSemanales(this.emprsasSel.id).subscribe((indicador) => {


      //console.log(indicador)

      if (indicador && Array.isArray(indicador) && indicador.length > 0) {
        this.entradasSemanales=  indicador.length;
      } else {
        // Si no hay datos o la estructura no es la esperada, asigna valores predeterminados
        this.entradasSemanales=  0;
      }




    });

    


  }



}
