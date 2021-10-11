import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import {
  layeredStorageFeatureKey,
  layeredStorageReducer
} from './core/store/layered-storage-state.reducer';

@NgModule({
  declarations: [],
  imports: [CommonModule, StoreModule.forFeature(layeredStorageFeatureKey, layeredStorageReducer)],
  exports: []
})
export class LayeredStorageModule {}
