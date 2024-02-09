import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalFormat'
})
export class ImporteUsdListado implements PipeTransform {
  transform(value: number): string {
    return value.toFixed(2);
  }
}
