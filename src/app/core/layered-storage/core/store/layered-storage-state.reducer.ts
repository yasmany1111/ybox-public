import { createReducer, on } from '@ngrx/store';
import { LayerSaveStatus } from '../enums';
import { ILayerSaveState } from '../interfaces';
import * as LayeredStorageActionTypes from './layered-storage.actions';

export const layeredStorageFeatureKey = 'layeredStorageState';

export interface ILayeredStorageState {
  inMemoryKVStore: { [keyName: string]: any };
  layerSaveState: ILayerSaveState[];
}

export const layeredStorageInitialState: ILayeredStorageState = {
  inMemoryKVStore: {},
  layerSaveState: []
};

export const layeredStorageReducer = createReducer(
  layeredStorageInitialState,
  on(LayeredStorageActionTypes.putKey, (state: ILayeredStorageState, action) => {
    const modifiedState = JSON.parse(JSON.stringify(state.inMemoryKVStore));
    modifiedState[action.keyName] = action.content;

    // const newStatuses = state.layerSaveState.filter(
    //   (prevStatus) => prevStatus.keyName !== action.keyName
    // );

    // const newLayerState: ILayerSaveState = {
    //   keyName: action.keyName,
    //   status: LayerSaveStatus.QueuedFirstLayer
    // };
    // newStatuses.push(newLayerState);

    return { ...state, inMemoryKVStore: modifiedState};
  }),
  on(LayeredStorageActionTypes.updateSaveStatus, (state: ILayeredStorageState, action) => {
    const newStatuses = state.layerSaveState.filter(
      (prevStatus) => prevStatus.keyName !== action.keyName
    );

    const newLayerState: ILayerSaveState = {
      keyName: action.keyName,
      status: action.saveStatus
    };

    newStatuses.push(newLayerState);

    return { ...state, layerSaveState: newStatuses };
  })
);
