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

  public deleteEvent(textId: string) {
    let sql = `DELETE FROM events WHERE textId = '${textId}';`;
    return this.http.post(`${process.env['BAG_URL']}/table-query`, { query: sql, app_name: `${process.env['APP_NAME']}`});
  }
}
