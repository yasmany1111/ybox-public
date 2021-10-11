import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MilkdownEditorComponent } from './milkdown-editor/milkdown-editor.component';

@NgModule({
  declarations: [MilkdownEditorComponent],
  imports: [CommonModule],
  exports: [MilkdownEditorComponent]
})
export class MilkdownModule {}
