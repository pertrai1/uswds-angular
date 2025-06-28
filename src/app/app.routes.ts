import { Routes } from '@angular/router';
import { DemoComponent } from './demo/demo.component';
import { MainPageComponent } from './main-page/main-page.component';

export const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'demo', component: DemoComponent },
  { path: '**', redirectTo: '' }
];
