import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { PublicViewsComponent } from './views/public-views/public-views.component';

const routes: Routes = [
  {
    path: '',
    component: PublicViewsComponent,
    pathMatch: 'full'
  },
  {
    path: 'views',
    loadChildren: () => import('./views/views.module').then((m) => m.ViewsModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
