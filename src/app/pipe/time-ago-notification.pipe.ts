import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'timeAgoNotification',
  standalone: true
})
export class TimeAgoNotificationPipe implements PipeTransform {

  transform(time:string){

      // Calcula la diferencia desde el timestamp hasta ahora
    const now = moment();
    const past = moment(time);
    const duration = moment.duration(now.diff(past));

    // Convierte la duración a un formato legible
    const years = duration.years();
    const months = duration.months();
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    // Crear una cadena legible para la duración
    let timePassed = '';
    if (years > 0) {
      timePassed += `${years} year${years > 1 ? 's' : ''} `;
    }
    if (months > 0) {
      timePassed += `${months} month${months > 1 ? 's' : ''} `;
    }
    if (days > 0) {
      timePassed += `${days} day${days > 1 ? 's' : ''} `;
    }
    if (hours > 0) {
      timePassed += `${hours} hour${hours > 1 ? 's' : ''} `;
    }
    if (minutes > 0) {
      timePassed += `${minutes} min${minutes > 1 ? 's' : ''} `;
    }
   

    // Si no ha pasado ningún tiempo (por ejemplo, si el timestamp es el tiempo actual), muestra 'just now'
    if (timePassed === '') {
      timePassed = 'just now';
    }

        return timePassed;
      }

}
