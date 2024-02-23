import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, from, of, map, tap } from 'rxjs';
import { InvoiceList, order } from './invoice';
import { environment } from 'src/app/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const base_url = environment.base_url;

@Injectable()
export class FacturaProvService {
  obtengoFacturasProv: any;

  constructor(private Http: HttpClient) {
    this.getInvoice(1).subscribe((data) => this.invoiceList.push(data));
  }

  empresaSel = JSON.parse(localStorage.getItem('empresas'));
  empresa = this.empresaSel[0];
  private sccionGetUrl = 'utiles/' + this.empresa.id + '/facturasprov';
  //private seccionUrl = 'general/'+seccion;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  private invoiceList: InvoiceList[] = [];

  private getInvoice(idInvoice: number): Observable<InvoiceList> {
    const apiUrl = `${base_url}/${this.sccionGetUrl}/lineas`;
    return this.Http.get<InvoiceList>(apiUrl).pipe(
      catchError(this.handleError<InvoiceList>('getInvoice'))
    );
  }

  getInvoicesWithLines(): Observable<InvoiceList[]> {
    const invoicesUrl = `${base_url}/${this.sccionGetUrl}`;
    const invoiceLinesUrl = `${base_url}/${this.sccionGetUrl}/lineas`;

    return forkJoin([
      this.Http.get<InvoiceList[]>(invoicesUrl),
      this.Http.get<order[]>(invoiceLinesUrl),
    ]).pipe(
      catchError((error) => {
        // Handle errors if necessary
        throw new Error(
          `Failed to fetch invoices and invoice lines: ${error.message}`
        );
      }),
      map(([InvoiceList, order]) => {
        return InvoiceList.map((invoice) => {
          invoice.orders = order.filter(
            (line) => line.nro_trans === invoice.nro_trans
          );
          return invoice;
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
  getProveedoresParaFacturar() {
    const url = `${base_url}/utiles/${+this.empresa
      .id}/proveedoresParaFacturar`;
    return this.Http.get(url).pipe(
      catchError(this.handleError('proveedoresParaFacturar'))
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
  //  this.invoiceList = this.invoiceList.filter((CId) => CId.id !== id);
  //}

  deleteInvoice(dato: InvoiceList | number): Observable<InvoiceList> {
    const id = typeof dato === 'number' ? dato : dato.id;
    const url = `${base_url}/utiles/eliminoFactProv/${id}`;

    return this.Http.delete<InvoiceList>(url).pipe(
      tap((_) => this.log(`deleted Dato id=${id}`)),
      catchError(this.handleError<InvoiceList>('deleteDato'))
    );
  }


  public addInvoice(invoice: InvoiceList) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    const body = JSON.stringify(invoice); // Convert the JSON object to a string
  
      console.log(body);
      return this.Http.post<InvoiceList>(`${base_url}/utiles/cargarFactProv`, invoice)
      .pipe(
        tap((newInvoice: InvoiceList) => this.log(`added invoice w/ id=${newInvoice.id}`)),
        catchError(this.handleError<InvoiceList>('addInvoice'))
      );    

/*     return this.Http.post(`${base_url}/utiles/cargarFactProv`, body, {
      headers: headers,
    }).pipe(
      tap((resp: any) => {
        console.log(resp);
        this.invoiceList.splice(0, 0, invoice);
      })
    ); */
  }






  public updateInvoice(id: number, invoice: InvoiceList) {
    this.getInvoicesWithLines().subscribe((dato) => {
      this.obtengoFacturasProv = dato;
    });

    let invoiceDetail = this.obtengoFacturasProv.filter((x) => x.id === id)[0];
    invoiceDetail = invoice;
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
