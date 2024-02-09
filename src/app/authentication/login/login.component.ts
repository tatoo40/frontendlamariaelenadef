import { Component, AfterViewInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

import { LoginForm } from 'src/app/interfaces/login-form.interface';
import { RecoverForm } from 'src/app/interfaces/recover-form.interface';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { ErrorService } from 'src/app/services/error.service';
import { SeleccionEmpresaForm } from 'src/app/interfaces/seleccion-empresa-form.interface';
import { ObtengoDatosGeneralesService } from 'src/app/services/obtengo-datos-generales.service';
import { StockService } from 'src/app/services/stock.service';

declare const google: any;
const base_url = environment.base_url;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements AfterViewInit {
  msg = '';
  public formSubmitted = false;
  public recoverFormSubmitted = false;
  public seleccionarEmpresaFormSubmitted = false;
  public auth2: any;
  public empresas: any[] = [];
  loginform = false;
  recoverform = false;
  seleccionarempresaform = false;
  public loginForm = this.fb.group({
    email: [
      localStorage.getItem('email') || '',
      [Validators.required, Validators.email],
    ],
    hash: ['', Validators.required],
    remember: [false],
  });
  public recoverForm = this.fb.group({
    email: [
      localStorage.getItem('email') || '',
      [Validators.required, Validators.email],
    ],
  });
  public seleccionarEmpresaForm = this.fb.group({
    id_empresa: [
      localStorage.getItem('id_empresa') || '',
      [],
    ],
  });
  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private ngZone: NgZone,
    private http: HttpClient,
    private _errorService: ErrorService, private obtengoDatosGrales:ObtengoDatosGeneralesService,
    private stockService:StockService
  ) {

    this.loginform = true;
    this.recoverform = false;
    this.seleccionarempresaform = false;

  }

  ngAfterViewInit(): void {
    google.accounts.id.initialize({
      client_id:
        '57307569355-eqomd49h2q0ebequ1qqdpivu56hjnj8k.apps.googleusercontent.com',
      callback: (response: any) => this.handleGogoleSignIn(response),
    });

    google.accounts.id.renderButton(
      document.getElementById('my-signin2'),
      { size: 'large', type: 'icon', shape: 'pill' } // customization attributes
    );
  }

  handleGogoleSignIn(response: any) {
    //console.log(response.credential);

    // This next is for decoding the idToken to an object if you want to see the details.
    let base64Url = response.credential.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    //console.log(JSON.parse(jsonPayload));

    this.usuarioService.loginGoogle(response.credential).subscribe((resp) => {
      // Navegar al Dashboard
      this.ngZone.run(() => {
        this.router.navigateByUrl('/');
      });
    });
  }

  async loginUsuario() {
    this.formSubmitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    let partialDetails: Partial<LoginForm> = {
      email: this.loginForm.get('email').value,
      hash: this.loginForm.get('hash').value,
      remember: this.loginForm.get('remember').value,
    };

    let details: LoginForm = partialDetails as LoginForm;

    await this.usuarioService.loginUsuario(details).subscribe({
      next: async (resp) => {
        if (this.loginForm.get('remember').value) {
          localStorage.setItem('email', this.loginForm.get('email').value);
        } else {
          localStorage.removeItem('email');
        }

        const usuario_con = JSON.parse(
          localStorage.getItem('usuario_contectado')
        );

        //Tengo que resolver el usuario que tiene dos empresaa
        // si tiene una se va como por dentro un tubo
        // si tiene dos tiene que ir al componenete seleccionempres



        await this.http
          .get<any[]>(
            `${base_url}/general/usuarios_x_empresas/id_usuario/${usuario_con.id}`)
          .subscribe(async (resp: any[]) => {
            //console.log(JSON.stringify(resp))

            localStorage.setItem('usuarios_x_empresas', JSON.stringify(resp));

            var data = JSON.parse(localStorage.getItem('usuarios_x_empresas'));

           // console.log(data)
            if (Array.isArray(data)) {
                if (data.length === 1) {
                  // Si solo hay un registro de empresa, guarda la información y redirige al dashboard
                 await this.http
                  .get(`${base_url}/general/empresa/id/${data[0].id_empresa}`)
                  .subscribe((resp: any) => {
                    var empresaSel = resp[0]
                    localStorage.setItem('empresas', JSON.stringify(resp));


                    this.obtengoDatosGrales.obtengoDatosEmpresaUsuario(empresaSel.id);

                    this.stockService.getStockActivo().subscribe((dato) => {
          
                      localStorage.setItem('stockActivo', JSON.stringify(dato));   
                    
                    
                    });
                
                    this.stockService.getStockActivoVacasPrenadas().subscribe((datoPre) => {
                
                      localStorage.setItem('stockActivoVacasPrenadas', JSON.stringify(datoPre));   
                    
                    
                    });


                    this.router.navigate(['/dashboard']);
                  });

                


                } else  {
                  // Si hay más de un registro de empresa, redirige a la página de selección de empresa
                    this.seleccionarempresaform = true;
                                //OBTENGO LAS EMPRESAS Y LISTO EN EL SELECT
                    for (let i = 0; i < data.length; i++) {
                      const idEmpresa = data[i].id_empresa;

                      await this.http.get<any[]>(`${base_url}/general/empresa/id/${idEmpresa}`).subscribe((resp: any[]) => {
                      
                        if (resp && resp.length > 0) {
                          const empresa = { id: resp[0].id, nombre: resp[0].nombre };
                          this.empresas.push(empresa);
                        }

                      }, error => {
                        console.error('Error al obtener empresas para id', idEmpresa, ':', error);
                      });
                    }



                }
            
            }else{



              console.error('La respuesta no es un array:', data);

            }





          });

          //this.router.navigate(['/dashboard']);
      
      },
      
      error:(e:HttpErrorResponse)=>{
        this._errorService.msjError(e);
      }
    });
  }


  async seleccionarEmpresa(event) {

    const selectedEmpresaId = event.target.value; // Obtiene el ID de la empresa seleccionada


    await this.http.get<any[]>(`${base_url}/general/empresa/id/${selectedEmpresaId}`).subscribe((resp: any[]) => {
                      
      localStorage.setItem('empresas', JSON.stringify(resp));


      this.obtengoDatosGrales.obtengoDatosEmpresaUsuario(selectedEmpresaId);

      this.stockService.getStockActivo().subscribe((dato) => {

        localStorage.setItem('stockActivo', JSON.stringify(dato));   
      
      
      });
  
      this.stockService.getStockActivoVacasPrenadas().subscribe((datoPre) => {
  
        localStorage.setItem('stockActivoVacasPrenadas', JSON.stringify(datoPre));   
      
      
      });




      this.router.navigate(['/dashboard']);
      //var data = JSON.parse(localStorage.getItem('usuarios_x_empresas'));

    }, error => {
      console.error('Error al obtener empresas para id', selectedEmpresaId, ':', error);
    });

    // Navega al componente del dashboard
    

}


  recoverUsuario() {
    this.recoverFormSubmitted = true;

    if (this.recoverForm.invalid) {
      return;
    }

    let partialDetails: Partial<RecoverForm> = {
      email: this.recoverForm.get('email').value,
    };

    let details: RecoverForm = partialDetails as RecoverForm;

    this.usuarioService.recoverUsuario(details).subscribe({
      next: (resp) => {
        Swal.fire(
          'Bien hecho!',
          'Te hemos enviado un correo para que restablezcas tu password!',
          'success'
        );
      },
      error: (err) => {
        Swal.fire('Error', err.error.message, 'error');
      },
    });
  }


  showRecoverForm() {
    this.loginform = false
    this.recoverform = true
    this.seleccionarempresaform = false
  }

  showSeleccionarEmpresaForm() {
    this.loginform = false
    this.recoverform = false
    this.seleccionarempresaform = false
  }



}
