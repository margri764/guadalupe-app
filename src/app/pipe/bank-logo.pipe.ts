import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bankLogoPath',
  standalone: true
})
export class BankLogoPipe implements PipeTransform {

  transform(bank: any) {
    console.log(bank);

    if (bank && bank.filePath && bank.filePath !== '') {

        const fileName = bank.filePath.split('/').pop();

        const serverURL = 'https://arcanjosaorafael.org/bankAccount/';

        console.log(`${serverURL}${fileName}`);
        return `${serverURL}${fileName}`;
    } else {

      return 'assets/images/no-image.jpg';
    }
  }
}

