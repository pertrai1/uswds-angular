import {
  Directive,
  ElementRef,
  Renderer2,
  inject,
  OnInit
} from '@angular/core';

@Directive({
  selector: '[appModalFooter]',
  standalone: true
})
export class ModalFooterDirective implements OnInit {
  private el = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);

  ngOnInit(): void {
    this.addClasses();
    this.warnIfInappropriateTag();
  }

  private addClasses(): void {
    this.renderer.addClass(this.el.nativeElement, 'usa-modal__footer');

    // Optionally enforce right-aligned buttons with spacing
    this.renderer.setStyle(this.el.nativeElement, 'display', 'flex');
    this.renderer.setStyle(this.el.nativeElement, 'justify-content', 'flex-end');
    this.renderer.setStyle(this.el.nativeElement, 'gap', '0.5rem');
  }

  private warnIfInappropriateTag(): void {
    const tag = this.el.nativeElement.tagName.toLowerCase();
    if (tag === 'button' || tag === 'input') {
      console.warn('[appModalFooter] should wrap buttons, not be applied to a single button element.');
    }
  }
}
