import { createAction, props } from '@ngrx/store';
export const update = createAction(
  '@@remote-config/UPDATE',
  props<{ path: string; value: unknown }>(),
);
