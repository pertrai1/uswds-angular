import {
  Directive,
  ElementRef,
  Renderer2,
  inject,
  computed,
  effect,
  signal
} from '@angular/core';

@Directive({
  selector: '[appModalHeader]',
  standalone: true
})
export class ModalHeaderDirective {
  private el = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);

  // Public `id` used for ARIA binding
  readonly id = signal<string>(this.ensureId());

  constructor() {
    this.addClass();
    this.warnIfNotHeading();
  }

  private ensureId(): string {
    const element = this.el.nativeElement;
    const currentId = element.getAttribute('id');

    if (currentId) {
      return currentId;
    }

    const generatedId = `modal-header-${Math.random().toString(36).substring(2, 8)}`;
    this.renderer.setAttribute(element, 'id', generatedId);
    return generatedId;
  }

  private addClass(): void {
    this.renderer.addClass(this.el.nativeElement, 'usa-modal__heading');
  }

  private warnIfNotHeading(): void {
    const tag = this.el.nativeElement.tagName.toLowerCase();
    if (!/^h[1-6]$/.test(tag)) {
      console.warn(
        '[appModalHeader] should ideally be used on an <h1>–<h6> element for proper accessibility.'
      );
    }
  }
}
