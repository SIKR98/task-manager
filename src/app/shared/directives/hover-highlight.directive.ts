import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHoverHighlight]',
  standalone: true,
})
export class HoverHighlightDirective {
  @Input('appHoverHighlight') highlightColor = '#f0f0f0';

  private originalColor: string = '';

  constructor(private el: ElementRef) {
    this.originalColor = this.el.nativeElement.style.backgroundColor;
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.el.nativeElement.style.backgroundColor = this.highlightColor;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.el.nativeElement.style.backgroundColor = this.originalColor;
  }
}
