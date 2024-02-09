import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DdMmYyyyConBarras implements PipeTransform {
  transform(value: string): string {
    const fecha = new Date(value);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear().toString().slice(-2); // Obtener solo los últimos dos dígitos del año
    return `${dia}/${mes}/${año}`;
  }
}