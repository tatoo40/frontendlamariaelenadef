import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { environment } from '../environments/environment';


const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private seccionUrl = 'ganado'
  private sccionGetUrl = 'ganado';



  constructor(private http: HttpClient) {}



  getStockActivo(): Observable<[]> {
    const empresa = JSON.parse(localStorage.getItem('empresas'));
    const empresaSel = empresa[0];
    const apiUrl = `${base_url}/${this.sccionGetUrl}/${empresaSel.id}`;
    
    return this.http.get<[]>(apiUrl).pipe(
      //catchError(this.handleError<[]>('getStockActivo'))
     
    );
  }



  getStockActivoVacasPrenadas(): Observable<[]> {
    const empresa = JSON.parse(localStorage.getItem('empresas'));
    const empresaSel = empresa[0];
    const apiUrl = `${base_url}/${this.sccionGetUrl}/${empresaSel.id}/stockganadoactivoprenadas`;
    
    return this.http.get<[]>(apiUrl).pipe(
      //catchError(this.handleError<[]>('getStockActivo'))
     
    );
  }
  
  getIndicadoresKilosTotales(empresa:number): Observable<any[]> {
    const apiUrl = `${base_url}/${this.sccionGetUrl}/${empresa}/indicadores/totalesanimales`;
    //console.log(apiUrl);
    return this.http.get<[]>(apiUrl).pipe(
      //catchError(this.handleError<[]>('totalesanimales'))
    );
  }


  getIndicadoresEntradasSemanales(empresa:number): Observable<any[]> {
    const apiUrl = `${base_url}/${this.sccionGetUrl}/${empresa}/indicadores/entradassemanales`;
    
    return this.http.get<[]>(apiUrl).pipe(
      //catchError(this.handleError<[]>('entradassemanales'))
    );
  }


  getIndicadoresSalidasSemanales(empresa:number): Observable<any[]> {
    const apiUrl = `${base_url}/${this.sccionGetUrl}/${empresa}/indicadores/salidassemanales`;
    
    return this.http.get<[]>(apiUrl).pipe(
      //catchError(this.handleError<[]>('salidassemanles'))
    );
  }

  getGanadoActivo(): Observable<[]> {
    const empresa = JSON.parse(localStorage.getItem('empresas'));
    const empresaSel = empresa[0];
    const apiUrl = `${base_url}/${this.sccionGetUrl}/${empresaSel.id}/stockganadoactivo`;
    
    return this.http.get<[]>(apiUrl).pipe(
      //catchError(this.handleError<[]>('getStockActivo'))
     
    );
  }


  getInfoCaravanaActiva(caravana): Observable<[]> {
    const empresa = JSON.parse(localStorage.getItem('empresas'));
    const empresaSel = empresa[0];
    const apiUrl = `${base_url}/${this.sccionGetUrl}/${empresaSel.id}/infocaravanaactiva/${caravana}`;
    
    return this.http.get<[]>(apiUrl).pipe(
      //catchError(this.handleError<[]>('getStockActivo'))
     
    );
  }


  getArticulo(id_marca:number,id_ganado:number): Observable<[]> {
    const empresa = JSON.parse(localStorage.getItem('empresas'));
    const empresaSel = empresa[0];
    const apiUrl = `${base_url}/${this.sccionGetUrl}/${empresaSel.id}/articuloxmarcaycategoria/${id_marca}/${id_ganado}`;
    
    return this.http.get<[]>(apiUrl).pipe(
      //catchError(this.handleError<[]>('getStockActivo'))
     
    );
  }

  getDepositoStkSeleccionadoInd(ganado: any): Observable<any[]> {
    const empresa = JSON.parse(localStorage.getItem('empresas'));
    const empresaSel = empresa[0];
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    const apiUrl = `${base_url}/${this.sccionGetUrl}/${empresaSel.id}/sector`;
  
 

    let params = new HttpParams();
    const caravanasUnicas = Array.from(new Set(ganado.map((item) => item.EID)));

    Object.keys(caravanasUnicas).forEach((key) => {
      params = params.append(key, caravanasUnicas[key]);
    });

    let queryString = '';
    caravanasUnicas.forEach((EID, index) => {
      if (index > 0) {
        queryString += '&';
      }
      queryString += `${index}=${EID}`;
    });
    

    const fullUrl = apiUrl + '?' + queryString;
    


    //console.log(queryString)
    // Aquí se hace la solicitud HTTP utilizando HttpClient.get()
    return this.http.get<any[]>(fullUrl).pipe(
      catchError((error) => {
        console.error('Error en la solicitud HTTP:', error);
        return []; // Manejar el error según tu lógica, por ejemplo, devolviendo un arreglo vacío
      })
    );
  }

  getDepositoStkSeleccionado(ganado: any): Observable<any[]> {
    const empresa = JSON.parse(localStorage.getItem('empresas'));
    const empresaSel = empresa[0];
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    const apiUrl = `${base_url}/${this.sccionGetUrl}/${empresaSel.id}/deposito`;
  
 

    let params = new HttpParams();
    const caravanasUnicas = Array.from(new Set(ganado.map((item) => item.EID)));

    Object.keys(caravanasUnicas).forEach((key) => {
      params = params.append(key, caravanasUnicas[key]);
    });

    let queryString = '';
    caravanasUnicas.forEach((EID, index) => {
      if (index > 0) {
        queryString += '&';
      }
      queryString += `${index}=${EID}`;
    });
    

    const fullUrl = apiUrl + '?' + queryString;
    


    //console.log(queryString)
    // Aquí se hace la solicitud HTTP utilizando HttpClient.get()
    return this.http.get<any[]>(fullUrl).pipe(
      catchError((error) => {
        console.error('Error en la solicitud HTTP:', error);
        return []; // Manejar el error según tu lógica, por ejemplo, devolviendo un arreglo vacío
      })
    );
  }


  handleError<T>(arg0: string): any {
    throw new Error('Method not implemented.');
  }
}
