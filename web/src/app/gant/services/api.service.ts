import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGantEvent } from './store.service';
import { Observable } from 'rxjs';

@Injectable()
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  public addEvent(data?: any) {
    data = this.getRandomEvent()
    const {eventName, dateFrom, dateTo } = data
    let sql = `INSERT INTO GanttEvents (EventName, StartDate, EndDate) VALUES ('${eventName}', '${dateFrom}', '${dateTo}')`;
    return this.http.post(`${process.env['BAG_URL']}/table-query`, { query: sql, app_name: `${process.env['APP_NAME']}`})
  }

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
}
