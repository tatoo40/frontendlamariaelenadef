import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AuthenticationRoutes } from './authentication.routing';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { CompanySignupComponent } from './companysignup/companysignup.component';
import { SeleccionEmpresaComponent } from './seleccionaempresa/seleccionaempresa.component';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    CompanySignupComponent,
    SeleccionEmpresaComponent
  ],
  exports: [
    LoginComponent,
    SignupComponent,
    CompanySignupComponent,
    SeleccionEmpresaComponent
  ],

  imports: [RouterModule.forChild(AuthenticationRoutes),
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule]
})
export class AuthenticationModule {}
