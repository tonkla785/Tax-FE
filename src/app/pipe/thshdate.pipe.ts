import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thshdate',
})
export class ThshdatePipe implements PipeTransform {
  transform(value: any) {
    if (!value) return '';

    const date = new Date(value);
    const day = date.getDate().toString();
    const month = (date.getMonth() + 1).toString();
    const year = (date.getFullYear() + 543).toString();
    return `${day}/${month}/${year}`;
  }
}
