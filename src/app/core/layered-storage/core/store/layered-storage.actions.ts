import { createAction, props } from '@ngrx/store';
import { LayerSaveStatus } from '../enums';

// ------------------- Main ------------------- //

export const setVersion = createAction(
  '[LayeredStorage] Set current version',
  props<{ version: string }>()
);

export const putKey = createAction(
  '[LayeredStorage] Put key',
  props<{ keyName: string; content: any }>()
);

export const updateSaveStatus = createAction(
  '[LayeredStorage] Update key sve status',
  props<{ keyName: string; saveStatus: LayerSaveStatus }>()
);
