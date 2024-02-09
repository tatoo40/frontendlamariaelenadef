import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'


@Injectable({
  providedIn: 'root'
})
export class PermisosAccionService {

  constructor() { }



  evaluoPermisoAccionUsuario(IdAccion:number, IdSeccion:number):boolean{

    const Usuario = JSON.parse(localStorage.getItem("usuario_contectado"));
    const IdUsuario = Usuario.id;

   

    if(IdUsuario.id_rol===1)
        return true;


    //console.log(Usuario);
    //console.log(IdAccion);
    //console.log(IdSeccion);
    const permisos_x_usuario_conectado = JSON.parse(localStorage.getItem("permisos_x_usuario_seccion"));

    var booleanValue = permisos_x_usuario_conectado.filter((item) => 
                       item.id_usuario === IdUsuario && 
                       item.id_accion === IdAccion && 
                       item.id_seccion === IdSeccion).length > 0
                       
    //console.log({booleanValue})

    return booleanValue
  }
}





