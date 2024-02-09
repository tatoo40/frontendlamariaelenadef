import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'ddMmYYYYDate'
})
export class DdMmYYYYDateSoloHoraCeroPipe extends DatePipe implements PipeTransform {

  override transform(value: any, args?: any): any {
    return super.transform(value,'YYYY-MM-ddT00:00:00.000');
                                
    //2023-06-01T14:39:40.992Z

    //15-06-2023T00:00:00.000-0300
  }

}
