import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duplaImagenPath',
  standalone: true
})
export class DuplaImgPipe implements PipeTransform {

  transform(user: any, userNumber: number) {
      
    if (!user || !user.Ruta_Imagen_1 || user.Ruta_Imagen_1 === '' )return
    if ( !user.Ruta_Imagen_2 || user.Ruta_Imagen_2 === '' )return
    

    if (user.Ruta_Imagen_1.startsWith('https://congressovirgofloscarmeli.org/info/') ) {
      if(userNumber === 1){
          return user.Ruta_Imagen_1 ;
      }
    } else {
      const fileName = user.Ruta_Imagen_1.split('/').pop();
      const serverURL = 'https://congressovirgofloscarmeli.org/profilePicture/';
      return `${serverURL}${fileName}`;
    }

    if (user.Ruta_Imagen_2.startsWith('https://congressovirgofloscarmeli.org/info/') ) {
      if(userNumber === 2){
          return user.Ruta_Imagen_2 ;
      }
    } else {
      const fileName = user.Ruta_Imagen_2.split('/').pop();
      const serverURL = 'https://congressovirgofloscarmeli.org/profilePicture/';
      return `${serverURL}${fileName}`;
    }
       


  
}

}
