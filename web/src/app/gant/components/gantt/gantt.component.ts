import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Gantt, { EnrichedTask } from 'frappe-gantt-angular15';
import { Observable, filter, map, of, tap } from 'rxjs';
import { IGantEvent, StoreService } from '../../services/store.service';
import { GantService } from '../../services/gant.service';
import { eventToUpdate } from '@app/gant/services/api.service';
import { isoDateWithoutTimeZone } from '@app/gant/services/helpers';


@Component({
	selector: 'app-gantt',
  templateUrl: './gantt.component.html',
	styleUrls: [
    './gantt.component.scss',
    './../select/select.component.scss'
  ],

})
export class GanttComponent implements OnInit {
	@ViewChild('gantt') ganttElement!: ElementRef;
  public viewModes$: Observable<any> = of([
    { id: 'Day', name: 'Дни' },
    { id: 'Week', name: 'Недели' },
    { id: 'Month', name: 'Месяцы' },
    { id: 'Year', name: 'Годы' },
  ])
  testVar = 'testCar'
  public form: FormGroup;
  gantt!: Gantt
  tasks!: Gantt.Task[]
  options: Gantt.Options = {
    // view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month', ]
    header_height: 50,
    column_width: 30,
    step: 24,
    view_modes: ['Year', 'Month'],
    bar_height: 20,
    bar_corner_radius: 3,
    arrow_curve: 5,
    padding: 18,
    view_mode: 'Year',
    date_format: 'YYYY-MM-DD',
    language: 'ru', // or 'es', 'it', 'ru', 'ptBr', 'fr', 'tr', 'zh', 'de', 'hu'
    custom_popup_html: function(task: Gantt.EnrichedTask) {
      return `
        <div class="details-container">
          <h5>${task.name}</h5>
          <p>Task started on: ${isoDateWithoutTimeZone(task._start)}</p>
          <p>Expected to finish by ${isoDateWithoutTimeZone(task._start)}</p>
          <p>${task.progress}% completed!</p>
        </div>
      `;
    },
    on_date_change: (task: Gantt.EnrichedTask, start: Date, end: Date) => {
      this.updateEventDate(task, start, end)
    },
    on_progress_change: (task: EnrichedTask, progress: number) => {
      this.updateEventProgress(task, progress)
    }
  }

  updateEventDate (task: Gantt.EnrichedTask, start: Date, end: Date) {
    const data: eventToUpdate = {
      textId: task.id,
      start: isoDateWithoutTimeZone(start),
      end: isoDateWithoutTimeZone(end),
      progress: task.progress
    }
    this.gantService.updateEvent(data).subscribe()
  }

  updateEventProgress (task: EnrichedTask, progress: number) {
    const data: eventToUpdate = {
      textId: task.id,
      start: task.start,
      end: task.end,
      progress: progress
    }
    this.gantService.updateEvent(data).subscribe()
  }

  constructor(
    private fb: FormBuilder,
    private gantService: GantService,
    private storeService: StoreService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      viewMode: ['Month'],
    })
    this.form.get('viewMode')?.valueChanges.subscribe((res => {
      this.gantt.change_view_mode(res)
      this.gantt.refresh(this.tasks)
    }))

    this.gantService.getEvents().subscribe((res: any) => {
      this.form.patchValue({ viewMode: this.form.controls['viewMode'].value })
    })
    // this.gantt.
   }

  ngOnInit(): void {
    this.storeService.listenGantEvent().pipe(
      filter(array => array.length > 0),
      map((res: any) => {
        return res.map(this.gantService.convertEvent)
      }),
      tap((res: Gantt.Task[]) => {

        this.tasks = res as Gantt.Task[]

        if (this.gantt) {
          this.gantt.refresh(this.tasks)
        } else {
          this.gantt = new Gantt(this.ganttElement.nativeElement, this.tasks, this.options);
        }

        this.cdr.detectChanges()
      })
    ).subscribe()
    // this.gantt.
  }
}
