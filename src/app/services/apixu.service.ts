import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap,map } from 'rxjs';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})

export class ApixuService {

  constructor(private http: HttpClient, private _errorService:ErrorService) {}

  headers = new HttpHeaders().set('X-Requested-With', 'XMLHttpRequest');

  parametros= JSON.parse(localStorage.getItem('cpt_parametros_x_empresa'));

  getWeather(location){
    return this.http.get(`https://cors-anywhere.herokuapp.com/http://dataservice.accuweather.com/forecasts/v1/daily/5day/${this.parametros[0].locacion_accuweather}?apikey=${this.parametros[0].api_accuweather}&language=es-UY&details=true&metric=true`, { headers: this.headers })
    .pipe(
      map(response => response)
    );
  }
}
