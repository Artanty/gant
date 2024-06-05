import { AfterViewChecked, AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { IGantEvent, StoreService } from './services/store.service';
import { Observable, Subject } from 'rxjs';
import { GantService } from './services/gant.service';
import { DrawerService } from './components/drawer/drawer.service';
import { ResizeService } from './services/resize.service';
import { MAIN_VIEW_READY, SET_MAIN_VIEW_READY } from '@app/app.config';

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
export class GantComponent implements OnInit, AfterViewInit {
  @ViewChild('wrapper', { static: false })
  wrapper?: ElementRef<HTMLElement>;

  ngOnInit(): void {
  }

  constructor (
    private gantService: GantService,
    private storeService: StoreService,
    private drawerService: DrawerService,
    public elementRef: ElementRef,
    private resizeService: ResizeService,
    @Inject(SET_MAIN_VIEW_READY) private setMainViewReady$: Subject<void>
  ) {

  }

  ngAfterViewInit(): void {
    this.resizeService.setSpy(this.wrapper!.nativeElement, 'rootComponent')
    this.setMainViewReady$.next()
  }

  showCreateEvent() {
    this.drawerService.show('createEvent')
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}


