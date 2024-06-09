import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Gantt, { EnrichedTask } from 'frappe-gantt-angular15';
import { EMPTY, Observable, catchError, filter, map, of, pipe, tap } from 'rxjs';
import { IGantEvent, StoreService } from '../../services/store.service';
import { GantService } from '../../services/gant.service';
import { eventToUpdate, ApiService } from '@app/gant/services/api.service';
import { isoDateWithoutTimeZone, lsGet, lsSet } from '@app/gant/services/helpers';
import { DrawerService } from '../drawer/drawer.service';

@Component({
	selector: 'app-gantt',
  templateUrl: './gantt.component.html',
	styleUrls: [
    './gantt.component.scss',
    './../select/select.component.scss'
  ],

})
export class GanttComponent implements OnInit, AfterViewInit {
	@ViewChild('gantt') ganttElement!: ElementRef;

  public viewModes$: Observable<any> = of([
    { id: 'Day', name: 'Дни' },
    { id: 'Week', name: 'Недели' },
    { id: 'Month', name: 'Месяцы' },
    { id: 'Year', name: 'Годы' },
  ])
  testVar = 'testCar'
  selectedEvent: EnrichedTask | null = null
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
    custom_popup_html: (task: Gantt.EnrichedTask) => {
      return `
        <div class="details-container">
          <div class="topRow">
            <h5>${task.name}</h5>
          </div>
          <p>${isoDateWithoutTimeZone(task._start)}</p>
          <p>-> ${isoDateWithoutTimeZone(task._end)}</p>
          <p>${task.progress}% completed!</p>
        </div>
      `;
    },
    on_date_change: (task: Gantt.EnrichedTask, start: Date, end: Date) => {
      this.updateEventDate(task, start, end)
    },
    on_progress_change: (task: EnrichedTask, progress: number) => {
      this.updateEventProgress(task, progress)
    },
    on_click: (task: EnrichedTask) => {
      this.handleEventClick(task)
    },
  }


  constructor(
    private fb: FormBuilder,
    private gantService: GantService,
    private storeService: StoreService,
    private cdr: ChangeDetectorRef,
    private drawerService: DrawerService,
    private apiService: ApiService
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
   }

  ngOnInit(): void {
    this.storeService.listenGantEvent().pipe(
      filter(array => array.length > 0),
      map((res: any) => {
        return res.map(this.gantService.convertEvent)
      }),
      tap((res: Gantt.Task[]) => {

        this.tasks = JSON.parse(JSON.stringify(res)) as Gantt.Task[]

        if (this.gantt) {
          this.gantt.refresh(this.tasks)
        } else {
          this.gantt = new Gantt(this.ganttElement.nativeElement, this.tasks, this.options);
        }

        this.cdr.detectChanges()
        console.log(this.gantt)
        this.buildLeftPanel(this.gantt)
        this.toggleLeftSideWidth(true)
      })
    ).subscribe()
  }

  ngAfterViewInit (): void {
    console.log(this.gantt)
  }
  public gantTasks: any[] = []
  public gridHeaderHeight: number = 0
  public gridItemHeight: number = 0
  public leftSideWidth: number = 0
  public isLeftSideExpanded: boolean = false
  private taskTextIdToDelete: string = ''

  buildLeftPanel (gantt: any) {
    this.gantTasks = gantt.tasks
    this.calculateGridItemHeight()
    this.calculateGridHeaderHeight()
  }

  toggleLeftSideWidth (init?: boolean) {
    if (init !== undefined) {
      this.isLeftSideExpanded = !!lsGet('isLeftSideExpanded')
    } else {
      this.isLeftSideExpanded = !this.isLeftSideExpanded
      lsSet('isLeftSideExpanded', this.isLeftSideExpanded)
    }
    this.leftSideWidth = this.isLeftSideExpanded ? 200 : 27
    this.cdr.detectChanges()
  }

  calculateGridItemHeight (): void {
    this.gridItemHeight = (this.options.bar_height ?? 0) + (this.options.padding ?? 0)
  }

  calculateGridHeaderHeight (): void {
    const svgElement = this.ganttElement?.nativeElement;
    if (svgElement) {

      const gridHeaderElements = svgElement.getElementsByClassName('grid-header');

      if (gridHeaderElements.length > 0) {
        const gridHeaderElement = gridHeaderElements[0]; // Assuming there's only one rect with class 'grid-header'
        const gridHeaderHeight = gridHeaderElement.getAttribute('height');
        this.gridHeaderHeight = gridHeaderHeight
      } else {
        console.log('Grid header rect not found');
      }
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

  closePreDeleteEventDrawer () {
    this.drawerService.hide('preDeleteEvent')
  }

  confirmDeleteEvent () {
    if (!this.taskTextIdToDelete) throw new Error('no task marked to delete')
    this.gantService.deleteEvent(this.taskTextIdToDelete)
    .subscribe(() => {
      this.closePreDeleteEventDrawer()
    })
  }

  deleteEvent(textId: string) {
    this.taskTextIdToDelete = textId
    this.drawerService.show('preDeleteEvent')
  }

  handleEventClick(element?: EnrichedTask | any) {
    this.selectedEvent = element
    console.log(this.selectedEvent)
  }
}
