import {
  Directive,
  ElementRef,
  Renderer2,
  inject,
  OnInit
} from '@angular/core';

@Directive({
  selector: '[appModalContent]',
  standalone: true
})
export class ModalContentDirective implements OnInit {
  private el = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);

  ngOnInit(): void {
    this.applyUswdsBodyClass();
    this.applyScrollConstraints();
    this.warnIfImproperUsage();
  }

  private applyUswdsBodyClass(): void {
    this.renderer.addClass(this.el.nativeElement, 'usa-modal__body');
    this.renderer.addClass(this.el.nativeElement, 'usa-prose'); // Optional: USWDS typography
  }

  private applyScrollConstraints(): void {
    this.renderer.setStyle(this.el.nativeElement, 'max-height', 'calc(90vh - 7rem)');
    this.renderer.setStyle(this.el.nativeElement, 'overflow-y', 'auto');
    this.renderer.setStyle(this.el.nativeElement, 'padding', '1.5rem');
  }

  private warnIfImproperUsage(): void {
    const tag = this.el.nativeElement.tagName.toLowerCase();
    if (tag === 'p' || tag === 'span') {
      console.warn('[appModalContent] is intended to wrap full modal content, not just inline text.');
    }
  }
}
