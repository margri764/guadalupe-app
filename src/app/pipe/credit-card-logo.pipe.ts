import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'creditCardLogoPath',
  standalone: true
})
export class CreditCardLogoPipe implements PipeTransform {
  transform(card: any) {


    if (card && card.filePath && card.filePath !== '') {

        const fileName = card.filePath.split('/').pop();

        const serverURL = 'https://arcanjosaorafael.org/cardLogos/';

        // console.log(`${serverURL}${fileName}`);
        return `${serverURL}${fileName}`;
    } else {

      return 'assets/images/no-image.jpg';
    }
  }
}

