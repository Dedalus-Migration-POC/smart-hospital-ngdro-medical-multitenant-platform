import { createReducer, on } from '@ngrx/store';
import { HealthcareUnit } from 'src/app/pages/bookings/booking-unified/booking-unified.service';
import * as StrutturaActions from './struttura.actions';

export const featureKey = 'strutturaState';

export interface StrutturaState {
  units: HealthcareUnit[];
  loading: boolean;
  error: boolean;
  selectedUnit: HealthcareUnit | null;
}

export const initialState: StrutturaState = {
  units: [],
  loading: false,
  error: false,
  selectedUnit: null,
};

export const reducer = createReducer(
  initialState,
  on(StrutturaActions.fetchStrutture, (state) => ({
    ...state,
    loading: true,
    error: false,
  })),
  on(StrutturaActions.fetchStruttureSuccess, (state, { data }) => ({
    ...state,
    loading: false,
    units: data,
  })),
  on(StrutturaActions.fetchStruttureFailure, (state) => ({
    ...state,
    loading: false,
    error: true,
  })),
  on(StrutturaActions.setSelectedStruttura, (state, { struttura }) => ({
    ...state,
    selectedUnit: struttura,
  })),
  on(StrutturaActions.clearSelectedStruttura, (state) => ({
    ...state,
    selectedUnit: null,
  })),
);
