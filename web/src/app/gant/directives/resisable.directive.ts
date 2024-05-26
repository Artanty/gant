import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appResizable]'
})
export class ResizableDirective {
  @Input() resizableGrabWidth = 8;
  @Input() resizableMinWidth = 10;
  @Input() resizableMaxWidth!: number;

  @Output() resize: EventEmitter<number> = new EventEmitter();

  private dragging = false;

  constructor(private el: ElementRef) {
    const resizableElement = this.el.nativeElement;
    resizableElement.style.position = 'relative';
    resizableElement.style.cursor = 'col-resize';
    resizableElement.style.userSelect = 'none';

    const resizer = document.createElement('div');
    resizer.className = 'resizer';
    resizer.style.position = 'absolute';
    resizer.style.top = '0';
    resizer.style.right = '0';
    resizer.style.width = `${this.resizableGrabWidth}px`;
    resizer.style.height = '100%';
    resizer.style.cursor = 'col-resize';
    resizer.style.zIndex = '1';

    resizableElement.appendChild(resizer);

    resizer.addEventListener('mousedown', this.onMouseDown.bind(this));
  }

  onMouseDown(event: MouseEvent) {
    this.dragging = true;
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  onMouseMove(event: MouseEvent) {
    if (!this.dragging) {
      return;
    }

    const resizableElement = this.el.nativeElement;
    const newWidth = event.clientX - resizableElement.getBoundingClientRect().left;
    const clampedWidth = Math.max(this.resizableMinWidth, Math.min(newWidth, this.resizableMaxWidth || newWidth));

    resizableElement.style.width = `${clampedWidth}px`;
    this.resize.emit(clampedWidth);
  }

  onMouseUp(event: MouseEvent) {
    this.dragging = false;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }
}
