import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, Type } from '@angular/core';
import { Store } from '@ngrx/store';
import { SmartHospitalState } from 'src/app/store/reducers';
import { setActiveStep, setSummaryBooking } from '../state/actions';
import { selectActiveStep, selectGlobalLoadingNewBooking } from '../state/selectors';
import { BookingStep, BookingStepId } from '../state/model';
import { AvailableDaysComponent } from '../booking-hero-new/steps/available-days/available-days.component';
import { AvailableAppointmentsComponent } from '../booking-hero-new/steps/available-appointments/available-appointments.component';
import { ConfirmAppointmentComponent } from '../booking-hero-new/steps/confirm-appointment/confirm-appointment.component';
import { ConfirmedAppointmentComponent } from '../booking-hero-new/steps/confirmed-appointment/confirmed-appointment.component';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';

interface StepConfig {
  id: string;
  label: string;
  component: Type<any>;
}

@Component({
  selector: 'app-booking-hero-reschedule',
  standalone: true,
  imports: [CommonModule, TranslateModule, DesignAngularKitModule],
  templateUrl: './bookings-hero-reschedule.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingHeroRescheduleComponent implements OnInit, OnDestroy {
  private store = inject(Store<SmartHospitalState>);
  private router = inject(Router);
  readonly activeStepId = this.store.selectSignal(selectActiveStep);

  steps: StepConfig[] = [];

  readonly loading = this.store.selectSignal(selectGlobalLoadingNewBooking);

  ngOnInit() {
    this.steps = this.buildSteps();
    if (this.activeStepIndex < 0) {
      this.router.navigate(['bookings-hero']);
    }
  }

  setActiveStep(id: string) {
    this.store.dispatch(setActiveStep({ step: id }));
  }
  get activeStepIndex(): number {
    return this.steps.findIndex((step) => step.id === this.activeStepId());
  }

  ngOnDestroy(): void {
    this.store.dispatch(setActiveStep({ step: '' }));
    this.steps = [];
    this.store.dispatch(
      setSummaryBooking({
        payload: null,
      }),
    );
  }

  private buildSteps(): StepConfig[] {
    let steps: StepConfig[];

    steps = [
      {
        id: BookingStepId.AvailableDays,
        label: 'bookings-hero.booking-new.available-days.title',
        component: AvailableDaysComponent,
      },
      {
        id: BookingStepId.AvailableAppointments,
        label: 'bookings-hero.booking-new.available-appointments.title',
        component: AvailableAppointmentsComponent,
      },
      {
        id: BookingStepId.Confirmation,
        label: 'bookings-hero.booking-new.confirmation.title',
        component: ConfirmAppointmentComponent,
      },
      {
        id: BookingStepId.ConfirmedAppointment,
        label: 'bookings-hero.booking-new.confirmation.title',
        component: ConfirmedAppointmentComponent,
      },
    ];

    return steps;
  }
}
