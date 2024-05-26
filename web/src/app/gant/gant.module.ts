import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GantComponent } from './gant.component';
import { RouterModule, Routes } from '@angular/router';



import { ResizableDirective } from './directives/resisable.directive';
import { FreeDraggingHandleDirective } from './directives/free-dragging-handle.directive';
import { FreeDraggingDirective } from './directives/draggable.directive';


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
    RouterModule.forChild(remoteRoutes)
  ]
})
export class GantModule { }
