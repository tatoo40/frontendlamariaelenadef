import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { TipoCambioDiario } from './tipo-cambio-diario';
import { environment } from 'src/app/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class TipoCambioDiarioRxjsServiceService {
  private tipoCambioGetUrl = 'general/tipo_cambio_diario?ord=desc';
  private tipoCambioUrl = 'general/tipo_cambio_diario';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  getTipoCambio(): Observable<TipoCambioDiario[]> {
    return this.http.get<TipoCambioDiario[]>(`${base_url}/${this.tipoCambioGetUrl}`)
      .pipe(
        catchError(this.handleError<TipoCambioDiario[]>('getTipoCambio', []))
      );
  }

  deleteTipoCambio(tc: TipoCambioDiario | number): Observable<TipoCambioDiario> {
    const id = typeof tc === 'number' ? tc : tc.id;
    const url = `${base_url}/${this.tipoCambioUrl}/${id}`;

    return this.http.delete<TipoCambioDiario>(url).pipe(
      tap((_) => this.log(`deleted Tc id=${id}`)),
      catchError(this.handleError<TipoCambioDiario>('deleteTc'))
    );
  }

  addTipoCambio(tipoCambio: TipoCambioDiario): Observable<TipoCambioDiario> {
    return this.http.post<TipoCambioDiario>(`${base_url}/${this.tipoCambioUrl}`, tipoCambio)
      .pipe(
        tap((newTC: TipoCambioDiario) => this.log(`added tc w/ id=${newTC.id}`)),
        catchError(this.handleError<TipoCambioDiario>('addTc'))
      );
  }

  updateTipoCambio(tc: TipoCambioDiario | number, tipoCambio: TipoCambioDiario): Observable<TipoCambioDiario> {
    const id = typeof tc === 'number' ? tc : tc.id;
    const url = `${base_url}/${this.tipoCambioUrl}/${id}`;

    return this.http.patch<TipoCambioDiario>(url, tipoCambio).pipe(
      tap((updatedTC: TipoCambioDiario) => this.log(`updated tc w/ id=${updatedTC.id}`)),
      catchError(this.handleError<TipoCambioDiario>('updateTc'))
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
