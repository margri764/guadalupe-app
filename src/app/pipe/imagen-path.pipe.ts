import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imagenPath',
  standalone: true
})
export class ImagenPathPipe implements PipeTransform {

  transform(user: any): string {

    if (user && user.Ruta_Imagen !== '') {


      if(user.Ruta_Imagen.startsWith('/var/www')){
        const fileName = user.Ruta_Imagen.split('/').pop();
        const serverURL = 'https://comissaoguadalupe.org/profile/';
        return `${serverURL}${fileName}`;
      }else{
        return '';

      }
      

  } else {
    return '';

  
  }
}

}
