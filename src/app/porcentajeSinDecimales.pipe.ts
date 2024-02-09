import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'porcentajeSinDecimales'
})
export class PorcentajeSinDecimalesPipe implements PipeTransform {
  transform(porcentaje: number): string {
    const porcentajeFormateado = (porcentaje).toFixed(0);
    return porcentajeFormateado;
  }
}