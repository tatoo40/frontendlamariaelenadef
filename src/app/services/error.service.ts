import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }

  msjError(e: HttpErrorResponse){

    //console.log(e)
    if (e.error && e.error.msg) {

      Swal.fire('Error', e.error.message, 'error');


    }else{
      
      if (e.error && e.error.message) {

        Swal.fire('Error', e.error.message, 'error');
  
  
      }else{
        
        Swal.fire('Error','Hubo un error, comuniquese con el administrador','error')
      
      }
    
    }
  }

}
