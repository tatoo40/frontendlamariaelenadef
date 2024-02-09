import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';



const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CargaMasivaService {



  public auth2:any

  constructor(private http: HttpClient,
    private router:Router, private ngZone:NgZone) {}

    
  

    suboGanadoMasiva(formData: any,accion){

    // Creo usuario 
    // Creo Empresa
    // Creo Usuario por empresa
    // Principio solo estructura con La Maria Elena 
    //formData = [{email: 'floreciarm@gmail.com', hash: 'Rambla13', remember: false}]

    
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    console.log(formData);
    return this.http.post(`${base_url}/accionxlote/${accion}`, formData, {headers: headers})
      .pipe(
        tap((resp:any)=>{
          console.log(resp)
        })
      )

      
  }  
  

}