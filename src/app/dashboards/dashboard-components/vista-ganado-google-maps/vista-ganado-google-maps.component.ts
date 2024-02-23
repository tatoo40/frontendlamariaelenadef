import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Datos } from 'src/app/reportes/inventario-stk/inventario-stk';
import { InventarioStkService } from 'src/app/reportes/inventario-stk/inventario-stk.service';
import { CtrlTrans } from 'src/app/services/ctrl-trans.service';
import { PermisosAccionService } from 'src/app/services/permisos-accion.service';
import { UtilesServices } from 'src/app/services/utiles-service';

declare var require: any;
const data: any = require('./company.json');





@Component({
  selector: 'app-vista-ganado-google-maps',
  templateUrl: './vista-ganado-google-maps.component.html',
  styleUrls: ['./vista-ganado-google-maps.component.scss']
})


export class VistaGanadoGoogleMapsComponent implements AfterViewInit {


  public apiLoaded: any = false;
  public markers: Array<any> = [];
  public period = 10000;
  public iconStr = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";

  public options: google.maps.MapOptions = {
    center: {lat: -33.853759, lng: 151.212803}, // Sydney Harbour center
    zoom: 10,
  };


  markerLabelsToDataMap: { [key: string]: any } = {};

  DatoList: Datos[] = [];
  filterArray: Datos[] = [];
  DatoDetail: Datos | null = null;
  DatoSector: Datos[] = [];
  DatoDetailSector: Datos[];
  //markers:any;


 

  secciones = JSON.parse(localStorage.getItem('seccion'));
  tipos_ganado = JSON.parse(localStorage.getItem('tipo_ganado'));
  categoriaGanado = JSON.parse(localStorage.getItem('categoria_ganado'));
  tiposArticulo  = JSON.parse(localStorage.getItem('tipo_articulo'));
  empresas= JSON.parse(localStorage.getItem('empresas'));
  emprsasSel= this.empresas[0]
  sectores= JSON.parse(localStorage.getItem('sector'));
  
  nombreSeccion = 'Inventario de stock';
  nombreSeccionTabla = 'marcas_ganado';
  seccionTrabajo = this.secciones.filter(
    (seccion) => seccion.tabla === this.nombreSeccionTabla
  );
  seccion = this.seccionTrabajo[0].id;
  currentMarkerTitle: string;
  currentMarkerCodigoSector:  string | google.maps.MarkerLabel;


  
  constructor(

    private Datoservice: InventarioStkService,
    private permisos: PermisosAccionService,
    private evaluoTrans: CtrlTrans,
    private mapService:UtilesServices


  ){}

 

  ngAfterViewInit(): void {
    

    this.Datoservice.getDatos(this.emprsasSel.id).subscribe((dato) => {

      this.DatoList = dato;
      this.filterArray = this.DatoList;
    
      // OBTENGO LOS SECTORES
      const resultadoSector = this.DatoList.reduce((acumulador, elemento) => {
      const codigoSector = ""+`${elemento.codigo_sector}`;
 
  


        if (!acumulador[codigoSector]) {
          acumulador[codigoSector] = {
            codigo_sector: ""+elemento.codigo_sector,
            nombre_sector: elemento.nombre_sector,
            latitud:elemento.latitud,
            longitud:elemento.longitud,
            cantidad: 0,
            kilos: 0
            // Agrega aquí otras propiedades si es necesario
          };
        }

        


  
        acumulador[codigoSector].cantidad += elemento.cantidad;
        acumulador[codigoSector].kilos += elemento.kilos;
  
        return acumulador;
      }, {});
 
      





      // Convertir el objeto resultado a un array de objetos
      this.DatoSector= Object.values(resultadoSector);

      //console.log(this.DatoSector);


  
      this.DatoSector.map((dato, index) => {
        const lat = parseFloat(dato.latitud);
        const lng = parseFloat(dato.longitud);
      
        //console.log(lat)
        //console.log(lng)

            
            this.markers.push({
              tripId: 1,
              position: {
                lat: lat,
                lng: lng,
              },
              title: dato.nombre_sector,
              label: "" + dato.codigo_sector,
              options: {
                icon: this.iconStr,
              }
            });



      }).filter(marker => marker !== null); // Filtrar los marcadores que hayan fallado en la conversión
      // articulo sector
      

      // Crear el mapa de etiquetas a datos
      this.DatoSector.forEach((dato) => {
        this.markerLabelsToDataMap[""+dato.codigo_sector] = dato; // Asociar la etiqueta con los datos
      });
   
      //console.log(this.markers);
      const bounds = this.getBounds(this.markers);
      this.map.googleMap.fitBounds(bounds);
    


      const resultadoArticuloSector = this.DatoList.reduce((acumulador, elemento) => {
      const codigoArticuloSector = `${elemento.codigo_articulo}-${""+elemento.codigo_sector}`;
 
  


        if (!acumulador[codigoArticuloSector]) {
          acumulador[codigoArticuloSector] = {
            codigo_articulo: elemento.codigo_articulo,
            nombre_articulo: elemento.nombre_articulo,
            codigo_sector: ""+elemento.codigo_sector,
            nombre_sector: elemento.nombre_sector,
            codigo_categoria_ganado:elemento.codigo_categoria_ganado,
            id_tipo_articulo:elemento.id_tipo_articulo,
            descripcion_corta:elemento.descripcion_corta,
            cantidad: 0,
            kilos: 0
            // Agrega aquí otras propiedades si es necesario
          };
        }

        


  
        acumulador[codigoArticuloSector].cantidad += elemento.cantidad;
        acumulador[codigoArticuloSector].kilos += elemento.kilos;
  
        return acumulador;
      }, {});
 
      


      // Convertir el objeto resultado a un array de objetos
      this.DatoDetailSector= Object.values(resultadoArticuloSector);

      //console.log(this.DatoDetailSector)

    });


  }



  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow;
 
  infoContent = ''


  public openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow, label:string) {

    //console.log(marker)
    this.currentMarkerTitle = marker.getTitle() ?? ''; // Obtiene el título del marcador actual o establece una cadena vacía si es nulo


      this.currentMarkerCodigoSector = ""+label; // Obtiene los datos asociados con la etiqueta del marcador
  

 
    infoWindow.open(marker);
  }

  mapOptions: google.maps.MapOptions = {
    center: { lat: -31.412367038277416, lng: -55.40076642068491},
    zoom: 15
  };



 markerOptions: google.maps.MarkerOptions = {draggable: false};
 markerPositions: google.maps.LatLngLiteral[] = [];

 addMarker(event: google.maps.MapMouseEvent) {
   this.markerPositions.push(event.latLng.toJSON());
 }

// Suponiendo que this.DatoSector contiene datos de latitud y longitud

  




getBounds(markers){
  let north;
  let south;
  let east;
  let west;

  for (const marker of markers){
    // set the coordinates to marker's lat and lng on the first run.
    // if the coordinates exist, get max or min depends on the coordinates.
    north = north !== undefined ? Math.max(north, marker.position.lat) : marker.position.lat;
    south = south !== undefined ? Math.min(south, marker.position.lat) : marker.position.lat;
    east = east !== undefined ? Math.max(east, marker.position.lng) : marker.position.lng;
    west = west !== undefined ? Math.min(west, marker.position.lng) : marker.position.lng;
  };

  const bounds = { north, south, east, west };

  return bounds;
}


}
//console.log(markers)
