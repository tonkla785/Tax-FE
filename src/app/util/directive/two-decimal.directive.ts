import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appTwoDecimal]',
})
export class TwoDecimalDirective {
  constructor(private el: ElementRef) {}
  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    const input = event.target;
    let value = input.value.replace(/[^0-9.]/g, '');
    if (value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }else if (value.startsWith('.')) {
      value = value.replace(/^.+/, '');
    }

    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    input.value = value;
  }

  @HostListener('blur', ['$event'])
  onBlur(event: any) {
    const input = event.target;
    let value = input.value.replace(/,/g, '');

    const num = parseFloat(value);

    if (!isNaN(num)) {
      input.value = num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  }
}
