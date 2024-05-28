import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IGantEvent, StoreService } from './services/store.service';
import { Observable } from 'rxjs';
import { GantService } from './services/gant.service';

export interface ITimelineHeader {
  id: number
  monthName: string
  year: number
}

@Component({
  selector: 'app-gant',
  templateUrl: './gant.component.html',
  styleUrl: './gant.component.scss'
})
export class GantComponent implements OnInit, AfterViewInit{
  timelineHeader: ITimelineHeader[] = this.buildMonthsView()

  ngOnInit(): void {


    // Attach event handlers
    // this.ganttChart.attachEvent('onParse', this.onParse.bind(this));
    // this.ganttChart.attachEvent('onGanttRender', this.onGanttRender.bind(this));
    // this.ganttChart.attachEvent('onScaleClick', this.onScaleClick.bind(this));

    // Parse the actions data
    // this.ganttChart.parse(this.actionsData);
  }
  buildMonthsView () {

    const getMonthName = (monthNumber: number) => {
      const date = new Date();
      date.setMonth(monthNumber - 1);

      return date.toLocaleString('default', { month: 'long' });
    }


    const list = [];
    let id = 1;

    for (let year = 2023; year <= 2024; year++) {
      for (let month = 1; month <= 12; month++) {
        const monthName = getMonthName(month);
        list.push({
          id: id,
          monthName: monthName,
          year: year
        });
        id++;
      }
    }

    return list
  }

  //old next
  @ViewChild('bar1', { static: true }) bar1!: ElementRef;
  gantEvents$: Observable<IGantEvent[]>

  //2
  @ViewChild('ganttTimeline', { static: true }) ganttTimeline!: ElementRef;
  private ganttChart: any;
  private currentDate: Date = new Date();
  private actionsData = {
    // ... your actions data
  };
  public gridVisibility: boolean = false;

  constructor (
    private gantService: GantService,
    private storeService: StoreService
  ) {
    this.gantEvents$ = this.storeService.listenGantEvent()
  }



  ngAfterViewInit(): void {
    // Render the Gantt chart
    // this.ganttChart.render();
  }

  onParse(): void {
    this.setScaleConfig('3');
  }

  onGanttRender(): void {
    this.renderMarker();
  }

  onScaleClick(e: any, date: Date): void {
    // this.currentDate = gantt.dateFromPos(gantt.getScrollState().x + e.x);
    this.renderMarker();
  }

  onScaleChange(event: any): void {
    this.setScaleConfig(event.target.value);
    this.ganttChart.render();
  }

  onGridVisibilityChange(): void {
    this.ganttChart.config.show_grid = this.gridVisibility;
    this.ganttChart.render();
  }

  setScaleConfig(value: string): void {
    // ... your setScaleConfig logic
  }

  renderMarker(): void {
    // ... your renderMarker logic
  }
  //1
  onResizeEnd(event: any ): void {
    console.log('Element was resized', event);
  }
  onDragStart(event: PointerEvent, element: HTMLElement) {
    console.log('Drag started', event);
  }
  onDragMove(event: PointerEvent): void {
    // Handle drag move event
    console.log('Drag moved', event);
    // Update the position of the bar1 element based on the event
    this.bar1.nativeElement.style.left = `${event.clientX}px`;
    this.bar1.nativeElement.style.top = `${event.clientY}px`;
  }
  onDragEnd(event: PointerEvent): void {
    // Handle drag end event
    console.log('Drag ended', event);
  }

  // onResizeEnd(event: any) {
  //   // Implement resize logic here
  // }

  getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
}


