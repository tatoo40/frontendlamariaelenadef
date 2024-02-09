import { RouterModule, Routes } from '@angular/router';

import { NotfoundComponent } from './404/not-found.component';
import { LockComponent } from './lock/lock.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { NgModule } from '@angular/core';
import { CompanySignupComponent } from './companysignup/companysignup.component';
import { SeleccionEmpresaComponent } from './seleccionaempresa/seleccionaempresa.component';


const routes: Routes = [

  { path: 'register', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'companysignup', component:CompanySignupComponent}
];


NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '404',
        component: NotfoundComponent
      },
      {
        path: 'lock',
        component: LockComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },

      {
        path: 'signup',
        component: SignupComponent
      },
      {
        path: 'seleccionempresa',
        component: SeleccionEmpresaComponent
      },     

      {
        path: 'companysignup',
        component: CompanySignupComponent
      }

    ]
  }
];
