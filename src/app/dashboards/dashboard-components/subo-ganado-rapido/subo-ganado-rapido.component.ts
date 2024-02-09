import { Component, OnInit } from '@angular/core';
import { CsvService } from '../../../services/csv.service';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute } from '@angular/router';


declare var require: any;
const data: any = [];


@Component({
  selector: 'app-subo-ganado-rapido',
  templateUrl: './subo-ganado-rapido.component.html',
  styleUrls: ['./subo-ganado-rapido.component.scss']
})
export class SuboGanadoRapidoComponent implements OnInit {
 
  constructor(private CsvService:CsvService, private modalService: NgbModal, private route: ActivatedRoute,) { 

  }

  ngOnInit() {
    this.route.url.subscribe(segments => {
      if (segments.some(segment => segment.path === 'accion-individual')) {
        this.modalOpenRegiser('modalRegiser');
      }
    });
  }


  modalOpenRegiser(modalRegiser: any) {
    this.modalService.open(modalRegiser);
  }


}
