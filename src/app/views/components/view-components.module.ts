import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageSelectorComponent } from './page-selector/page-selector.component';
import { PageListItemComponent } from './page-selector/page-list-item/page-list-item.component';

const components = [PageSelectorComponent];

@NgModule({
  declarations: [...components, PageListItemComponent],
  imports: [CommonModule, RouterModule],
  exports: [...components]
})
export class ViewComponentsModule {}
