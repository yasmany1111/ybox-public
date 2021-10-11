import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluidCardComponent } from './fluid-card.component';

describe('FluidCardComponent', () => {
  let component: FluidCardComponent;
  let fixture: ComponentFixture<FluidCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluidCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluidCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
