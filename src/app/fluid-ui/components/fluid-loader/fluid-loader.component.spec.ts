import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluidLoaderComponent } from './fluid-loader.component';

describe('FluidLoaderComponent', () => {
  let component: FluidLoaderComponent;
  let fixture: ComponentFixture<FluidLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluidLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluidLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
