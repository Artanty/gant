import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { EMPTY, Observable, catchError, finalize, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { greaterThanZeroValidator } from '@app/app.config';
import { DrawerService } from '../drawer/drawer.service';
import { ApiService } from '@app/gant/services/api.service';
import { GantService } from '@app/gant/services/gant.service';
import { dateRangeValidator } from '@app/gant/services/validators';
import { noTimeZone } from '@app/gant/services/helpers';


export interface ITaskFormValue {
  name: string
  eventTypeId: number
  start: string
  end: string
  progress: string
  dependencies: string
  textId: string
  externalServiceId: string
  description: string
  id: null | number
}

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: [
    './task-form.component.scss',
    './../select/select.component.scss'
  ],
  standalone: true,
  providers: [
    ReactiveFormsModule,
    CommonModule,
  ],
  imports: [CommonModule, ReactiveFormsModule, DatePickerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TaskFormComponent {

  @Input() public readonly = false
  @Input() public externals$?: Observable<any>
  @Input() public taskStatusOptions: any[] = []


  public form: FormGroup;
  public resetDatePicker: boolean = false

  constructor(
    private fb: FormBuilder,
    private drawerService: DrawerService,
    private gantService: GantService
  ) {
    this.resetDatePicker = true // do not remove
    this.form = this.fb.group({
      name: ['', Validators.required],
      eventTypeId: ['', [Validators.required, greaterThanZeroValidator()]],
      start: [noTimeZone<string>(new Date(), { resetTime: true })],
      end: [noTimeZone<string>(new Date(), { resetTime: true })],
      progress: ['', [Validators.required]],
      dependencies: [''],
      textId: ['', [Validators.required]],
      id: [''],
      externalServiceId: [''],
      description:  [''],
    }, { validators: dateRangeValidator('start', 'end') });
    this.form.patchValue(this.getDefaultFormData())
  }

  private getDefaultFormData(): ITaskFormValue {

    const initialData: ITaskFormValue = {
      name: 'Событие 1',
      eventTypeId: 1,
      start: noTimeZone<string>(new Date(), { resetTime: true }),
      end: noTimeZone<string>(new Date(), { resetTime: true }),
      progress: '1',
      dependencies: '',
      textId: 'event_' + noTimeZone<string>(new Date(), { resetTime: true }),
      externalServiceId: '',
      description: 'Описание события',
      id: null
    }
    return initialData
  }


  onSubmit() {
    // console.log(this.form.valid)
    // console.log(this.form.value)
    if (this.form.valid) {
      if (this.form.value.id) {
        this.prepareAndEditTask()
      } else {
        this.prepareAndCreateTask()
      }
    } else {
      this.form.markAllAsTouched()
    }
  }

  onCancel() {
    this.onReset()
    this.back()
  }

  onReset () {
    const initialId = this.form.value.id
    const initialTextId = this.form.value.textId
    const initialStart = this.form.value.start
    const initialEnd = this.form.value.end
    const initialProgress = this.form.value.progress
    this.form.reset({
      externalServiceId: '',
      status: 0,
      eventTypeId: 1,
      id: initialId,
      textId: initialTextId,
      start: initialStart,
      end: initialEnd,
      progress: initialProgress
    });
    this.resetDatePicker = true
  }

  prepareAndCreateTask () {
    const eventData: ITaskFormValue = {
      name: this.form.value.name,
      eventTypeId: this.form.value.eventTypeId,
      start: this.form.value.start,
      end: this.form.value.end,
      progress: this.form.value.progress,
      dependencies: this.form.value.dependencies,
      textId: this.form.value. textId,
      id: null,
      externalServiceId: this.form.value.externalServiceId,
      description: this.form.value.description,
    };
    this.gantService.createEvent(eventData)
    .pipe(
      catchError((err: any) => this.handleError(err)),
      finalize(() => {
        this.onCancel()
        this.drawerService.hide('loader')
      })
    )
    .subscribe()
  }

  prepareAndEditTask() {
    // this.drawerService.show('loader')
    // const eventData: IEditTaskApi = {
    //   title: this.form.value.title,
    //   description: this.form.value.description,
    //   status: prepareStatus4Api(this.form.value.status),
    //   due_date: this.due_date_result,
    // };
    // this.taskApi.editTask(this.form.value.id, eventData)
    // .pipe(
    //   switchMap(() => this.taskService.getTasksByService(this.form.value.externalServiceId)),
    //   catchError((err: any) => this.handleError(err)),
    //   finalize(() => {
    //     this.back()
    //     this.drawerService.hide('loader')
    //   })
    // )
    // .subscribe()
  }

  private resetValidation() {
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  private handleError (err: string | any): Observable<never> {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.error(errorMessage)
    return EMPTY
  }

  back () {
    this.drawerService.hide('createEvent')
  }
}
