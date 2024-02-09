import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsRoutes } from './forms.routing';

@NgModule({
  imports: [RouterModule.forChild(FormsRoutes)],
  declarations: [],
})
export class FormModule {}
