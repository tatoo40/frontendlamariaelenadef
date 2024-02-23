import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, from, of, map, tap } from 'rxjs';
import { RomaneoList, lineaRomaneo } from './romaneo';
import { environment } from 'src/app/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const base_url = environment.base_url;

@Injectable()
export class IngresoRomaneoService {
  obtengoRomaneos: any;

  constructor(private Http: HttpClient) {
    //this.getRomaneo(1).subscribe((data) => this.RomaneoList.push(data));
  }

  empresaSel = JSON.parse(localStorage.getItem('empresas'));
  empresa = this.empresaSel[0]
  
  private sccionGetUrl = 'utiles/' + this.empresa.id + '/romaneos';
  //private seccionUrl = 'general/'+seccion;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  private RomaneoList: RomaneoList[] = [];

  private getRomaneo(idRomaneo: number): Observable<RomaneoList> {
    const apiUrl = `${base_url}/${this.sccionGetUrl}/lineas`;
    return this.Http.get<RomaneoList>(apiUrl).pipe(
      catchError(this.handleError<RomaneoList>('getRomaneo'))
    );
  }



  
  getRomaneos(): Observable<RomaneoList[]> {
    const invoicesUrl = `${base_url}/${this.sccionGetUrl}`;
    const invoiceLinesUrl = `${base_url}/${this.sccionGetUrl}/lineas`;

    return forkJoin([
      this.Http.get<RomaneoList[]>(invoicesUrl),
      this.Http.get<lineaRomaneo[]>(invoiceLinesUrl),
    ]).pipe(
      catchError((error) => {
        // Handle errors if necessary

        throw new Error(
          `Failed to fetch invoices and invoice lines: ${error.message}`
        );
      }),
      map(([RomaneoList, lineasRomaneo]) => {
        return RomaneoList.map((romaneo) => {
          romaneo.lineasRomaneo = lineasRomaneo.filter(
            (line) => line.nro_trans === romaneo.nro_trans
          );
          return romaneo;
        });
      })
    );
  }

  ////proveedoresParaFacturar
  //':id_empresa/$/:id_proveedor')

  getLotesDeEntradaACostear() {
    const url = `${base_url}/utiles/${+this.empresa.id}/lotesDeEntradaACostear`;
    return this.Http.get(url).pipe(
      catchError(this.handleError('getLotesDeEntradaACostear'))
    );
  }

  getLotesDeSalida() {
    const url = `${base_url}/utiles/${+this.empresa.id}/lotesDeSalida`;
    return this.Http.get(url).pipe(
      catchError(this.handleError('getLotesDeSalida'))
    );
  }


  getAnimalesLoteSalida(nroTrans){
      const url = `${base_url}/utiles/${+this.empresa.id}/animalesLoteSalida/${nroTrans}`;
      return this.Http.get(url).pipe(
        catchError(this.handleError('getAnimalesLoteSalida'))
      );   
  }

  
  getClientes() {
    const url = `${base_url}/utiles/${+this.empresa
      .id}/clientesRomaneo`;
    return this.Http.get(url).pipe(
      catchError(this.handleError('ClientesParaFacturar'))
    );
  }

  getArticulosFactxProv(proveedor: number) {
    const url = `${base_url}/utiles/${+this.empresa
      .id}/articulosFactxProv/${proveedor}`;
    return this.Http.get(url).pipe(
      catchError(this.handleError('articulosFactxProv'))
    );
  }

  //public deleteInvoice(id: number) {
  //  this.RomaneoList = this.RomaneoList.filter((CId) => CId.id !== id);
  //}

  deleteRomaneo(dato: RomaneoList | number): Observable<RomaneoList> {
    const id = typeof dato === 'number' ? dato : dato.id;
    const url = `${base_url}/utiles/eliminoRomaneo/${id}`;

    return this.Http.delete<RomaneoList>(url).pipe(
      tap((_) => this.log(`deleted Dato id=${id}`)),
      catchError(this.handleError<RomaneoList>('deleteDato'))
    );
  }


  public addRomaneo(invoice: RomaneoList) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    const body = JSON.stringify(invoice); // Convert the JSON object to a string
  
      console.log(body);
      return this.Http.post<RomaneoList>(`${base_url}/utiles/guardarRomaneo`, invoice)
      .pipe(
        tap((newInvoice: RomaneoList) => this.log(`added romaneo w/ id=${newInvoice.id}`)),
        catchError(this.handleError<RomaneoList>('addRomneo'))
      );    


  }


  public updateRomaneo(id: number, romaneo: RomaneoList) {
    this.getRomaneos().subscribe((dato) => {
      this.obtengoRomaneos = dato;
    });

    let romaneoDetail = this.obtengoRomaneos.filter((x) => x.id === id)[0];
    romaneoDetail = romaneo;
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
