import { PaymentsEffects } from '../pages/payments/payments-pa/state/payments.effects';
import { ConsentsA4HEffects } from '../pages/user-profile/a4h-consents/state/effects';
import { PaymentsJcEffects } from '../pages/payments/payments-jcash/state/effects';
import { ReportsAndDocumentsEffects } from '../pages/reports-and-documents/medical-reports/state/effects';
import { TripletReportEffects } from '../pages/reports-and-documents/reports-by-triplet/state/effects';
import { SingleReportEffects } from '../pages/reports-and-documents/single-report/state/effects';
import { UserProfileEffects } from '../pages/user-profile/state/user-profile.effects';
import { BookingsEffects } from '../pages/bookings/bookings-ariannaCup/state/effects';
import { BookingsHeroEffects } from '../pages/bookings/bookings-hero/state/effects';
import { BookingUnifiedEffects } from '../pages/bookings/booking-a4h/state/effects';
import { StrutturaEffects } from '../pages/bookings/booking-a4h/state/struttura/struttura.effects';

export const effects = [
  UserProfileEffects,
  SingleReportEffects,
  ReportsAndDocumentsEffects,
  PaymentsEffects,
  PaymentsJcEffects,
  TripletReportEffects,
  BookingsEffects,
  BookingsHeroEffects,
  BookingUnifiedEffects,
  StrutturaEffects,
  ConsentsA4HEffects,
];
