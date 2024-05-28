import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface IGantEvent {
  id: number
  textId: string
  name: string
  start: string
  end: string
  progress: number
  dependencies: string
}

@Injectable()
export class StoreService {
  gantEvents$ = new BehaviorSubject<IGantEvent[]>([])

  constructor() {}

  setGantEvents (data: IGantEvent[]) {
    this.gantEvents$.next(data)
  }

  getGantEvent (): IGantEvent[] {
    return this.gantEvents$.getValue()
  }

  listenGantEvent (): Observable<IGantEvent[]> {
    return this.gantEvents$.asObservable()
  }
}
