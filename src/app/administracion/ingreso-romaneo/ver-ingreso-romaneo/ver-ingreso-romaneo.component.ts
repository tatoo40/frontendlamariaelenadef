import { Component, OnInit } from '@angular/core';
import { IngresoRomaneoService } from '../ingreso-romaneo.service';
import { RomaneoList } from '../romaneo';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ver-factura-proveedor',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ver-ingreso-romaneo.component.html',

})
export class verIngresoRomaneoComponent implements OnInit {
  id: any;
  
  romaneoDetail: RomaneoList = new RomaneoList();

  
  obtengoIngresoRomaneo: RomaneoList[];

  constructor(
    activatedRouter: ActivatedRoute,
    private ingresoRomaneoService: IngresoRomaneoService
  ) {
    this.id = activatedRouter.snapshot.paramMap.get('id');

    
    //this.invoiceDetail:InvoiceList[]=[];
    

    this.ingresoRomaneoService.getRomaneos().subscribe((dato) => {
    
      this.obtengoIngresoRomaneo =dato;
      this.romaneoDetail = this.obtengoIngresoRomaneo
      .filter((x) => x.id === +this.id)[0];

    });


    console.log( this.romaneoDetail);


  }

  ngOnInit() {}
}
