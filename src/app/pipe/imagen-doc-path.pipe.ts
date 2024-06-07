import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imagenDocPath',
  standalone: true
})
export class ImagenDocPathPipe implements PipeTransform {

  transform(doc: any) {

    if (doc && doc.filePath && doc.filePath !== '') {

        const fileName = doc.filePath.split('/').pop();

        const serverURL = 'https://congressovirgofloscarmeli.org/document/';
        console.log(`${serverURL}${fileName}`);
        return `${serverURL}${fileName}`;
    } else {
      return doc.filePath;
    }
  }
}

