import { Component } from '@angular/core';
import { InvoiceList } from '../invoice';
import { FacturaProvService } from '../factura-proveedor.service';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FeatherModule } from 'angular-feather';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-factura-proveedor',
  standalone: true,
  imports:[NgbPaginationModule, FeatherModule, RouterModule, NgbHighlight, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './lista-factura-proveedor.component.html'
})
export class ListadoFacturasProvComponent {

  compInvoice: InvoiceList[];


  // checkbox
  isMasterSel: boolean;
  checkedCategoryList: any;

  ///////////////////////////


  // pagination
  page = 1;
  pageSize = 5;
  totalLengthOfCollection: number;
  obtengoFacturasProv: InvoiceList[];


  constructor(public invoiceService:FacturaProvService) {

    this.invoiceService.getInvoicesWithLines().subscribe((dato) => {
          console.log(dato)
          this.obtengoFacturasProv =dato;
          this.compInvoice = dato;

              // pagination
              this.totalLengthOfCollection = this.obtengoFacturasProv.length;

              // checkbox
              this.isMasterSel = false;
              this.getCheckedItemList();
    });


    
    


  }




  deleteInvoice(id: number): void {




  
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


          this.invoiceService.deleteInvoice(id).subscribe();
          this.compInvoice = this.compInvoice.filter(invoice => invoice.id !== id);
          this.totalLengthOfCollection = this.compInvoice.length;
       
       
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
    for (var i = 0; i < this.compInvoice.length; i++) {
      this.compInvoice[i].isSelected = this.isMasterSel;
    }
    this.getCheckedItemList();
  }

  isAllSelected() {
    this.isMasterSel = this.compInvoice.every(function (item: any) {
      return item.isSelected == true;
    })
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.checkedCategoryList = [];
    for (var i = 0; i < this.compInvoice.length; i++) {
      if (this.compInvoice[i].isSelected)
        this.checkedCategoryList.push(this.compInvoice[i]);
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

    this.compInvoice = this.filter(val);
    this.totalLengthOfCollection = this.compInvoice.length;
  }

  filter(v: string) {
    return this.obtengoFacturasProv.filter(x => x.nombre_fantasia.toLowerCase().indexOf(v.toLowerCase()) !== -1 ||
      x.importe_total_mo !== -1);
  }
}
