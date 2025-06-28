import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-input-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="file-input-demo-container">
      <div class="file-input-demo-content">
        <div class="usa-file-input usa-file-input--large">
          <input
            class="usa-file-input__input"
            id="file-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            (change)="onFileSelected($event)"
          />
          <label class="usa-file-input__label" for="file-upload">
            <span class="usa-file-input__button">Choose file</span>
          </label>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .file-input-demo-container {
      margin: 2rem;
      min-height: calc(100vh - 4rem);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .file-input-demo-content {
      width: 100%;
      max-width: 600px;
      text-align: center;
    }

    .usa-file-input {
      width: 100%;
    }

    .usa-file-input__button {
      padding: 1rem;
      font-size: 1.25rem;
    }

    .usa-file-input__label {
      display: block;
      margin: 0;
    }
  `]
})
export class FileInputDemoComponent {
  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      console.log('Selected file:', file.name);
    }
  }
}
