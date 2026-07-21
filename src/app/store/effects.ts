import { PaymentsEffects } from '../pages/payments-pa/state/payments.effects';
import { PaymentsJcEffects } from '../pages/payments-jcash/state/effects';
import { ReportsAndDocumentsEffects } from '../pages/reports-and-documents/medical-reports/state/effects';
import { TripletReportEffects } from '../pages/reports-and-documents/reports-by-triplet/state/effects';
import { SingleReportEffects } from '../pages/reports-and-documents/single-report/state/effects';
import { UserProfileEffects } from '../pages/user-profile/state/user-profile.effects';
import { BookingsEffects } from '../pages/bookings-ariannaCup/state/effects';
import { BookingsHeroEffects } from '../pages/bookings-hero/state/effects';

export const effects = [
  UserProfileEffects,
  SingleReportEffects,
  ReportsAndDocumentsEffects,
  PaymentsEffects,
  PaymentsJcEffects,
  TripletReportEffects,
  BookingsEffects,
  BookingsHeroEffects,
];
