import { Routes } from '@angular/router';
import { DemoComponent } from './demo/demo.component';
import { MainPageComponent } from './main-page/main-page.component';
import { FileInputDemoComponent } from './file-input-demo/file-input-demo.component';

export const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'demo', component: DemoComponent },
  { path: 'file-input-demo', component: FileInputDemoComponent },
  { path: '**', redirectTo: '' }
];
