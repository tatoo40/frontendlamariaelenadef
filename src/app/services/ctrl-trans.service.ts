import { Injectable, OnInit } from '@angular/core';
import { TipoCambioDiario } from '../mantenimiento/tipo-cambio-diario/tipo-cambio-diario';

import { ObtengoDatosGeneralesService } from './obtengo-datos-generales.service';
import { DdMmYYYYDateSoloHoraCeroPipe } from '../dd-mm-yyyy-date-solo-hora-cero.pipe';
import { DdMmYYYYDateSoloPipe } from '../dd-mm-yyyy-date-solo.pipe';


@Injectable({
  providedIn: 'root'
})
export class CtrlTrans implements OnInit {

  constructor(private formatoFecha:DdMmYYYYDateSoloHoraCeroPipe,private formatoFechaSinHora:DdMmYYYYDateSoloPipe,
    private serviciosGenerales:ObtengoDatosGeneralesService) { }

    ngOnInit(): void {
        const fechaHoy = new Date(); 
       this.serviciosGenerales.ctrlMovContables(fechaHoy)
    }
  ///ACA TENGO PROBLEMAS
  
  

  evaluoAccionTransPre(IdAccion:number, IdSeccion:number, data):any{


    var tieneError:boolean;
    var msgError:string = '';
    const fechaHoy = new Date();      
    const fechaFormateada = this.formatoFecha.transform(fechaHoy);    
    const fechaFormateadaSinHora = this.formatoFechaSinHora.transform(fechaHoy)

    //console.log(fechaFormateada);
    if (data===null)
    return [{
        status:'ok',
        mensaje:''
    }];   
    //Evaluo que accion estoy realizando y en que seccion
    // Verifico si hay un control para ese conjunto de datos y empiezo a recorrer los controles seteados
    const controles_x_seccion_accion = JSON.parse(localStorage.getItem("controles_x_seccion_accion"));

    


    //Verifico si la seccion tiene controles para realizar antes de ejecucin de una accion
    var controlesARealizar:any = controles_x_seccion_accion.filter((item) => 
                       item.id_accion === IdAccion && 
                       item.id_seccion === IdSeccion && 
                       item.lanzamiento === 1)
                       

                       //console.log(data)
                       //console.log(controlesARealizar)


    // si no encuentra controles para realizar ya se va
    if (controlesARealizar.length===0)
        return [{
            status:'ok',
            mensaje:''
        }];   

     

    //recorro los controles a realizar  
    controlesARealizar.forEach(element => {

        const id_control = element.id_control; 
        //console.log(element)
        //controles que se lanzan antes de finalizar la operacion
        switch (id_control) {
          
          //Verifico si ya exite un registro ingresado con la fecha de hoy
          case 1:

                //
                console.log(data)
            
                  const date = data.some(
                    date => this.formatoFecha.transform(date.fecha) === fechaFormateada,
                  )

                  if(date)
                    tieneError = true;
                    msgError='Ya existe un registro para la fecha de hoy';
                  
                  

          break;
          case 2:
                    //console.log(this.serviciosGenerales.ctrlMovContables())
                    //hago consulta sobre la cpt_facturas
                 
                    var procesoCtrl = this.serviciosGenerales.ctrlMovContables(fechaHoy);
                    //var procesoCtrl = false;

                    if(procesoCtrl)
                        tieneError = true;
                        msgError='Ya existen registros a nivel contable que fueron afectados por la transaccion que esta intenentando manipular';
                    
                
          break;
    
        }
      });
    
        if (tieneError){
            return [{
                status:'error',
                mensaje: msgError
            }];  

        }else{
            return [{
                status:'ok',
                mensaje: 'Todo ok'
            }];        
        } 
 

                

  }
   




}





