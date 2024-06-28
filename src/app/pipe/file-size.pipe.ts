import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize',
  standalone: true
})
export class FileSizePipe implements PipeTransform {

  transform(value: number): string {
    if (value === null || isNaN(value)) return '';

    const kbSize = value / 1024;

    if (kbSize < 1) {
      return `${value} B`;
    } else if (kbSize < 1024) {
      return `${kbSize.toFixed(2)} KB`;
    } else {
      const mbSize = kbSize / 1024;
      return `${mbSize.toFixed(2)} MB`;
    }
  }
}
