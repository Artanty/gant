import { Inject, Injectable } from '@angular/core';
import { IGantEvent, StoreService } from './store.service';
import { ApiService, eventToUpdate } from './api.service';
import { EMPTY, Observable, catchError, delay, finalize, map, of, switchMap, tap } from 'rxjs';
import Gantt from 'frappe-gantt-angular15';
import { DrawerService } from '../components/drawer/drawer.service';
import { ITaskFormValue } from '../components/task-form/task-form.component';

@Injectable()
export class GantService {

  constructor(
    private storeService: StoreService,
    private apiService: ApiService,
    @Inject(DrawerService) private drawerService: DrawerService,
  ) { }


  getEvents (): Observable<IGantEvent[]> {
    this.drawerService.showAfterInit('loader')

    return this.apiService.getEvents()
    .pipe(
      tap((res: IGantEvent[]) => {
        this.storeService.setGantEvents(res)
      }),
      catchError((err: any) => this.handleError(err)),
      finalize(() => {
        this.drawerService.hide('loader')
      })
    )
  }

  createEvent (eventData: ITaskFormValue): Observable<IGantEvent[]> {
    this.drawerService.showAfterInit('loader')

    return this.apiService.createEvent(eventData)
    .pipe(
      switchMap(() => this.getEvents()),
      catchError((err: any) => this.handleError(err)),
      // finalize(() => {
      //   this.drawerService.hide('loader')
      // })
    )
  }

  updateEvent (data: eventToUpdate) {
    this.drawerService.showAfterInit('loader')
    return this.apiService.updateEvent(data)
    .pipe(
      // switchMap(() => this.getEvents()),
      catchError((err: any) => this.handleError(err)),
      finalize(() => {
        this.drawerService.hide('loader')
      })
    )
  }

  deleteEvent (data: string) {
    this.drawerService.showAfterInit('loader')
    return this.apiService.deleteEvent(data)
    .pipe(
      switchMap(() => this.getEvents()),
      catchError((err: any) => this.handleError(err)),
      finalize(() => {
        this.drawerService.hide('loader')
      })
    )
  }

  /**
   * Convert event to display in gantt table
   */
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

  private handleError (err: string | any): Observable<never> {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.error(errorMessage)
    return EMPTY
  }
}
