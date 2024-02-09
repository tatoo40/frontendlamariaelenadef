import { Component, AfterViewInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

import { SeleccionEmpresaForm } from 'src/app/interfaces/seleccion-empresa-form.interface';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { ErrorService } from 'src/app/services/error.service';

declare const google: any;
const base_url = environment.base_url;

@Component({
  selector: 'app-seleccion-empresa',
  templateUrl: './seleccionaempresa.component.html',
})
export class SeleccionEmpresaComponent implements AfterViewInit {
  msg = '';
  public formSubmitted = false;

  public auth2: any;
  public empresas:any
  
  public seleccionEmpresaForm: FormGroup;





  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private ngZone: NgZone,
    private http: HttpClient,
    private _errorService: ErrorService
  ) {


    this.createForm();
  }

  ngAfterViewInit(): void {

  }


  seleccionEmpresa(){

  }

  createForm(){

    this.seleccionEmpresaForm = this.fb.group({

      nombre: ['',Validators.required],
      apellido: ['',Validators.required],
      email: ['',[Validators.required,Validators.email]],
      hash: ['',Validators.required],
      password2: ['',Validators.required],        
      terminos: [,Validators.required],
  
      id_rol: [4],
      })
  }

  //seleccionEmpresaForm = true;


  
}
