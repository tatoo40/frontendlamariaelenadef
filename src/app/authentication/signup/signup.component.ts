import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2'
import { ActivatedRoute, Router } from '@angular/router';
import { ObtengoDatosGeneralesService } from 'src/app/services/obtengo-datos-generales.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {

  //empresas = JSON.parse(localStorage.getItem("empresas"));
  public empresas:any
  public formSubmitted = false;
  registerForm: FormGroup;
public token: string;
public empresaId:number;
  //empresas = JSON.parse(localStorage.getItem("empresas"));

  //empresas: any = []; 

  
  


  constructor(private fb: FormBuilder,
    private usuarioService: UsuarioService, private router:Router, private datosIniciales:ObtengoDatosGeneralesService, 
    private _errorService:ErrorService,private route: ActivatedRoute ) {

      


      this.createForm();
    }


    ngOnInit(): void {
      this.route.params.subscribe(params => {
        const token = params['token'];
        // Haz lo que necesites con el token aquí
      });

      this.route.queryParams.subscribe(params => {
        this.token = params['token'];
        if (this.token) {
          this.validarToken(this.token);
        }
      });


        
      }
      //console.log(this.daata);
      validarToken(token: string): void {
        this.usuarioService.validarTokenEmpresa(token).subscribe({
          next: (resp) => {
            // Token válido, continuar con el registro
            this.empresaId= resp
            this.registerForm.get('id_empresa').setValue(resp);
          },
          error: (error) => {
            // Token inválido, mostrar mensaje de error o redirigir a una página de error
            this.router.navigate(['/error']);
          }
        });
      }  

    //console.log(this.daata);
   
 
    createForm() {
    
      this.registerForm = this.fb.group({

        nombre: ['',Validators.required],
        apellido: ['',Validators.required],
        email: ['',[Validators.required,Validators.email]],
        hash: ['',Validators.required],
        password2: ['',Validators.required],        
        terminos: [,Validators.required],
        id_empresa: [ this.empresaId,Validators.required],
        id_rol: [4],


  },
  {
    validators: this.passwordsIguales('hash','password2')
  }
  
  )
  
    }   


    crearUsuario() {
      this.formSubmitted = true;
    console.log(this.registerForm.invalid);
      if (this.registerForm.invalid) {
        return;
      }
      
      this.registerForm.get('id_empresa').setValue(this.empresaId);

      this.usuarioService.crearUsuario(this.registerForm.value).subscribe({
        next: (resp) => {
          console.log(resp);
          Swal.fire({
            icon: 'success',
            title: 'Empresa inscripta con éxito',
            text: 'Tu usuario ha sido registrado correctamente. Ya puede ingresar al sistema.',
            showConfirmButton: false,
            showCloseButton: true,
            timer: 5000,
            
             // Cierra automáticamente después de 3 segundos
          });
          this.router.navigate(['/authentication/login']);
        },       

        error: (e: HttpErrorResponse) => {
         this._errorService.msjError(e);
        }
      });
    }
    
    

  campoNoValido(campo:string):boolean{
    
    if(this.registerForm.get(campo).invalid && this.formSubmitted){

      return true;

    }else{

      return false;
    
    }
  }

  aceptaTerminos(){

    if (!this.registerForm.get('terminos').value && this.formSubmitted){
   
      return true
    
    }else{
    
      return false
    
    }
  }


  contrasenasNoValidas(){

      const pass1 = this.registerForm.get('hash').value;
      const pass2 = this.registerForm.get('password2').value;

      if ((pass1 !==pass2) && this.formSubmitted ){

        return true;
      
      }else{
      
        return false;
      
      }

  }

  passwordsIguales(pass1Name:string, pass2Name:string){

    return( formGroup: FormGroup)=>{

      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if(pass1Control.value === pass2Control.value){

        pass2Control.setErrors(null);
      }else{
        pass2Control.setErrors({ noEsIgual:true});
      }

    }

  }

  obtengoEmpresas() {
    
    this.datosIniciales.obtengoDatosEmpresas();

    this.empresas = JSON.parse(localStorage.getItem("empresas"));
    //console.log(localStorage.getItem("empresas"));

    //this.empresas = JSON.parse(localStorage.getItem("empresas"));

    //console.log(this.empresas)
   
  }
}


