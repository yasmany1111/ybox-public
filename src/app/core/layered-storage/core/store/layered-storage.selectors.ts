import { createFeatureSelector, createSelector } from '@ngrx/store';
import { layeredStorageFeatureKey, ILayeredStorageState } from './layered-storage-state.reducer';

export const selectLayeredStorageState =
  createFeatureSelector<ILayeredStorageState>(layeredStorageFeatureKey);

export const selectKey = (id: string) =>
  createSelector(
    selectLayeredStorageState,
    (layeredStorageState) => layeredStorageState.inMemoryKVStore[id]
  );

export const selectLayerSaveState = createSelector(
  selectLayeredStorageState,
  (layeredStorageState) => layeredStorageState.layerSaveState
);
