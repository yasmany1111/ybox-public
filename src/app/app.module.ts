import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthHttpInterceptor } from '@auth0/auth0-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FluidUiModule } from './fluid-ui/fluid-ui.module';
import { ViewComponentsModule } from './views/components/view-components.module';
import { StoreModule } from '@ngrx/store';
import { LayeredStorageModule } from './core/layered-storage/layered-storage.module';
import {
  layeredStorageFeatureKey,
  layeredStorageReducer
} from './core/layered-storage/core/store/layered-storage-state.reducer';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FluidUiModule,
    ViewComponentsModule,
    HttpClientModule,
    AuthModule.forRoot({
      domain: environment.domain,
      clientId: environment.clientId,
      httpInterceptor: {
        allowedList: [
          {
            // Match any request that starts 'https://YOUR_DOMAIN/api/v2/' (note the asterisk)
            uri: '*',
            tokenOptions: {
              // The attached token should have these scopes
              scope: 'read:current_user'
            }
          }
        ]
      }
    }),
    StoreModule.forRoot({}),
    LayeredStorageModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule {}
