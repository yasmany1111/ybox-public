import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FluidCardComponent } from './fluid-card/fluid-card.component';
import { FluidLoaderComponent } from './fluid-loader/fluid-loader.component';
import { FluidOverlayComponent } from './fluid-overlay/fluid-overlay.component';
import { FluidSwitchComponent } from './fluid-switch/fluid-switch.component';
import { FluidDividedRowComponent } from './layouts/fluid-divided-row/fluid-divided-row.component';
import { FluidDropAnythingComponent } from './fluid-drop-anything/fluid-drop-anything.component';
import { ExpansionPanelComponent } from './expansion-panel/expansion-panel.component';
import { MiniLoaderComponent } from './mini-loader/mini-loader.component';

const components = [
  FluidDividedRowComponent,
  FluidCardComponent,
  FluidDividedRowComponent,
  FluidSwitchComponent,
  FluidOverlayComponent,
  FluidLoaderComponent,
  FluidDropAnythingComponent,
  ExpansionPanelComponent,
  MiniLoaderComponent,
];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, FormsModule],
  exports: [...components],
})
export class FluidComponentsModule {}
