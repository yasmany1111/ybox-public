import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FluidComponentsModule } from '../components/fluid-components.module';
import { FluidLoginComponent } from './fluid-login/fluid-login.component';

const components = [FluidLoginComponent];

@NgModule({
  declarations: [...components],
  exports: [...components],
  imports: [CommonModule, FluidComponentsModule, ReactiveFormsModule],
})
export class FluidFeaturesModule {}
