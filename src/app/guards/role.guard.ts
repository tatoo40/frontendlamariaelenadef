import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { Injectable } from '@angular/core';
import { ErrorService } from '../services/error.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';



@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private authService: UsuarioService, private router: Router,private _errorService:ErrorService) {}
 
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];
    const userRole = this.authService.getRole();
  
    if (userRole <= expectedRole) {
      console.log('true')
      return true; // El usuario tiene el rol esperado, permitir el acceso a la ruta
    }else{


    Swal.fire(
      'No esta autorizado',
      'Usted no tiene permisos para visualizar esta seccion. Consulte el administrador.',
      'error'
    );
    this.router.navigate(['/dashboard']); // Redirigir a una página de no autorizado
    return false; // Denegar el acceso a la ruta
  }
  }
}