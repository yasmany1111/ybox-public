import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CodeShowcaseComponent } from './code-showcase/code-showcase.component';

const components = [CodeShowcaseComponent];

@NgModule({
  declarations: [...components],
  imports: [CommonModule],
  exports: [...components]
})
export class ExtraToolsModule {}
