import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-fluid-switch',
  templateUrl: './fluid-switch.component.html',
  styleUrls: ['./fluid-switch.component.scss'],
})
export class FluidSwitchComponent implements OnInit {
  @Input()
  public initialValue = false;

  public currentValue: boolean = this.initialValue;
  @Output()
  private valueChanged = new EventEmitter<boolean>();

  public ngOnInit() {
    this.currentValue = this.initialValue;
  }

  public emitNewValue(eventChange) {
    const isChecked: boolean = eventChange.currentTarget.checked;
    this.currentValue = isChecked;
    this.valueChanged.emit(this.currentValue);
  }
}
