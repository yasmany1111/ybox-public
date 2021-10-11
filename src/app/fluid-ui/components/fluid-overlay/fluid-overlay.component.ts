import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-fluid-overlay',
  templateUrl: './fluid-overlay.component.html',
  styleUrls: ['./fluid-overlay.component.scss']
})
export class FluidOverlayComponent implements OnInit {
  @Output()
  public overlayClick = new EventEmitter<void>();

  public isRendered = false;

  constructor() {}

  public ngOnInit(): void {}

  public clickedOverlay(event: MouseEvent) {
    const target: HTMLDivElement = event.target as any;

    if (target.classList.contains('fluid-full-overlay')) {
      this.overlayClick.emit();
    }
  }
}
