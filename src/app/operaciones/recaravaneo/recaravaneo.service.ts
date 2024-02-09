import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Datos } from './recaravaneo';
import { environment } from 'src/app/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StockService } from 'src/app/services/stock.service';

const base_url = environment.base_url;
const seccion= 'cpt_recaravaneo';



@Injectable({
  providedIn: 'root',
})


export class RecaravaneoService {

  empresa = JSON.parse(localStorage.getItem('empresas'));

  private sccionGetUrl = 'recaravaneo/'+parseInt(this.empresa.id)+'?ord=desc';
  private seccionUrl = 'recaravaneo/'+parseInt(this.empresa.id);


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  //private datos: Datos[] = users;


  

  getDatos(): Observable<Datos[]> {
    const apiUrl = `${base_url}/${this.sccionGetUrl}`;
    
    return this.http.get<Datos[]>(apiUrl).pipe(
      catchError(this.handleError<Datos[]>('getDatos'))
    );
  }

  deleteDato(dato: Datos | number): Observable<Datos> {
    const id = typeof dato === 'number' ? dato : dato.id;
    const url = `${base_url}/${this.seccionUrl}/${id}`;

    return this.http.delete<Datos>(url).pipe(
      tap((_) => this.log(`deleted Dato id=${id}`)),
      catchError(this.handleError<Datos>('deleteDato'))
    );
  }

  addDato(dato: Datos): Observable<Datos> {
    dato.id_empresa=this.empresa.id;

    return this.http.post<Datos>(`${base_url}/${this.seccionUrl}`, dato)
      .pipe(
        tap((newDato: Datos) => this.log(`added dato w/ id=${newDato.id}`)),
        catchError(this.handleError<Datos>('addDato'))
      );
  }

  updateDato(data: Datos | number, dato: Datos): Observable<Datos> {
    const id = typeof data === 'number' ? data : data.id;
    const url = `${base_url}/${this.seccionUrl}/${id}`;

    return this.http.patch<Datos>(url, dato).pipe(
      tap((updatedDato: Datos) => this.log(`updated dato w/ id=${updatedDato.id}`)),
      catchError(this.handleError<Datos>('updatedDato'))
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
