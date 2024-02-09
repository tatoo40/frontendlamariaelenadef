import { Component } from '@angular/core';
import { RomaneoList } from '../romaneo';
import { IngresoRomaneoService } from '../ingreso-romaneo.service';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FeatherModule } from 'angular-feather';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listado-ingreso-romaneo',
  standalone: true,
  imports:[NgbPaginationModule, FeatherModule, RouterModule, NgbHighlight, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './lista-ingreso-romaneo.component.html'
})
export class ListadoIngresosRomaneoComponent {

  compRomaneo: RomaneoList[];


  // checkbox
  isMasterSel: boolean;
  checkedCategoryList: any;

  ///////////////////////////


  // pagination
  page = 1;
  pageSize = 5;
  totalLengthOfCollection: number;
  obtengoRomaneosCliente: RomaneoList[];


  constructor(public romaneoService:IngresoRomaneoService) {

    this.romaneoService.getRomaneos().subscribe((dato) => {
          this.obtengoRomaneosCliente =dato;
          this.compRomaneo = dato;

              // pagination
              this.totalLengthOfCollection = this.obtengoRomaneosCliente.length;

              // checkbox
              this.isMasterSel = false;
              this.getCheckedItemList();
    });


    
    


  }




  deleteRomaneo(id: number): void {




  
      Swal.fire({
        title: 'Esta seguro que desea eliminar este registro?',
        text: '',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, borrarlo!',
        cancelButtonText: 'No, mantenerlo',
      }).then((result) => {
        if (result.value) {
          Swal.fire(
            'Proceso finalizado con exito!',
            'El registro se ha eliminado con exito.',
            'success'
          );


          this.romaneoService.deleteRomaneo(id).subscribe();
          this.compRomaneo = this.compRomaneo.filter(romaneo => romaneo.id !== id);
          this.totalLengthOfCollection = this.compRomaneo.length;
       
       
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Proceso cancelado',
            'El registrno no ha sido elimiado :)',
            'error'
          );
        }
      });
    


 
 
  }


  // check-box.

  checkUncheckAll() {
    for (var i = 0; i < this.compRomaneo.length; i++) {
      this.compRomaneo[i].isSelected = this.isMasterSel;
    }
    this.getCheckedItemList();
  }

  isAllSelected() {
    this.isMasterSel = this.compRomaneo.every(function (item: any) {
      return item.isSelected == true;
    })
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.checkedCategoryList = [];
    for (var i = 0; i < this.compRomaneo.length; i++) {
      if (this.compRomaneo[i].isSelected)
        this.checkedCategoryList.push(this.compRomaneo[i]);
    }
    this.checkedCategoryList = JSON.stringify(this.checkedCategoryList);
  }


  /////////////////

  _searchTerm: string = '';
  get searchTerm(): string {
    return this._searchTerm;
  }
  set searchTerm(val: string) {
    this._searchTerm = val;

    this.compRomaneo = this.filter(val);
    this.totalLengthOfCollection = this.compRomaneo.length;
  }

  filter(v: string) {
    return this.compRomaneo.filter(x => x.nombre_fantasia.toLowerCase().indexOf(v.toLowerCase()) !== -1 ||
      x.importe_total_mo !== -1);
  }
}
