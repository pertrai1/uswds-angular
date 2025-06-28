import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import exifreader, { XmpTag, XmpTags } from "exifreader";

interface ImageInfo {
  file: File;
  thumbnail: string;
  location?: string;
  date?: string;
}

@Component({
  selector: "app-file-input-demo",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="file-input-demo-container" (drop)="onDrop($event)" (dragover)="onDragOver($event)">
      <div class="grid-container">
        <div *ngFor="let image of images" class="image-box">
          <div class="thumbnail-container">
            <img [src]="image.thumbnail" class="thumbnail" />
          </div>
          <div class="image-info">
            <div class="filename">{{ image.file.name }}</div>
            <div class="file-size">{{ getFileSize(image.file.size) }}</div>
            <div class="exif-info" *ngIf="image.date || image.location">
              <div class="exif-date" *ngIf="image.date">Date: {{ image.date }}</div>
              <div class="exif-location" *ngIf="image.location">Location: {{ image.location }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .file-input-demo-container {
        margin: 2rem;
        height: calc(100vh - 4rem);
        display: flex;
        justify-content: center;
        align-items: center;
        border: 2px dashed #000;
        border-radius: 4px;
        transition: border-color 0.3s;
        overflow: hidden;

        &:hover {
          border-color: #0071bc;
        }
      }

      .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
        width: 100%;
        max-width: 1200px;
        padding: 1rem;
      }

      .image-box {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 1rem;
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .thumbnail-container {
        width: 200px;
        height: 200px;
        overflow: hidden;
        border-radius: 4px;
        margin-bottom: 0.5rem;
      }

      .thumbnail {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .image-info {
        font-size: 0.875rem;
        color: #333;
      }

      .filename {
        font-weight: 500;
        margin-bottom: 0.25rem;
      }

      .file-size {
        color: #666;
        margin-bottom: 0.5rem;
      }

      .exif-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        color: #666;
      }
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
    `,
  ],
})
export class FileInputDemoComponent {
  images: ImageInfo[] = [];

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

  private async handleDroppedItems(items: DataTransferItemList) {
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
      this.processFiles(files);
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

  private async processFiles(files: File[]) {
    const newImages: ImageInfo[] = await Promise.all(
      files.map(async (file) => {
        const imageInfo: ImageInfo = {
          file,
          thumbnail: await this.createThumbnail(file)
        };

        // Read EXIF data
        try {
          const exifData = await exifreader.load(file);
          if (exifData.GPSLatitude && exifData.GPSLongitude) {
            imageInfo.location = this.formatLocation(exifData);
          }
          if (exifData.DateTimeOriginal) {
            imageInfo.date = this.formatDate(exifData.DateTimeOriginal);
          }
        } catch (error) {
          console.warn('Error reading EXIF data:', error);
        }

        return imageInfo;
      })
    );

    this.images = [...this.images, ...newImages];
  }

  private createThumbnail(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const maxSize = 200;
            let width = img.width;
            let height = img.height;
            
            if (width > height) {
              if (width > maxSize) {
                height *= maxSize / width;
                width = maxSize;
              }
            } else {
              if (height > maxSize) {
                width *= maxSize / height;
                height = maxSize;
              }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL());
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  private formatLocation(exifData: any): string {
    const lat = this.dmsToDecimal(exifData.GPSLatitude.value, exifData.GPSLatitudeRef.value);
    const lon = this.dmsToDecimal(exifData.GPSLongitude.value, exifData.GPSLongitudeRef.value);
    return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
  }

  private dmsToDecimal(dms: any[], ref: string): number {
    const degrees = dms[0].numerator / dms[0].denominator;
    const minutes = dms[1].numerator / dms[1].denominator;
    const seconds = dms[2].numerator / dms[2].denominator;
    const decimal = degrees + (minutes / 60) + (seconds / 3600);
    return ref === 'S' || ref === 'W' ? -decimal : decimal;
  }

  private formatDate(dateString: string | { value?: any }): string {
    // Extract the first string value from any possible tag/array structure
    const extractDateValue = (value: any): string => {
      if (typeof value === 'string') return value;
      if (Array.isArray(value) && value.length > 0) return extractDateValue(value[0]);
      if (typeof value === 'object' && value !== null && 'value' in value) {
        return extractDateValue(value.value);
      }
      return '';
    };

    const dateValue = typeof dateString === 'string' 
      ? dateString 
      : extractDateValue(dateString?.value);
    
    // Safely create date from string
    const date = new Date(dateValue);
    return !isNaN(date.getTime()) ? date.toLocaleString() : '';
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
