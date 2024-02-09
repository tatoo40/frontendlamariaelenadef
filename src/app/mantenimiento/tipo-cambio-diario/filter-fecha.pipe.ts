import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterFecha'
})
export class FilterFechaPipe implements PipeTransform {
  transform(items: any[], searchTerm: string): any[] {
    if (!items || !searchTerm) {
      return items;
    }
    searchTerm = searchTerm.toLowerCase();
    return items.filter(item => {
      const fecha = item.fecha.toLowerCase();
      return fecha.includes(searchTerm);
    });
  }
}
