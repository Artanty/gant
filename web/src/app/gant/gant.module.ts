import { ElementRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GantComponent } from './gant.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { StoreService } from './services/store.service';
import { GantService } from './services/gant.service';
import { GanttComponent } from './components/gantt/gantt.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ResizeService } from './services/resize.service';
import { DrawerComponent } from './components/drawer/drawer.component';
import { Observable, debounceTime, map, distinctUntilChanged } from 'rxjs';
import { LoaderComponent } from './components/loader/loader.component';
import { TaskFormComponent } from "./components/task-form/task-form.component";


export type TResizeResult = { width: number, height: number }

export function createResizeObservable(elementProp: Element | ElementRef): Observable<TResizeResult> {
  const element: Element = (elementProp instanceof ElementRef)
  ? elementProp.nativeElement
  : elementProp
  return new Observable<ResizeObserverEntry>(subscriber => {
    const ro = new ResizeObserver(([event]) => subscriber.next(event));
    ro.observe(element);

    return () => ro.unobserve(element);
  })
  .pipe(
    debounceTime(300),
    map((res: ResizeObserverEntry) => {
      return { width: Math.round(res.contentRect['width']), height: Math.round(res.contentRect['height']) }
    }),
    distinctUntilChanged()
  );
}

export const remoteRoutes: Routes = [
  {
    path: '',
    component: GantComponent,
  }
]

@NgModule({
    declarations: [
        GantComponent,
        GanttComponent,
        DrawerComponent,
        LoaderComponent,
    ],
    providers: [
        HttpClient,
        ApiService,
        StoreService,
        GantService,
        ResizeService
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(remoteRoutes),
        HttpClientModule,
        ReactiveFormsModule,
        TaskFormComponent
    ]
})
export class GantModule { }
