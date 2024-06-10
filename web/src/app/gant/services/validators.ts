import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { noTimeZone } from './helpers';

export function dateRangeValidator(dateFromControlName: string, dateToControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const dateFromControl = control.get(dateFromControlName);
    const dateToControl = control.get(dateToControlName);

    if (dateFromControl && dateToControl && dateFromControl.value && dateToControl.value) {
      const dateFrom = noTimeZone<Date>(dateFromControl.value, { resetTime: true, returnDateObj: true });
      const dateTo = noTimeZone<Date>(dateToControl.value, { resetTime: true, returnDateObj: true });

      if (dateFrom > dateTo) {
        return { dateRange: true };
      }
    }

    return null;
  };
}
