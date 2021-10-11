import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluidSwitchComponent } from './fluid-switch.component';

describe('FluidSwitchComponent', () => {
  let component: FluidSwitchComponent;
  let fixture: ComponentFixture<FluidSwitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluidSwitchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluidSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
