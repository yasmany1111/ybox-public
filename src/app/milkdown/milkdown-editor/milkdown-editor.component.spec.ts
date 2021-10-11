import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilkdownEditorComponent } from './milkdown-editor.component';

describe('MilkdownEditorComponent', () => {
  let component: MilkdownEditorComponent;
  let fixture: ComponentFixture<MilkdownEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MilkdownEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MilkdownEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
