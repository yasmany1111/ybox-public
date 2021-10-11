import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluidOverlayComponent } from './fluid-overlay.component';

describe('FluidOverlayComponent', () => {
  let component: FluidOverlayComponent;
  let fixture: ComponentFixture<FluidOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluidOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluidOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
