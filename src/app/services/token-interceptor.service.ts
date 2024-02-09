import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private router:Router, private _errorService: ErrorService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    

    const token = localStorage.getItem('token');

    //console.log(token)
    if (token){
    req = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      },
    });
    }    


    //console.log(jwttoken)
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse)=>{
        if(error.status===401){
          this._errorService.msjError(error)
          this.router.navigate(['/authentication/login'])
        }
        return throwError(()=>new Error('error'));
      })
    )

  }
}
