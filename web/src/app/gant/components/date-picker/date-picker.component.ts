import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, Input, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Inject, forwardRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, AbstractControl, ValidationErrors, Validator } from '@angular/forms';
import { isSame, noTimeZone } from '@app/gant/services/helpers';
import { Observable, delay, startWith } from 'rxjs';

export interface IDateObj {
  day: number | string
  month: number | string
  year: number | string
}

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  standalone: true,
  providers: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ],
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: [
    './date-picker.component.scss',
    './../select/select.component.scss'
  ],

})
export class DatePickerComponent implements ControlValueAccessor, Validator{
  dateForm: FormGroup;
  days: number[] = [];
  months = Array.from({ length: 12 }, (_, i) => i + 1);
  years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  isDateRangeInvalid: boolean = false

  constructor() {
    const today = noTimeZone<Date>(new Date(), { returnDateObj: true, resetTime: true });
    this.dateForm = new FormGroup({
      day: new FormControl(today.getDate(), Validators.required),
      month: new FormControl(today.getMonth() + 1, Validators.required),
      year: new FormControl(today.getFullYear(), Validators.required)
    })

    this.dateForm.get('day')?.valueChanges.subscribe((day) => {
      this.emitSelectedDate({ day: +day });
    });

    this.dateForm.get('month')?.valueChanges.subscribe((month) => {
      const year = this.dateForm.get('year')?.value;
      this.updateDaysInMonth(month, year);
      this.emitSelectedDate({ month: +month });
    });

    this.dateForm.get('year')?.valueChanges.subscribe((year) => {
      const month = this.dateForm.get('month')?.value;
      this.updateDaysInMonth(month, year);
      this.emitSelectedDate({ year: +year });
    });
  }

  resetDate(): void {
    // const today = new Date();
    // this.dateForm.get('day')?.setValue(today.getDate());
    // this.dateForm.get('month')?.setValue(today.getMonth() + 1);
    // this.dateForm.get('year')?.setValue(today.getFullYear());
    // this.updateDaysInMonth(today.getMonth() + 1, today.getFullYear());
    // this.emitSelectedDate();
  }

  updateDaysInMonth(month: number, year: number): void {
    const totalDays = new Date(year, month, 0).getDate();
    this.days = Array.from({ length: totalDays }, (_, i) => i + 1);

    const selectedDay = this.dateForm.get('day')?.value;
    if (selectedDay > totalDays) {
      this.dateForm.get('day')?.setValue(1);
    }
  }

  private isSameAsValue(updatedDate: IDateObj) {
    return isSame(this.parseDateStr2Obj(this.value), updatedDate)
  }

  emitSelectedDate(data?: Partial<IDateObj>): void {
    if (this.dateForm.valid && this.dateForm.dirty) {
      const updatedDate = {...this.dateForm.value, ...data}
      if (!this.isSameAsValue(updatedDate)) {
        const selectedDate = new Date(
          updatedDate.year,
          updatedDate.month - 1,
          updatedDate.day
        )
        this.onChange(noTimeZone<string>(selectedDate))
      }
    }
  }

  private parseDateStr2Obj (dateString: string): IDateObj {
    const parts = dateString.split('T')[0]?.split('-');
    if (parts.length !== 3) throw new Error(`Wrong format of dateString`)

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    return { day, month, year }
  }

  private setDate(dateString: string) {
    if (dateString) {
      const { day, month, year }: IDateObj = this.parseDateStr2Obj(dateString)

      this.dateForm.get('year')?.setValue(year);
      this.dateForm.get('month')?.setValue(month);
      this.updateDaysInMonth(+month, +year);
      this.dateForm.get('day')?.setValue(day);
    }
  }

  /**
   * CUSTOM CONTROL IMPLEMENTATION
   */
  value!: string;
  disabled = false;
  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(obj: any): void {
    this.value = obj;
    this.setDate(obj)
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * listen parent from group validation
   */
  validate(control: AbstractControl): ValidationErrors | null {
    setTimeout(() => {
      this.isDateRangeInvalid = (control?.parent?.status === 'INVALID') && control?.parent?.errors?.['dateRange']
        ? true
        : false
    }, 0)

    return null;
  }
}
