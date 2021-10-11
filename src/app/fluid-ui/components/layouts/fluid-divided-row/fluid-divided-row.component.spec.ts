import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluidDividedRowComponent } from './fluid-divided-row.component';

describe('FluidDividedRowComponent', () => {
  let component: FluidDividedRowComponent;
  let fixture: ComponentFixture<FluidDividedRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluidDividedRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluidDividedRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
