import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { ApiService } from './api.service';

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

    this.storeService.setGantEvents([event1, event2])
  }
}
