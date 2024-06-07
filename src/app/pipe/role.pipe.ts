import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'role',
  standalone: true
})
export class RolePipe implements PipeTransform {

  transform(value: string) {
    if(!value || value === ''){
        return '';
    }else{
        console.log(value);
        switch (value) {
            case 'user': return 'Usuário';
            case 'admin': return 'Administrador';
            case 'webmaster': return 'Web Master';
            case 'super_admin': return 'Super Admin';
            
            default: return ''
                break;
        }
    }

  }
}
