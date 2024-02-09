import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { UsuarioService } from '../services/usuario.service';
import { tap, map} from 'rxjs/operators'
import { Router } from '@angular/router';
import { ObtengoDatosGeneralesService } from '../services/obtengo-datos-generales.service';
import { DdMmYYYYDateSoloHoraCeroPipe } from '../dd-mm-yyyy-date-solo-hora-cero.pipe';


@Injectable({
  providedIn: 'root'
})


export class AuthGuard implements CanActivate {

  constructor(private UsuarioService:UsuarioService,private routes: Router, private obtengoDatosEsenciales:ObtengoDatosGeneralesService,private formatoFecha:DdMmYYYYDateSoloHoraCeroPipe) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      
    
    //const token = localStorage.getItem("token");

    //if(token == undefined){
    //  this.routes.navigate(['/authentication/login']);
   // }


    //return true
    //esta mal el validat token  
    return this.validarTokenYDatos()
  
  }

  async validarTokenYDatos(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.UsuarioService.validarToken().pipe(
        tap(async (estaAutenticado) => {
          if (estaAutenticado) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
      ).subscribe();
    });
  }

}