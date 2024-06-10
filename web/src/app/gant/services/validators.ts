import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateRangeValidator(dateFromControlName: string, dateToControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const dateFromControl = control.get(dateFromControlName);
    const dateToControl = control.get(dateToControlName);

    if (dateFromControl && dateToControl && dateFromControl.value && dateToControl.value) {
      const dateFrom = new Date(dateFromControl.value);
      const dateTo = new Date(dateToControl.value);

      if (dateFrom > dateTo) {
        return { dateRange: true };
      }
    }

    return null;
  };
}
