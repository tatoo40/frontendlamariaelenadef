import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacturaProvService } from '../ingreso-romaneo.service';
import { InvoiceList, order } from '../romaneo';
import {
  UntypedFormGroup,
  UntypedFormArray,
  UntypedFormBuilder,
  Validators,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-factura-proveedor',
  standalone: true,
  imports:[FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './editar-factura-proveedor.component.html'
})
export class EditarFacturasProvComponent implements OnInit {
  id: any;
  invoice: InvoiceList;

  addForm: any;

  importe_mo = 0;
  importe_iva_mo = 0;
  importe_total_mo = 0;
  obtengoFacturasProv: InvoiceList[];

  constructor(
    activatedRouter: ActivatedRoute,
    private invoiceService: FacturaProvService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.id = activatedRouter.snapshot.paramMap.get('id');


    this.invoiceService.getInvoicesWithLines().subscribe((dato) => {
      this.obtengoFacturasProv =dato;
    });


    this.invoice =  this.obtengoFacturasProv
      .filter((x) => x.id === +this.id)[0];




      
    this.importe_mo = this.invoice.importe_mo;
    this.importe_iva_mo = this.invoice.importe_iva_mo;
    this.importe_total_mo = this.invoice.importe_total_mo;

    this.addForm = this.fb.group({
      item: this.fb.array([this.itemControl()]),
    });

    this.fillAddControls();
  }

  ngOnInit(): void {}

  itemControl(): UntypedFormGroup {
    return this.fb.group({
      itemName: ['', Validators.required],
      itemCost: ['', Validators.required],
      itemSold: ['', Validators.required],
      itemTotal: ['0'],
    });
  }

  fillAddControls() {
    this.addForm.setControl('item', this.setItem(this.invoice.orders));
  }

  setItem(order: any): UntypedFormArray {
    const fa = new UntypedFormArray([]);
    order.forEach((s: any) => {
      fa.push(
        this.fb.group({
          itemName: s.cod_articulo,
          itemCost: s.precio_unitario,
          itemSold: s.cantidad,
          itemTotal: s.importe_mo,
        })
      );
    });
    return fa;
  }

  btnAddItemClick(): void {
    (<UntypedFormArray>this.addForm.get('item')).push(this.itemControl());
  }

  btnRemoveClick(i: number): void {
    let totalCostOfItem =
      this.addForm.get('item')?.value[i].precio_unitario *
      this.addForm.get('item')?.value[i].cantidad;

    this.importe_mo = this.importe_mo - totalCostOfItem;
    this.importe_iva_mo = this.importe_mo / 22;
    this.importe_total_mo = this.importe_mo + this.importe_iva_mo;

    (<UntypedFormArray>this.addForm.get('item')).removeAt(i);
  }

  //////////////////////////////////////////////////////////////////////////////

  itemsChanged() {
    let total: number = 0;

    for (
      let t = 0;
      t < (<UntypedFormArray>this.addForm.get('item')).length;
      t++
    ) {
      if (
        this.addForm.get('item')?.value[t].itemCost != '' &&
        this.addForm.get('item')?.value[t].itemSold
      ) {
        total =
          this.addForm.get('item')?.value[t].itemCost *
            this.addForm.get('item')?.value[t].itemSold +
          total;
      }
    }
    this.importe_mo = total;
    this.importe_iva_mo = this.importe_mo / 22;
    this.importe_total_mo = this.importe_mo + this.importe_iva_mo;
  }

  saveDetail() {
    this.invoice.importe_iva_mo = this.importe_total_mo;
    this.invoice.importe_total_mo = this.importe_mo;
    this.invoice.importe_iva_mo = this.importe_iva_mo;

    this.invoice.orders = [];

    for (
      let t = 0;
      t < (<UntypedFormArray>this.addForm.get('item')).length;
      t++
    ) {
      let o: order = new order();
      o.cod_articulo = this.addForm.get('item')?.value[t].itemName;
      o.precio_unitario = this.addForm.get('item')?.value[t].itemCost;
      o.cantidad = this.addForm.get('item')?.value[t].itemSold;
      o.importe_mo = o.cantidad * o.precio_unitario;
      this.invoice.orders.push(o);
    }

    this.invoiceService.updateInvoice(this.invoice.id, this.invoice);
    alert('Invoice Updated !!');
    this.router.navigate(['/apps/invoice']);
  }
}
