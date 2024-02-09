import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { ObtengoDatosGeneralesService } from 'src/app/services/obtengo-datos-generales.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service';


@Component({
  selector: 'app-companysignup',
  templateUrl: './companysignup.component.html'
})
export class CompanySignupComponent implements OnInit {

  //empresas = JSON.parse(localStorage.getItem("empresas"));
  public empresas:any
  public formSubmitted = false;
  registerForm: FormGroup;

  //empresas = JSON.parse(localStorage.getItem("empresas"));

  //empresas: any = []; 

  
  


  constructor(private fb: FormBuilder,
    private usuarioService: UsuarioService, private router:Router, private datosIniciales:ObtengoDatosGeneralesService, private _errorService:ErrorService ) {


      this.createForm();
    }


    ngOnInit(): void {

      
    }
    //console.log(this.daata);
   
 
    createForm() {
    
      this.registerForm = this.fb.group({

        nombre: ['',Validators.required],
        razon_social: ['',Validators.required],
        rut: ['',Validators.required],
        direccion: ['',Validators.required],
        telefono_contacto: ['',Validators.required],
        email_contacto: ['',[Validators.required,Validators.email]],     
        terminos: [,Validators.required],
        aprobada:false,
        activa:false


  }
  
  
  )
  
    }   


    crearEmpresa() {
      this.formSubmitted = true;
      
      if (this.registerForm.invalid) {
        return;
      }
    
      this.usuarioService.crearEmpresa(this.registerForm.value).subscribe({
        next: (resp) => {
          console.log(resp);
          Swal.fire({
            icon: 'success',
            title: 'Empresa inscripta con éxito',
            text: 'Tu empresa ha sido inscripta correctamente. Recibirás más instrucciones por correo electrónico.',
            showConfirmButton: false,
            timer: 5000,
            
             // Cierra automáticamente después de 3 segundos
          });
        },
        error: (e: HttpErrorResponse) => {
          console.log(e);
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




 
}


