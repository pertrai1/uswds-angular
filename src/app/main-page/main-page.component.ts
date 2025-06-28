import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="grid-container">
      <h1>Welcome to USWDS Demos</h1>
      <div class="usa-prose">
        <ul class="usa-list">
          <li>
            <a routerLink="/demo" class="usa-link">
              <span class="usa-link__text">Demo Component</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 2rem;
    }
  `]
})
export class MainPageComponent { }
