import { Injectable } from '@angular/core';
import { IGantEvent, StoreService } from './store.service';
import { ApiService } from './api.service';
import { EMPTY, Observable, catchError, map, of, tap } from 'rxjs';
import Gantt from 'frappe-gantt-angular15';

@Injectable()
export class GantService {

  constructor(
    private storeService: StoreService,
    private apiService: ApiService
  ) { }

  addGantEvent () {
    // this.apiService.addEvent()
    const event1 = this.apiService.getRandomEvent()
    const event2 = this.apiService.getRandomEvent()

    // this.storeService.setGantEvents([event1, event2])
  }

  getEvents (): Observable<IGantEvent[]> {

    return this.apiService.getEvents()
    .pipe(
      tap((res: IGantEvent[]) => {
        this.storeService.setGantEvents(res)
      }),
      catchError((error: Error) => {
        console.error(error)
        return EMPTY
      })
    )
  }

  public convertEvent (data: IGantEvent): Gantt.Task {
    const newData: Gantt.Task = {
      id: data.textId,
      name: data.name,
      start: data.start,
      end: data.end,
      progress: data.progress,
      dependencies: data.dependencies,
    }
    return newData
  }
}
