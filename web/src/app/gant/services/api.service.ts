import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGantEvent } from './store.service';
import { Observable } from 'rxjs';
import { ITaskFormValue } from '../components/task-form/task-form.component';

export interface eventToUpdate{
  textId: string, start: string, end: string, progress: number
}
@Injectable()
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  public getRandomEvent () {
    return {
      id: Math.floor(Math.random() * 100),
      eventName: 'event' + Math.floor(Math.random() * 100),
      dateFrom: new Date().toISOString().slice(0, 10), // Get the current date in YYYY-MM-DD format
      dateTo: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString().slice(0, 10), // Add 3 hours to the current date
    }
  }

  public getEvents(): Observable<IGantEvent[]> {
    let sql = `SELECT * FROM events;`
    return this.http.post<IGantEvent[]>(`${process.env['BAG_URL']}/table-query`, { query: sql, app_name: `${process.env['APP_NAME']}`})
  }

  public createEvent(data: ITaskFormValue) {
    const { name, start, end, progress, dependencies, textId, eventTypeId, externalServiceId, description } = data
    let sql = `INSERT INTO events (name, start, end, progress, dependencies, textId, eventTypeId, externalServiceId, description)
     VALUES ('${name}', '${start}', '${end}', '${progress}', '${dependencies}', '${textId}', '${eventTypeId}', '${externalServiceId}', '${description}')`;
    return this.http.post(`${process.env['BAG_URL']}/table-query`, { query: sql, app_name: `${process.env['APP_NAME']}`})
  }

  public updateEvent(data: eventToUpdate) {
    const { textId, start, end, progress } = data
    let sql = `UPDATE events SET start = '${start}', end = '${end}', progress = '${progress}' WHERE textId = '${textId}';`;
    return this.http.post(`${process.env['BAG_URL']}/table-query`, { query: sql, app_name: `${process.env['APP_NAME']}`})
  }



}
