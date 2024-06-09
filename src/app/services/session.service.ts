import { Injectable } from '@angular/core';
import { Observable, interval, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {


  private clock$: Observable<number>;
  private code$: Observable<number>;
  private sessionStartTime!: Date;
  private codeStartTime!: Date;

  constructor() {

    this.clock$ = interval(1000).pipe(
      // Emite el tiempo restante de la sesión cada segundo
      map(() => this.getSessionTimeRemaining())
    );

    this.code$ = interval(1000).pipe(
      // Emite el tiempo restante de la sesión cada segundo
      map(() => this.getCodeTimeRemaining())
    );
   }

   getClock(): Observable<number> {
    return this.clock$;
  }
  
  getRemainigTimeCode(): Observable<number> {
    return this.code$;
  }

  startSession(): void {
    this.sessionStartTime = new Date();

  }

  startCodeTimer(): void {
    this.codeStartTime = new Date();
  }


  getSessionTimeRemaining(): number {
    const now = new Date();
    const sessionDuration = 300 * 10 * 1000; 
    // const sessionDuration = 1 * 10 * 1000; 
    const elapsedTime = now.getTime() - this.sessionStartTime.getTime();
    const timeRemaining = sessionDuration - elapsedTime;
    return timeRemaining > 0 ? timeRemaining : 0;
  }

  
  getCodeTimeRemaining(): number {
    const now = new Date();
    // const sessionDuration = 1 * 10 * 1000; 
    const sessionDuration =  5 * 60 * 1000; 
    const elapsedTime = now.getTime() - this.codeStartTime.getTime();
    const timeRemaining = sessionDuration - elapsedTime;
    return timeRemaining > 0 ? timeRemaining : 0;
  }
}
