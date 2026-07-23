import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { Store } from '@ngrx/store';
import { SmartHospitalState } from 'src/app/store/reducers';
import {
  restartLp,
  setActiveStep,
  setSummaryBooking,
} from 'src/app/pages/bookings/bookings-hero/state/actions';
import {
  selectActiveStep,
  selectBookingHeroSummary,
} from 'src/app/pages/bookings/bookings-hero/state/selectors';
import { take, tap } from 'rxjs';
import { BookingStepId } from 'src/app/pages/bookings/bookings-hero/state/model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-hero-summary-card',
  standalone: true,
  imports: [CommonModule, DesignAngularKitModule, TranslateModule],
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.scss'],
})
export class SummaryCardComponent implements OnInit {
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly router = inject(Router);
  newBookingTypes = ['nre', 'nre_delegate', 'free_prof', 'free_prof_delegate'];
  moveBookingTypes = ['nre_to_move', 'free_prof_to_move'];

  ngOnInit(): void {}
  readonly summaryBookingHero = this.store.selectSignal(selectBookingHeroSummary);
  readonly currentActiveStep = this.store.selectSignal(selectActiveStep);

  setActiveStep(step: string) {
    const summary = this.summaryBookingHero();
    const currentActiveStep = this.currentActiveStep();

    if (
      currentActiveStep === BookingStepId.AvailableAppointments &&
      step !== BookingStepId.Confirmation
    ) {
      this.store.dispatch(restartLp({ sessionId: summary?.sessionId! }));
    }

    switch (step) {
      case BookingStepId.SelectBookingType:
        this.store.dispatch(
          setSummaryBooking({
            payload: null,
          }),
        );
        break;
      case BookingStepId.SelectMedicalService:
        this.store.dispatch(
          setSummaryBooking({
            payload: {
              ...summary,
              services: null,
              physician: null,
              day: null,
              hour: null,
            },
          }),
        );
        break;
      case BookingStepId.PrescriptionUpload:
        this.store.dispatch(
          setSummaryBooking({
            payload: {
              ...summary,
              nre: null,
              day: null,
              hour: null,
            },
          }),
        );
        break;
      case BookingStepId.DelegaForms:
        this.store.dispatch(
          setSummaryBooking({
            payload: {
              ...summary,
              services: null,
              physician: null,
              day: null,
              hour: null,
            },
          }),
        );
        break;
      case BookingStepId.AvailableDays:
        this.store.dispatch(
          setSummaryBooking({
            payload: {
              ...summary,
              day: null,
              hour: null,
            },
          }),
        );
        break;

      case BookingStepId.AvailableAppointments:
        this.store.dispatch(
          setSummaryBooking({
            payload: {
              ...summary,
              hour: null,
            },
          }),
        );
        break;
      default:
        this.store.dispatch(
          setSummaryBooking({
            payload: {
              ...summary,
            },
          }),
        );
    }
    this.store.dispatch(setActiveStep({ step }));
  }

  backToBookingsList() {
    this.store
      .select(selectBookingHeroSummary)
      .pipe(
        take(1),
        tap((summary) => this.store.dispatch(restartLp({ sessionId: summary?.sessionId! }))),
      )
      .subscribe();

    this.router.navigate(['bookings-hero']);
  }
}

