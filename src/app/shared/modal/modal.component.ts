import {
  Component,
  ElementRef,
  TemplateRef,
  Renderer2,
  effect,
  signal,
  input,
  output,
  viewChild,
  contentChild,
  HostListener,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalHeaderDirective } from './modal-header.directive';
import { ModalContentDirective } from './modal-content.directive';
import { ModalFooterDirective } from './modal-footer.directive';
import { ModalSize } from './modal.model';
import { FocusTrapDirective } from './focus-trap.directive';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    CommonModule,
    FocusTrapDirective,
  ],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  host: {
    '[class.is-visible]': 'open()'
  }
})
export class ModalComponent implements AfterViewInit {
  readonly id = input<string>(`modal-${Math.random().toString(36).substring(2, 11)}`);
  readonly size = input<ModalSize>('medium');
  readonly closeOnBackdropClick = input<boolean>(true);
  readonly closeOnEscape = input<boolean>(true);
  readonly showCloseButton = input<boolean>(true);
  readonly ariaLabelledBy = input<string | undefined>(undefined);
  readonly ariaDescribedBy = input<string | undefined>(undefined);
  readonly open = input<boolean>(false);

  readonly openChange = output<boolean>();
  readonly beforeClose = output<void>();
  readonly afterOpen = output<void>();

  readonly modalElement = viewChild<ElementRef>('modalElement');
  readonly dialogElement = viewChild<ElementRef>('dialogElement');

  readonly headerTemplate = contentChild(ModalHeaderDirective, { read: TemplateRef });
  readonly contentTemplate = contentChild(ModalContentDirective, { read: TemplateRef });
  readonly footerTemplate = contentChild(ModalFooterDirective, { read: TemplateRef });

  private previouslyFocusedElement: HTMLElement | null = null;
  private animating = signal(false);

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {
    effect(() => {
      if (this.open() && !this.animating()) {
        this.trapFocus();
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.open()) {
      this.showModal();
    }
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    if (this.open() && this.closeOnEscape()) {
      this.closeModal();
    }
  }

  showModal(): void {
    if (this.animating()) return;
    
    this.openChange.emit(true);
    this.animating.set(true);
    
    setTimeout(() => {
      this.animating.set(false);
      this.afterOpen.emit();
    }, 300);
  }

  closeModal(): void {
    if (this.animating()) return;
    
    this.beforeClose.emit();
    this.animating.set(true);
    
    setTimeout(() => {
      this.openChange.emit(false);
      this.animating.set(false);
      this.restoreFocus();
    }, 300);
  }

  backdropClick(event: MouseEvent): void {
    if (
      this.closeOnBackdropClick() && 
      (event.target as HTMLElement).classList.contains('usa-modal-overlay')
    ) {
      this.closeModal();
    }
  }

  private trapFocus(): void {
    this.previouslyFocusedElement = document.activeElement as HTMLElement;

    setTimeout(() => {
      const el = this.elementRef.nativeElement;
      const focusable = el.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;

      if (focusable) {
        focusable.focus();
      } else {
        this.dialogElement()?.nativeElement.focus();
      }
    });
  }

  private restoreFocus(): void {
    this.previouslyFocusedElement?.focus();
    this.previouslyFocusedElement = null;
  }
}