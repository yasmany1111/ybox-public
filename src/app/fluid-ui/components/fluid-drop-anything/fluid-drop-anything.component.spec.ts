import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluidDropAnythingComponent } from './fluid-drop-anything.component';

describe('FluidDropAnythingComponent', () => {
  let component: FluidDropAnythingComponent;
  let fixture: ComponentFixture<FluidDropAnythingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluidDropAnythingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluidDropAnythingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
