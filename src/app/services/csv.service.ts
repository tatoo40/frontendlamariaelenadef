import { Injectable } from "@angular/core";
import { StockService } from "./stock.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ErrorService } from "./error.service";

@Injectable({
  providedIn: 'root'
})


export class CsvService {


  constructor(private stockService:StockService, private errorService: ErrorService){}

  public saveDataInCSV(data: Array<any>): string {
    if (data.length == 0) {
      return '';
    }

    let propertyNames = Object.keys(data[0]);
    let rowWithPropertyNames = propertyNames.join(',') + '\n';

    let csvContent = rowWithPropertyNames;

    let rows: string[] = [];

    data.forEach((item) => {
      let values: string[] = [];

      propertyNames.forEach((key) => {
        let val: any = item[key];



        if (val !== undefined && val !== null) {

        } else {
          val = '';
        }
        values.push(val);
      });
      rows.push(values.join(','));
    });
    csvContent += rows.join('\n');

    return csvContent;
  }


  verificoDatosASubir(data){
      
    let stockActivo:any=[];
    let existeCaravana:boolean;
    let otroArray: any=data;
    

    stockActivo = JSON.parse(localStorage.getItem('stockActivo'));

      //console.log(stockActivo)
      //console.log(data)
      const arrayNuevoStock= stockActivo[0];
      //COMPARO SI TODOS LOS ELEMENTOS DEL ARCHIVO ESTAN EN EL STOCK O SI NINGUNO

      
      // Verificar si ninguno de los elementos de data está en stockActivo


      var ningunoPresente = otroArray.every(objetoData => {
        return !arrayNuevoStock.some(objetoStockActivo => objetoStockActivo.cod_identidad === objetoData.EID.toString());
        //return evaluar;
      });



      //console.log(ningunoPresente)

      if (ningunoPresente) {
        //quire decir que es una nueva carga
        //console.log('Ninguno de los elementos de data está presente en stockActivo.');
        existeCaravana= false;

      } else {
        // existe un elemento que esta. Hay que verificar que sean todos
        

        var todosPresentes = otroArray.every(objeto2 => {
          return arrayNuevoStock.some(objeto1 => objeto1.cod_identidad === objeto2.EID.toString());
        });
    
        //console.log(todosPresentes)

        if (todosPresentes) {
          
          existeCaravana= true;
        
        } else {

          const errorMessage = 'El archivo tiene registros que ya existen y registros inexistentes en la base. Corrija la situacion y vuelva a intentar.';
          const status = 500; // Código de estado del error HTTP deseado
          const statusText = 'Internal Server Error'; // Texto del estado del error HTTP deseado
          const errorObject = { message: errorMessage  }; // Puedes definir un objeto de error personalizado
          
          tiroMensajeError(errorMessage,status,statusText,errorObject, this.errorService);

        
        }
      
      }
      //console.log(existeCaravana);
      return existeCaravana;
  }


  public sumarPesoGanado (data: Array<any>):number{

  
    let pesoTotalCalculado = data.reduce((acumulador, actual) => acumulador + Number(actual.peso), 0);
    return pesoTotalCalculado;

  }

  public getProcedimientoXTipoArchivo(csvText: string): number {

    let procesoSeleccionado;
    //obtengo de la estrucuta los campos para comparar e inferir que accion esta queriendo hacer el usuario
    let tiposArchivoEmpresa = JSON.parse(localStorage.getItem('tipos_archivo_lector'));




    const propertyNames = csvText.slice(0, csvText.indexOf('\n')).split(',');



    // Supongamos estos arrays de ejemplo
    const campos = propertyNames;
    const csvArray = tiposArchivoEmpresa

    //console.log(campos);
    //console.log(csvArray);

    // Verificar si las columnas de campos coinciden con el CSV
    procesoSeleccionado = verificarColumnas(campos, csvArray);

    return procesoSeleccionado;

  }


  

  public importDataFromCSV(csvText: string): Array<any> {

    const propertyNames = csvText.slice(0, csvText.indexOf('\n')).split(',');
    const dataRows = csvText.slice(csvText.indexOf('\n') + 1).split('\n');

    let dataArray: any[] = [];

    dataRows.forEach((row) => {

      let values = row.split(',');
      let obj: any = new Object();
      
      //aca vengo por la columnas
      for (let index = 0; index < propertyNames.length; index++) {
        
        let propertyName: string = '';
        if (index>0) {
           propertyName = propertyNames[index].toLowerCase().trim();
        }else{
           propertyName = propertyNames[index];
        }
        
        //console.log(propertyName);
        //console.log(values[index]);

        let val: any = values[index];

        if (val === '') {

          //console.log(propertyName)
          if (propertyName==='PESO'){
            
            val = 0;
          
          }else{
          
            val = null;
          
          }

        }

        switch (propertyName.trim()){
          case 'PESO':
            val = new Number(val);
          break;
          case 'TIME':
            val = val;
          break;
          default:
            val = new String(val);
          break;
        }


        obj[propertyName] = val.trim();
    
      }

      dataArray.push(obj);
    });

    //console.log(dataArray)

    return dataArray;
  }
}

function verificarColumnas(campos: string[], arrayCsv: any[]) {

  let filaCoincidente = null;

  for (let i = 0; i < arrayCsv.length; i++) {
    // Verificar si la fila actual no es una cadena o está vacía
    if (typeof arrayCsv[i].campos !== 'string' || arrayCsv[i].campos.trim() === '') {
      filaCoincidente = null; // La fila no es válida, no es una cadena o está vacía
    }

    const columnasCSV = arrayCsv[i].campos.split('|');

    // Verificar si la cantidad de columnas coincide con los campos definidos

    if (campos.length === columnasCSV.length) {
      filaCoincidente = null; // La cantidad de columnas no coincide

      // la cantidad de columnas son iguales ahora comparo campo a campo
      let tieneTodasColumnasIguales = true;

      for (let j = 0; j < campos.length; j++) {
        if (campos[j].trim() !== columnasCSV[j].trim()) {
          tieneTodasColumnasIguales = false; // Una columna no coincide
        }
      }

      if (tieneTodasColumnasIguales){
        filaCoincidente = arrayCsv[i];
        break; // Salir del bucle una vez que se encuentra una fila coincidente
      }
    }
  }

  return filaCoincidente; // Retorna la fila completa si todas las columnas coinciden

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