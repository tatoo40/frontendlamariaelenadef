import { Component, ViewChild } from '@angular/core';
import { VisitSeparationComponent } from '../visit-separation/visit-separation.component';
import Swal from 'sweetalert2';

declare var require: any;
const data: any = require('./company.json');










console.log(data);

@Component({
  selector: 'app-vista-rapida-ganado',
  templateUrl: './vista-rapida-ganado.component.html',
  styleUrls: ['./vista-rapida-ganado.component.scss'],

})
export class VistaRapidaGanadoComponent {
  editing:any = {};
  rows: any = new Array;
  temp = [...data];

  loadingIndicator = true;
  reorderable = true;

  columns = [{ prop: 'Caravana' }, { name: 'Categoria' }, { name: 'Lote' }, 
  { name: 'Peso' },{ name: 'Un' }];

  @ViewChild(VistaRapidaGanadoComponent) table: VistaRapidaGanadoComponent | any;

  constructor() {
    this.rows = data;
    this.temp = [...data];
    setTimeout(() => {
      this.loadingIndicator = false;
    }, 1500);
  }

  updateFilter(event:any) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function(d) {
      return d.Caravana.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    
    this.table = data;
  }
  updateValue(event:any, cell:any, rowIndex:number) {
    
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows]; 
    
  }
}


function imprimoMensajeError(title: string, text: string) {
  Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: false,
  });
}
