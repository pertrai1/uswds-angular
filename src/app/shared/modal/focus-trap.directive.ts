import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  signal,
  effect,
  input
} from '@angular/core';

@Directive({
  selector: '[appFocusTrap]',
  standalone: true
})
export class FocusTrapDirective {
  private readonly host = inject(ElementRef<HTMLElement>);

  // ✅ Angular 18 input() — signal-aware binding
  readonly focusTrapEnabled = input<boolean>(false);

  constructor() {
    // Automatically focus the first focusable element when enabled
    effect(() => {
      if (this.focusTrapEnabled()) {
        queueMicrotask(() => this.focusFirstElement());
      }
    });
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.focusTrapEnabled() || event.key !== 'Tab') return;

    const focusable = this.getFocusableElements();

    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const active = document.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private getFocusableElements(): HTMLElement[] {
    const selector =
      'a[href], area[href], input:not([disabled]), select:not([disabled]), ' +
      'textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const elements = Array.from(
      this.host.nativeElement.querySelectorAll(selector)
    ) as HTMLElement[];

    // Filters out hidden or visually collapsed elements
    return elements.filter(
      (el) =>
        el.offsetParent !== null ||
        el instanceof SVGElement ||
        window.getComputedStyle(el).visibility !== 'hidden'
    );
  }

  private focusFirstElement(): void {
    const focusable = this.getFocusableElements();
    if (focusable.length > 0) {
      focusable[0].focus();
    } else {
      this.host.nativeElement.focus();
    }
  }
}
