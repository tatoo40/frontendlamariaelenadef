import { Injectable, NgZone, OnInit } from '@angular/core';
import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { environment } from 'src/app/environments/environment';
import { DdMmYYYYDateSoloPipe } from '../dd-mm-yyyy-date-solo.pipe';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ErrorService } from './error.service';
import { HttpErrorResponse } from '@angular/common/http';




const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UtilesServices implements OnInit {
  getLivePositionData(arg0: string) {
    throw new Error('Method not implemented.');
  }
  loadGoogleMapsAPI() {
    throw new Error('Method not implemented.');
  }

  constructor(private formatoFecha:DdMmYYYYDateSoloPipe,private router:Router, private errorService:ErrorService) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }


  async fechaValidator(control: AbstractControl): Promise<ValidationErrors | null> {
    const inputDate = new Date(control.value);
    const today = new Date();
  
    //const inputDateFormateado = this.formatoFecha.transform(inputDate);
    //const todayFormateado = this.formatoFecha.transform(today);
  
    //console.log(inputDateFormateado);
    //console.log(todayFormateado);
  
    if (inputDate > today) {
      return { futureDate: true };
    }
  
    return null;
  }
   logout(): void {
    
    localStorage.clear();
    this.router.navigate(['/authentication/login']);

  }



  verificoArchivoCsv(data){

    let duplicados=[];
    let duplicadosString='';

    const busqueda = data.reduce((acc, p) => {
      acc[p.EID] = ++acc[p.EID] || 0;
      return acc;
    }, {});
    
    duplicados = data.filter((p) => {
      return busqueda[p.EID];
    });


    //console.log(data);

      if (duplicados.length === 0) {
        // No hay duplicados, proceder con los datos importados

        if (!evaluoLargoCaravana(data,'EID',15)){

          const errorMessage = 'Existe una caravana que no tiene el largo correspondiente';
          const status = 500; // Código de estado del error HTTP deseado
          const statusText = 'Internal Server Error'; // Texto del estado del error HTTP deseado
          const errorObject = { message: errorMessage  }; // Puedes definir un objeto de error personalizado
          
          tiroMensajeError(errorMessage,status,statusText,errorObject, this.errorService);

          return false;

        }else{

          return true;
        
        }

      } else {
        // Hay duplicados, mostrar mensaje de error
        //console.log(duplicados)
        duplicadosString = duplicados.map((obj) => obj.EID).join(', ');

        const errorMessage = 'Se encontraron duplicados en los datos importados.<br>Registros duplicados:' + duplicadosString;
        const status = 500; // Código de estado del error HTTP deseado
        const statusText = 'Internal Server Error'; // Texto del estado del error HTTP deseado
        const errorObject = { message: errorMessage  }; // Puedes definir un objeto de error personalizado
        
        tiroMensajeError(errorMessage,status,statusText,errorObject, this.errorService);


        return false;

      }
   
  }


    
}




function evaluoLargoCaravana(data: any, campo, largoCampo) {
  for (var i = 0; i < data.length; i++) {
    if (data[i][campo].length !== largoCampo) 
      return false
    
  }
  return true
}

function tiroMensajeError(errorMessage,status,statusText,errorObject, errorServicio) {

      const httpError = new HttpErrorResponse({
        error: errorObject,
        status: status,
        statusText: statusText,
    
      });
     
      // Luego puedes utilizar el objeto `httpError` como el parámetro `e` en tu función
      errorServicio.msjError(httpError);
      
}

