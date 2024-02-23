import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap,map } from 'rxjs';
import { ErrorService } from './error.service';
import { environment } from '../environments/environment';


const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})

export class ApixuService {

  private seccionUrl = 'ganado'
  private sccionGetUrl = 'clima';

  constructor(private http: HttpClient, private _errorService:ErrorService) {}

  headers = new HttpHeaders().set('X-Requested-With', 'XMLHttpRequest');


  //headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
  //headers.append('Access-Control-Allow-Credentials', 'true');


  parametros= JSON.parse(localStorage.getItem('cpt_parametros_x_empresa'));




  getWeather(location){

    const empresa = JSON.parse(localStorage.getItem('empresas'));
    const empresaSel = empresa[0];
    const apiUrl = `${base_url}/${this.sccionGetUrl}/${empresaSel.id}`;
    
    return this.http.get(apiUrl)
    .pipe(
      map(response => response)
    );


  



  }


}
