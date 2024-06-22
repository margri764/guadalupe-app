import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'associationLogoPath',
  standalone: true
})
export class AssociationLogoPipe implements PipeTransform {
  transform(association: any) {
    console.log(association);
    
    if (association && association.filePath && association.filePath !== '') {

        const fileName = association.filePath.split('/').pop();

        const serverURL = 'https://arcanjosaorafael.org/association/';

        console.log(`${serverURL}${fileName}`);
        return `${serverURL}${fileName}`;
    } else {

      return 'assets/images/no-image.jpg';
    }
  }
}
