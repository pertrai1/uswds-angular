import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-input-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="file-input-demo-container" (drop)="onDrop($event)" (dragover)="onDragOver($event)">
      <div class="file-input-demo-content">
        <div class="usa-file-input usa-file-input--large">
          <input
            #fileInput
            class="usa-file-input__input"
            id="file-upload"
            type="file"
            accept="image/*"
            multiple
            webkitdirectory
            mozdirectory
            directory
            (change)="onFileSelected($event)"
          />
          <label class="usa-file-input__label" for="file-upload">
            <span class="usa-file-input__button">Choose images or drop folder</span>
          </label>
          <div class="file-list" *ngIf="selectedFiles.length > 0">
            <div *ngFor="let file of selectedFiles" class="file-item">
              <span>{{ file.name }}</span>
              <span class="file-size">{{ getFileSize(file.size) }}</span>
            </div>
          </div>
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
      border: 2px dashed #000;
      border-radius: 4px;
      padding: 2rem;
      transition: border-color 0.3s;
    }

    .file-input-demo-container:hover {
      border-color: #0071bc;
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

    .file-list {
      margin-top: 1rem;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 4px;
    }

    .file-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      padding: 0.5rem;
      background: white;
      border-radius: 3px;
    }

    .file-size {
      font-size: 0.875rem;
      color: #666;
    }
  `]
})
export class FileInputDemoComponent {
  selectedFiles: File[] = [];

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const files = fileInput.files;
    if (files) {
      const newFiles = Array.from(files);
      this.selectedFiles = [...this.selectedFiles, ...newFiles];
      console.log('Selected files:', this.selectedFiles.map(f => f.name));
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const items = event.dataTransfer?.items;
    if (items) {
      this.handleDroppedItems(items);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  private handleDroppedItems(items: DataTransferItemList) {
    const files: File[] = [];
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.webkitGetAsEntry) {
        const entry = item.webkitGetAsEntry();
        if (entry) {
          if (entry.isDirectory) {
            this.readDirectory(entry as FileSystemDirectoryEntry, files);
          } else if (entry.isFile) {
            const file = entry as FileSystemFileEntry;
            file.file((fileObj: File) => {
              if (fileObj.type.startsWith('image/')) {
                files.push(fileObj);
              }
            });
          }
        }
      }
    }

    if (files.length > 0) {
      this.selectedFiles = [...this.selectedFiles, ...files];
      console.log('Dropped files:', files.map(f => f.name));
    }
  }

  private readDirectory(directory: FileSystemDirectoryEntry, files: File[]) {
    const reader = directory.createReader();
    reader.readEntries(entries => {
      entries.forEach(entry => {
        if (entry.isDirectory) {
          this.readDirectory(entry as FileSystemDirectoryEntry, files);
        } else if (entry.isFile) {
          const file = entry as FileSystemFileEntry;
          file.file((fileObj: File) => {
            if (fileObj.type.startsWith('image/')) {
              files.push(fileObj);
            }
          });
        }
      });
    });
  }

  getFileSize(size: number): string {
    if (size >= 1024 * 1024) {
      return (size / (1024 * 1024)).toFixed(1) + ' MB';
    } else if (size >= 1024) {
      return (size / 1024).toFixed(1) + ' KB';
    }
    return size + ' bytes';
  }
}
