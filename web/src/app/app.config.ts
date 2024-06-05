import { ApplicationConfig, InjectionToken } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { Observable, Subject } from 'rxjs';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export const SET_MAIN_VIEW_READY = new InjectionToken<Subject<void>>('');
export const MAIN_VIEW_READY = new InjectionToken<Observable<void>>('');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: SET_MAIN_VIEW_READY,
      useValue: new Subject()
    },
    {
      provide: MAIN_VIEW_READY,
      useFactory: (tick$: Subject<void>) => tick$.asObservable(),
      deps: [SET_MAIN_VIEW_READY]
    }
]
};

//shared
export function greaterThanZeroValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // Check if the control value is a number and greater than 0
    if (control.value !== null && control.value !== '' && !isNaN(control.value) && control.value > 0) {
      return null; // Valid, return null
    } else {
      // Invalid, return an error object
      return { greaterThanZero: true };
    }
  };
}
