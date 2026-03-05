import { ActionReducerMap, MetaReducer } from '@ngrx/store'
import * as fromInitializeApp from '../initialize/state/reducer'


export interface SmartHospitalState {
  [fromInitializeApp.featureKey]: fromInitializeApp.State
}

export const reducers: ActionReducerMap<SmartHospitalState> = {
  [fromInitializeApp.featureKey]: fromInitializeApp.reducer,
}

export const metaReducers: MetaReducer<SmartHospitalState>[] = []
