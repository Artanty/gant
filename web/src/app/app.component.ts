import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './gant/services/api.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { StoreService } from './gant/services/store.service';
import { GantService } from './gant/services/gant.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    HttpClient,
    ApiService,
    StoreService,
    GantService
  ]
})
export class AppComponent {

  title = 'gant';
  constructor (
    private apiService: ApiService,
    private gantService: GantService
  ) {}

  public addEvent() {
    // this.apiService.addEvent().subscribe(res => console.log(res))
    this.gantService.addGantEvent()
  }
}
