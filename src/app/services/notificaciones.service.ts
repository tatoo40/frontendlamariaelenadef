import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { environment } from '../environments/environment';


const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private seccionUrl = 'notificaciones'
  private sccionGetUrl = 'notificaciones';
  


  constructor(private http: HttpClient) {}

  empresa = JSON.parse(localStorage.getItem('empresas'));

  empresaSel = this.empresa[0];


  getNotificacionGanadoSinPeso(): Observable<[]> {
    const apiUrl = `${base_url}/${this.sccionGetUrl}/${this.empresaSel.id}/ganadosinpeso`;
    
    return this.http.get<[]>(apiUrl).pipe(
      //catchError(this.handleError<[]>('getStockActivo'))
     
    );
  }
  getNotificacionSanitaria(): Observable<[]> {
    const apiUrl = `${base_url}/${this.sccionGetUrl}/${this.empresaSel.id}/sanitariavencida`;
    
    return this.http.get<[]>(apiUrl).pipe(
      //catchError(this.handleError<[]>('getStockActivo'))
     
    );
  }
  getNotificacionEntradaSinFactura(): Observable<[]> {
    const apiUrl = `${base_url}/${this.sccionGetUrl}/${this.empresaSel.id}/entradasinfactura`;
    
    return this.http.get<[]>(apiUrl).pipe(
      //catchError(this.handleError<[]>('getStockActivo'))
     
    );
  }
  
  getIndicadoresKilosTotales(empresa:number): Observable<any[]> {
    const apiUrl = `${base_url}/${this.sccionGetUrl}/${empresa}/indicadores/totalesanimales`;
    
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

    const apiUrl = `${base_url}/${this.sccionGetUrl}/${this.empresaSel.id}/stockganadoactivo`;
    
    return this.http.get<[]>(apiUrl).pipe(
      //catchError(this.handleError<[]>('getStockActivo'))
     
    );
  }


  getInfoCaravanaActiva(caravana): Observable<[]> {

    const apiUrl = `${base_url}/${this.sccionGetUrl}/${this.empresaSel.id}/infocaravanaactiva/${caravana}`;
    
    return this.http.get<[]>(apiUrl).pipe(
      //catchError(this.handleError<[]>('getStockActivo'))
     
    );
  }


  getArticulo(id_marca:number,id_ganado:number): Observable<[]> {

    const apiUrl = `${base_url}/${this.sccionGetUrl}/${this.empresaSel.id}/articuloxmarcaycategoria/${id_marca}/${id_ganado}`;
    
    return this.http.get<[]>(apiUrl).pipe(
      //catchError(this.handleError<[]>('getStockActivo'))
     
    );
  }

  getDepositoStkSeleccionadoInd(ganado: any): Observable<any[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    const apiUrl = `${base_url}/${this.sccionGetUrl}/${this.empresaSel.id}/sector`;
  
 

    let params = new HttpParams();
    const caravanasUnicas = Array.from(new Set(ganado.map((item) => item.caravana)));

    Object.keys(caravanasUnicas).forEach((key) => {
      params = params.append(key, caravanasUnicas[key]);
    });

    let queryString = '';
    caravanasUnicas.forEach((caravana, index) => {
      if (index > 0) {
        queryString += '&';
      }
      queryString += `${index}=${caravana}`;
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
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    const apiUrl = `${base_url}/${this.sccionGetUrl}/${this.empresaSel.id}/deposito`;
  
 

    let params = new HttpParams();
    const caravanasUnicas = Array.from(new Set(ganado.map((item) => item.caravana)));

    Object.keys(caravanasUnicas).forEach((key) => {
      params = params.append(key, caravanasUnicas[key]);
    });

    let queryString = '';
    caravanasUnicas.forEach((caravana, index) => {
      if (index > 0) {
        queryString += '&';
      }
      queryString += `${index}=${caravana}`;
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
