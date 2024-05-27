import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GantComponent } from './gant.component';
import { RouterModule, Routes } from '@angular/router';



import { ResizableDirective } from './directives/resisable.directive';
import { FreeDraggingHandleDirective } from './directives/free-dragging-handle.directive';
import { FreeDraggingDirective } from './directives/draggable.directive';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { StoreService } from './services/store.service';
import { GantService } from './services/gant.service';


export const remoteRoutes: Routes = [
  {
    path: '',
    component: GantComponent,
    // resolve: { userExternals: UserExternalsResolver }
  }
]

@NgModule({
  declarations: [
    GantComponent,
    FreeDraggingDirective,
    FreeDraggingHandleDirective,
    ResizableDirective
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(remoteRoutes),
    HttpClientModule
  ],
  providers: [
    HttpClient,
    ApiService,
    StoreService,
    GantService
  ]
})
export class GantModule { }
