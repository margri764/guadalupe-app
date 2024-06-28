import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileType',
  standalone: true
})
export class FileTypePipe implements PipeTransform {

  transform(type: string): string {
    const imageTypes = ['img', 'jpeg', 'jpg', 'png', 'gif', 'image/jpeg']; 
    return imageTypes.includes(type.toLowerCase()) ? 'image' : 'pdf';
  }
}
