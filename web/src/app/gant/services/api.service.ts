import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

  private getRandomEvent () {
    return {
      eventName: 'event' + Math.floor(Math.random() * 100),
      dateFrom: new Date().toISOString().slice(0, 10), // Get the current date in YYYY-MM-DD format
      dateTo: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString().slice(0, 10), // Add 3 hours to the current date
    }
  }
}
