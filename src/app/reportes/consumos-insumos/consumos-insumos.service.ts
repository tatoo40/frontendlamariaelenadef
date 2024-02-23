import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Datos } from './consumos-insumos';
import { environment } from 'src/app/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const base_url = environment.base_url;
const seccion= 'marca_ganado';

@Injectable({
  providedIn: 'root',
})


export class ConsumosInsumosService   {
  private sccionGetUrl = 'reportes';
  private seccionUrl = 'general/'+seccion;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  //private datos: Datos[] = users;





  getDatos(empresa:number): Observable<Datos[]> {
    const apiUrl = `${base_url}/${this.sccionGetUrl}/${empresa}/consumosinsumos`;
    
    return this.http.get<Datos[]>(apiUrl).pipe(
      catchError(this.handleError<Datos[]>('getDatos'))
    );
  }



  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    // this.messageService.add(`HeroService: ${message}`);
  }
}
