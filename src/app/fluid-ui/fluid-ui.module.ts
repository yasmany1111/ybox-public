// VERSION: 1.0.0rc
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FluidComponentsModule } from './components/fluid-components.module';

const components = [];

@NgModule({
  declarations: [...components],
  exports: [...components, FluidComponentsModule],
  imports: [CommonModule, FluidComponentsModule],
})
export class FluidUiModule {}
