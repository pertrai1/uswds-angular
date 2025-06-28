import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-file-input-demo",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="file-input-demo-container"
      (drop)="onDrop($event)"
      (dragover)="onDragOver($event)"
    >
      <div class="usa-file-input usa-file-input--large">
        <input
          id="file-input-multiple"
          class="usa-file-input__input"
          type="file"
          name="file-input-multiple"
          aria-describedby="file-input-multiple-hint"
          multiple="multiple"
        />
        <label class="usa-file-input__label" for="file-input-multiple">
          <span class="usa-file-input__button"
            >Choose images or drop folder</span
          >
        </label>
      </div>
    </div>
  `,
  styles: [
    `
      .file-input-demo-container {
        margin: 2rem;
        min-height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 2px dashed #000;
        border-radius: 4px;
        padding: 2rem;
        transition: border-color 0.3s;
      }

      .file-input-demo-container:hover {
        border-color: #0071bc;
      }

      .usa-file-input {
        width: 100%;
      }
    `,
  ],
})
export class FileInputDemoComponent {
  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const files = fileInput.files;
    if (files) {
      console.log(
        "Selected files:",
        Array.from(files).map((f) => f.name)
      );
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const items = event.dataTransfer?.items;
    if (items) {
      console.log("Dropped items:", items.length);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
}
