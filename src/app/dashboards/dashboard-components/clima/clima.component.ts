import { Component, OnInit } from '@angular/core';
import { ApixuService } from 'src/app/services/apixu.service';

@Component({
  selector: 'app-clima',
  templateUrl: './clima.component.html',
  styleUrls: ['./clima.component.scss']
})
export class ClimaComponent implements OnInit {
  temperatura_hoy_maxima: any;
  temperatura_hoy_minima:any;
  descripcion_clima_hoy: any;
  climaImagen: any;
  dia: Date
  DailyForecasts:[];
  weatherDataOtros:any;

  constructor(private apixuService: ApixuService) { }

  ngOnInit(): void {
    this.loadWeather('Rivera, Uruguay')
  }


  weatherData: any;

  loadWeather(location): void {
    this.apixuService.getWeather(location).subscribe(
      (data) => {

        //console.log(this.apixuService)
        this.weatherData = data;
        this.weatherDataOtros = data;
        this.weatherDataOtros = this.weatherData['DailyForecasts'].slice(1);
        //console.log(this.weatherData);       
       // console.log(this.weatherDataOtros);
        const climaRiveraString = this.weatherData['DailyForecasts'][0];
        this.temperatura_hoy_maxima = this.weatherData['DailyForecasts'][0].Temperature.Maximum.Value;
        this.temperatura_hoy_minima = this.weatherData['DailyForecasts'][0].Temperature.Minimum.Value;
        this.descripcion_clima_hoy =this.weatherData['DailyForecasts'][0].Day.ShortPhrase
        this.climaImagen= this.weatherData['DailyForecasts'][0].Day.Icon
        this.dia = new Date();
        //const clima = JSON.parse(climaRiveraString)
        //console.log(clima)
        // You can perform further operations with the data, such as updating your component's properties or displaying it in the template
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  } 
}
