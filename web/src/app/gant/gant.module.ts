import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GantComponent } from './gant.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { StoreService } from './services/store.service';
import { GantService } from './services/gant.service';
import { GanttComponent } from './components/gantt/gantt.component';
import { ReactiveFormsModule } from '@angular/forms';

export const remoteRoutes: Routes = [
  {
    path: '',
    component: GantComponent,
  }
]

@NgModule({
  declarations: [
    GantComponent,
    GanttComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(remoteRoutes),
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    HttpClient,
    ApiService,
    StoreService,
    GantService
  ]
})
export class GantModule { }
