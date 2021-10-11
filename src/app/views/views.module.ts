import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FluidUiModule } from '../fluid-ui/fluid-ui.module';
import { MilkdownModule } from '../milkdown/milkdown.module';
import { ChangelogComponent } from './changelog/changelog.component';
import { EditorComponent } from './editor/editor.component';
import { LoginComponent } from './login/login.component';
import { PublicViewsComponent } from './public-views/public-views.component';
import { SettingsComponent } from './settings/settings.component';
import { ViewsRoutingModule } from './views-routing.module';

@NgModule({
  declarations: [
    EditorComponent,
    LoginComponent,
    PublicViewsComponent,
    SettingsComponent,
    ChangelogComponent
  ],
  imports: [CommonModule, ViewsRoutingModule, MilkdownModule, FluidUiModule],
  exports: []
})
export class ViewsModule {}
