import { Component, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { DemoComponent } from './app/demo/demo.component';
import { MainPageComponent } from './app/main-page/main-page.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `<router-outlet></router-outlet>`
})
export class App {}

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(FormsModule),
    provideRouter(routes)
  ]
})
.catch((err) => console.error(err));