import { PaymentsEffects } from '../pages/payments-pa/state/payments.effects';
import { PaymentsJcEffects } from '../pages/payments-jcash/state/effects';
import { ReportsAndDocumentsEffects } from '../pages/reports-and-documents/medical-reports/state/effects';
import { TripletReportEffects } from '../pages/reports-and-documents/reports-by-triplet/state/effects';
import { SingleReportEffects } from '../pages/reports-and-documents/single-report/state/effects';
import { UserProfileEffects } from '../pages/user-profile/state/user-profile.effects';

export const effects = [
  UserProfileEffects,
  SingleReportEffects,
  ReportsAndDocumentsEffects,
  PaymentsEffects,
  PaymentsJcEffects,
  TripletReportEffects,
];
