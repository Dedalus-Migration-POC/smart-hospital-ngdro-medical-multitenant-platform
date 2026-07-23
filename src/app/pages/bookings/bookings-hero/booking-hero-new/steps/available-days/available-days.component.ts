import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { map } from 'rxjs';
import { SmartHospitalState } from 'src/app/store/reducers';
import {
  selectAvailableDays,
  selectBookingHeroSummary,
  selectHealthcareUnits,
} from '../../../state/selectors';
import {
  fetchAvailableAppointments,
  fetchAvailableDays,
  fetchAvailableDaysForRescheduleAppointment,
  fetchHealthcareUnits,
  setSummaryBooking,
} from '../../../state/actions';
import { AvailabilityFiltersComponent } from '../components/availability-filters/availability-filters.component';
import {
  AvailableDay,
  AvailableDaysPayload,
  HealthcareUnit,
  RescheduleAppointmentPayload,
  SummaryBookingHero,
} from '../../../state/model';
import { endOfDay, startOfDay } from 'date-fns';
import { SummaryCardComponent } from '../components/summary-card/summary-card.component';

@Component({
  selector: 'app-hero-available-days',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    DesignAngularKitModule,
    AvailabilityFiltersComponent,
    SummaryCardComponent,
  ],
  templateUrl: './available-days.component.html',
  styleUrls: ['./available-days.component.scss'],
})
export class AvailableDaysComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store<SmartHospitalState>);

  showFilters = false;
  filtersForm: FormGroup = this.fb.group({
    healthcareUnits: this.fb.control(null),
    date: this.fb.group({
      from: this.fb.control(null),
      to: this.fb.control(null),
    }),
  });
  readonly healthcareUnits = this.store.selectSignal(selectHealthcareUnits);
  readonly availableDays = this.store.selectSignal(selectAvailableDays);
  readonly bookingSummary = this.store.selectSignal(selectBookingHeroSummary);

  ngOnInit() {
    this.store.dispatch(fetchHealthcareUnits());
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  applyFilters() {
    let payload;
    const summary = this.bookingSummary();
    if (summary?.bookingType === 'nre' || summary?.bookingType === 'nre_delegate') {
      payload = {
        prescriptionId: summary?.prescriptionId!,
        unitId: this.filtersForm.value.healthcareUnits,
        sessionId: summary?.sessionId!,
        from: this.filtersForm.value.date.from,
        to: this.filtersForm.value.date.to,
      };
      this.store.dispatch(fetchAvailableDays({ payload }));
    }
    if (summary?.bookingType === 'free_prof' || summary?.bookingType === 'free_prof_delegate') {
      payload = {
        unitId: this.filtersForm.value.healthcareUnits,
        sessionId: summary?.sessionId!,
        from: this.filtersForm.value.date.from,
        to: this.filtersForm.value.date.to,
        physicianId: summary?.physician?.id,
        serviceIds: summary?.services
          ?.map((service) => service.id)
          .filter((id): id is string => !!id),
      };
      this.store.dispatch(fetchAvailableDays({ payload }));
    }
    if (summary?.bookingType === 'free_prof_to_move') {
      payload = {
        appointmentToMove: {
          id: summary.appointmentToMove!,
        },
        unitId: this.filtersForm.value.healthcareUnits,
        sessionId: summary?.sessionId!,
        from: this.filtersForm.value.date.from,
        to: this.filtersForm.value.date.to,
      };
      this.store.dispatch(fetchAvailableDaysForRescheduleAppointment({ payload }));
    }
    if (summary?.bookingType === 'nre_to_move') {
      payload = {
        appointmentToMove: {
          id: summary.appointmentToMove!,
        },
        prescriptionId: summary?.prescriptionId,
        unitId: this.filtersForm.value.healthcareUnits,
        sessionId: summary?.sessionId!,
        from: this.filtersForm.value.date.from,
        to: this.filtersForm.value.date.to,
      };
      this.store.dispatch(fetchAvailableDaysForRescheduleAppointment({ payload }));
    }
  }

  resetFilters() {
    this.filtersForm.reset();
  }

  onDaySelected(availableDay: AvailableDay) {
    const summary = this.bookingSummary();
    if (
      summary?.bookingType === 'nre' ||
      summary?.bookingType === 'free_prof' ||
      summary?.bookingType === 'free_prof_delegate' ||
      summary?.bookingType === 'nre_delegate'
    ) {
      this.bookingOnDaySelected(availableDay, summary);
    }
    if (summary?.bookingType === 'free_prof_to_move' || summary?.bookingType === 'nre_to_move') {
      this.rescheduleOnDaySelected(availableDay, summary);
    }
  }

  bookingOnDaySelected(availableDay: AvailableDay, summary: SummaryBookingHero) {
    let payload;

    if (summary?.bookingType === 'nre') {
      payload = {
        prescriptionId: summary?.prescriptionId!,
        unitId: [availableDay.hospitalId],
        sessionId: summary?.sessionId!,
        from: startOfDay(new Date(availableDay.date)).toISOString(),
        to: endOfDay(new Date(availableDay.date)).toISOString(),
      };
    } else {
      payload = {
        unitId: [availableDay.hospitalId],
        sessionId: summary?.sessionId!,
        physicianId: summary?.physician?.id,
        serviceIds: summary?.services
          ?.map((service) => service.id)
          .filter((id): id is string => !!id),
        from: startOfDay(new Date(availableDay.date)).toISOString(),
        to: endOfDay(new Date(availableDay.date)).toISOString(),
      };
    }
    if (summary?.bookingType === 'free_prof_delegate') {
      this.store.dispatch(fetchAvailableAppointments({ payload, useCheck: true }));
    } else {
      this.store.dispatch(fetchAvailableAppointments({ payload }));
    }
    this.store.dispatch(
      setSummaryBooking({
        payload: { ...summary, day: availableDay.date },
      }),
    );
  }

  rescheduleOnDaySelected(availableDay: AvailableDay, summary: SummaryBookingHero) {
    let payload;

    if (summary?.bookingType === 'nre_to_move') {
      payload = {
        sessionId: summary?.sessionId!,
        prescriptionId: summary?.prescriptionId!,
        appointmentToMove: { id: summary.appointmentToMove! },
        unitId: [availableDay.hospitalId],
        from: startOfDay(new Date(availableDay.date)).toISOString(),
        to: endOfDay(new Date(availableDay.date)).toISOString(),
      };
    } else {
      payload = {
        sessionId: summary?.sessionId!,
        appointmentToMove: { id: summary.appointmentToMove! },
        unitId: [availableDay.hospitalId],
        from: startOfDay(new Date(availableDay.date)).toISOString(),
        to: endOfDay(new Date(availableDay.date)).toISOString(),
      };
    }

    this.store.dispatch(fetchAvailableAppointments({ payload }));

    this.store.dispatch(
      setSummaryBooking({
        payload: { ...summary, day: availableDay.date },
      }),
    );
  }
}
