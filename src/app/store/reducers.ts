import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as fromInitializeApp from '../initialize/state/reducer';
import * as fromUserProfile from '../pages/user-profile/state/user-profile.reducer';
import * as fromSingleReport from '../pages/reports-and-documents/single-report/state/reducer';
import * as fromReportsAndDocuments from '../pages/reports-and-documents/medical-reports/state/reducer';
import * as fromRemoteConfig from './remote-config/remote-config.reducer';
import * as fromPayments from '../pages/payments-pa/state/payments.reducer';
export interface SmartHospitalState {
  [fromInitializeApp.featureKey]: fromInitializeApp.State;
  [fromUserProfile.featureKey]: fromUserProfile.State;
  [fromSingleReport.featureKey]: fromSingleReport.State;
  [fromReportsAndDocuments.featureKey]: fromReportsAndDocuments.State;
  [fromRemoteConfig.featureKey]: fromRemoteConfig.RemoteConfigState;
  [fromPayments.featureKey]: fromPayments.State;
}

export const reducers: ActionReducerMap<SmartHospitalState> = {
  [fromInitializeApp.featureKey]: fromInitializeApp.reducer,
  [fromUserProfile.featureKey]: fromUserProfile.reducer,
  [fromSingleReport.featureKey]: fromSingleReport.reducer,
  [fromReportsAndDocuments.featureKey]: fromReportsAndDocuments.reducer,
  [fromRemoteConfig.featureKey]: fromRemoteConfig.reducer,
  [fromPayments.featureKey]: fromPayments.reducer,
};

export const metaReducers: MetaReducer<SmartHospitalState>[] = [];
