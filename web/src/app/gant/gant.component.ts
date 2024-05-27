import { Component, ElementRef, ViewChild } from '@angular/core';
import { IGantEvent, StoreService } from './services/store.service';
import { Observable } from 'rxjs';
import { GantService } from './services/gant.service';

@Component({
  selector: 'app-gant',
  templateUrl: './gant.component.html',
  styleUrl: './gant.component.scss'
})
export class GantComponent {
  @ViewChild('bar1', { static: true }) bar1!: ElementRef;
  gantEvents$: Observable<IGantEvent[]>

  constructor (
    private gantService: GantService,
    private storeService: StoreService
  ) {
    this.gantEvents$ = this.storeService.listenGantEvent()
  }
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

}


