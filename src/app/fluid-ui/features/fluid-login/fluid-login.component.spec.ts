import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluidLoginComponent } from './fluid-login.component';

describe('FluidLoginComponent', () => {
  let component: FluidLoginComponent;
  let fixture: ComponentFixture<FluidLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluidLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluidLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
