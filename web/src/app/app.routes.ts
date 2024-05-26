import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./gant/gant.module').then((m) => m.GantModule)
  }
];
