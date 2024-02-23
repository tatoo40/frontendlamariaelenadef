import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { tap, map,catchError } from 'rxjs/operators'
import { of, Observable } from 'rxjs';

import { Router } from '@angular/router';

import { LoginForm } from  '../interfaces/login-form.interface'
import { RegisterForm } from  '../interfaces/register-form.interface'
import { RecoverForm } from '../interfaces/recover-form.interface';
import { ObtengoDatosGeneralesService } from './obtengo-datos-generales.service';
import { StockService } from './stock.service';

declare const google:any;


const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  public auth2:any

  constructor(private http: HttpClient,
    private router:Router, private ngZone:NgZone, private obtengoDatosGrales:ObtengoDatosGeneralesService,
    private stockService:StockService) {}

     



  logout(){

    console.log('aca logout')
    localStorage.removeItem('token');

 
    this.auth2.signOut().then(function () {

        this.ngZone.run(() => {
        this.router.navigateByUrl('/login')

      });
      google.disconnect();


    })
   
  }

  validarToken(): Observable<boolean> {
      const token = localStorage.getItem('token') || '';
      //console.log(token);
      return this.http.get(`${ base_url }/auth/validoToken`,{
        headers: {
          'x-token':token
        }
      }).pipe(
        tap((resp:any)=>{
            //console.log(resp);

            if (resp===true){
               
                return true;

            }else{

                return false;
            
            }



          
        }),
        catchError(error=>of(false))
      )


  }


  crearUsuario(formData: RegisterForm){

    // Creo usuario 
    // Creo Empresa
    // Creo Usuario por empresa
    // Principio solo estructura con La Maria Elena  
    //console.log('aca')
    return this.http.post(`${base_url}/auth/signup`, formData)
      .pipe(
        tap((resp:any)=>{
          localStorage.setItem('token',resp.access_token)
        })
      )


  }  
  
  crearEmpresa(formData: RegisterForm){

    // Creo usuario 
    // Creo Empresa
    // Creo Usuario por empresa
    // Principio solo estructura con La Maria Elena  
    return this.http.post(`${base_url}/auth/companysignup`, formData)
      .pipe(
        tap((resp:any)=>{
           //resp
        })
      )


  }  
  validarTokenEmpresa(token: string){

    // Creo usuario 
    // Creo Empresa
    // Creo Usuario por empresa
    // Principio solo estructura con La Maria Elena  
    const apiUrl = `${base_url}/auth/apruebotokenempresa/${token}`;
    
    return this.http.get(`${apiUrl}`)
      .pipe(
        tap((resp:any)=>{
          //localStorage.setItem('token',resp.access_token)
        })
      )


  }  


  loginUsuario(formData: LoginForm){


    //console.log(formData);
    // Creo usuario 
    // Creo Empresa
    // Creo Usuario por empresa
    // Principio solo estructura con La Maria Elena  
    //console.log(formData)
    //let tokenRetorno:string='';
    return  this.http.post(`${base_url}/auth/signin`, formData)
      .pipe(
        tap(async (resp: any) => {
          //console.log(resp)
          
          localStorage.setItem('token', resp.token.access_token);
          localStorage.setItem('usuario_contectado', JSON.stringify(resp.datos));


          await this.obtengoDatosGrales.obtengoDatosEstructurasPrimarias();

          //let usuarioConectado = JSON.parse(localStorage.getItem('usuario_contectado'));
  
          ///localStorage.setItem('empresas',this.obtengoDatosGrales.obtengoDatosEmpresaUsuario(resp.datos.id));
          //tokenRetorno = resp.token.access_token;

        })
      )

      //return tokenRetorno;

  }

  
  recoverUsuario(formData: RecoverForm){


    //console.log(formData);
    // Creo usuario 
    // Creo Empresa
    // Creo Usuario por empresa
    // Principio solo estructura con La Maria Elena  
    // console.log(formData)
    return this.http.post(`${base_url}/auth/recover`, formData)
            .pipe(
              tap((resp:any)=>{
                
              })
            )


  }



  loginGoogle(token:string){
 

    return this.http.post(`${ base_url }/auth/google/login`, { token })
    .pipe(
      tap((resp:any)=>{
        //console.log()
        localStorage.setItem('token',resp.newToken.access_token)
      })
    )
     /* 
    var url="http://localhost:3333/auth/google/login"
    return fetch(url,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({token:token})
    })
    .then(resp=>resp.json())
    .then(resp=>console.log("Nuestro server"))
    .then(console.log)
    */

  }

  getRole(): number {
    // Implementa la lógica para obtener el rol del usuario actual
    // Puede ser a través de un token, una solicitud al servidor, o cualquier otro método
    let permiso='';    
    //localStorage.getItem('usuario_contectado');
    const usuario_contectado = JSON.parse(localStorage.getItem("usuario_contectado"));

    return usuario_contectado.id_rol;

  }

}
