import { Component, OnInit } from '@angular/core';
import { FacturaProvService } from '../factura-proveedor.service';
import { InvoiceList } from '../invoice';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ver-factura-proveedor',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ver-factura-proveedor.component.html',

})
export class VerFacturaProvComponent implements OnInit {
  id: any;
  
  invoiceDetail: InvoiceList = new InvoiceList();

  
  obtengoFacturasProv: InvoiceList[];

  constructor(
    activatedRouter: ActivatedRoute,
    private facturaProvService: FacturaProvService
  ) {
    this.id = activatedRouter.snapshot.paramMap.get('id');

    
    //this.invoiceDetail:InvoiceList[]=[];
    

    this.facturaProvService.getInvoicesWithLines().subscribe((dato) => {
      
      this.obtengoFacturasProv =dato;
      this.invoiceDetail = this.obtengoFacturasProv
      .filter((x) => x.id === +this.id)[0];

    });





  }

  ngOnInit() {}
}
