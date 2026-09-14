import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  Type,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrescriptionUploadComponent } from './steps/prescription-upload/prescription-upload.component';
import { MissingDataComponent } from './steps/missing-data/missing-data.component';
import { AvailableDaysComponent } from './steps/available-days/available-days.component';
import { AvailableAppointmentsComponent } from './steps/available-appointments/available-appointments.component';
import { Store } from '@ngrx/store';
import { SmartHospitalState } from 'src/app/store/reducers';
import { setActiveStep, setSummaryBooking } from '../state/actions';
import { ConfirmAppointmentComponent } from './steps/confirm-appointment/confirm-appointment.component';
import {
  selectActiveStep,
  selectBookingHeroSummary,
  selectGlobalLoadingNewBooking,
} from '../state/selectors';
import { distinctUntilChanged, map, take } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { SelectMedicalServiceComponent } from './steps/select-medical-service/select-medical-service.component';
import { BookingStep, BookingStepId } from '../state/model';
import { BookingTypeComponent } from './steps/booking-type/booking-type.component';
import { DelegaTypeAndSelfDeclarationComponent } from './steps/delega-type-and-self-declaration/delega-type-and-self-declaration.component';
import { DelegaFormsComponent } from './steps/delega-forms/delega-forms.component';
import { ConfirmedAppointmentComponent } from './steps/confirmed-appointment/confirmed-appointment.component';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { PageConfigService } from 'src/app/pages/page-config.service';
import { Spinner } from 'src/app/components/spinner/spinner';
import { Breadcrumb } from 'src/app/components/breadcrumb/breadcrumb';

interface StepConfig {
  id: string;
  label: string;
  component: Type<any>;
}

@Component({
  selector: 'app-booking-hero-new',
  standalone: true,
  imports: [CommonModule, TranslateModule, DesignAngularKitModule, Spinner, Breadcrumb],
  templateUrl: './bookings-hero-new.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingHeroNewComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly pageConfigService = inject(PageConfigService);

  readonly pageConfig = toSignal(this.pageConfigService.get('/bookings-hero/new'), {
    initialValue: null,
  });

  steps: StepConfig[] = [];

  readonly activeStepId = this.store.selectSignal(selectActiveStep);
  readonly loading = this.store.selectSignal(selectGlobalLoadingNewBooking);

  ngOnInit() {
    this.store
      .select(selectBookingHeroSummary)
      .pipe(
        map((summary) => summary?.bookingType),
        distinctUntilChanged(),
        map((bookingType) => {
          switch (bookingType) {
            case 'nre':
              return this.bookingNreSteps;

            case 'free_prof':
              return this.bookingFreeProfSteps;

            case 'nre_delegate':
              return this.bookingNreDelegateSteps;

            case 'free_prof_delegate':
              return this.bookingFreeProfDelegateSteps;

            default:
              return this.bookingNreSteps;
          }
        }),
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((steps) => {
        this.steps = steps;
      });
  }

  setActiveStep(id: string) {
    this.store.dispatch(setActiveStep({ step: id }));
  }
  get activeStepIndex(): number {
    return this.steps.findIndex((step) => step.id === this.activeStepId());
  }

  ngOnDestroy(): void {
    this.store.dispatch(setActiveStep({ step: BookingStepId.SelectBookingType }));
    this.steps = [];
    this.store.dispatch(
      setSummaryBooking({
        payload: null,
      }),
    );
  }

  bookingNreSteps: BookingStep[] = [
    {
      id: BookingStepId.SelectBookingType,
      label: 'bookings-hero.booking-new.bookingType.title',
      component: BookingTypeComponent,
    },
    {
      id: BookingStepId.PrescriptionUpload,
      label: 'bookings-hero.booking-new.prescription-upload.title',
      component: PrescriptionUploadComponent,
    },
    {
      id: BookingStepId.MissingData,
      label: 'bookings-hero.booking-new.missing-data.title',
      component: MissingDataComponent,
    },
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

  bookingFreeProfSteps: BookingStep[] = [
    {
      id: BookingStepId.SelectBookingType,
      label: 'bookings-hero.booking-new.bookingType.title',
      component: BookingTypeComponent,
    },
    {
      id: BookingStepId.SelectMedicalService,
      label: 'bookings-hero.booking-new.select-medicalservice.title',
      component: SelectMedicalServiceComponent,
    },

    {
      id: BookingStepId.MissingData,
      label: 'bookings-hero.booking-new.missing-data.title',
      component: MissingDataComponent,
    },
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

  bookingFreeProfDelegateSteps: BookingStep[] = [
    {
      id: BookingStepId.SelectBookingType,
      label: 'bookings-hero.booking-new.bookingType.title',
      component: BookingTypeComponent,
    },
    {
      id: BookingStepId.Delega,
      label: 'bookings-hero.booking-new.delega.title',
      component: DelegaTypeAndSelfDeclarationComponent,
    },
    {
      id: BookingStepId.DelegaForms,
      label: 'bookings-hero.booking-new.delega.title',
      component: DelegaFormsComponent,
    },
    {
      id: BookingStepId.SelectMedicalService,
      label: 'bookings-hero.booking-new.select-medicalservice.title',
      component: SelectMedicalServiceComponent,
    },

    {
      id: BookingStepId.MissingData,
      label: 'bookings-hero.booking-new.missing-data.title',
      component: MissingDataComponent,
    },
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

  bookingNreDelegateSteps: BookingStep[] = [
    {
      id: BookingStepId.SelectBookingType,
      label: 'bookings-hero.booking-new.bookingType.title',
      component: BookingTypeComponent,
    },
    {
      id: BookingStepId.Delega,
      label: 'bookings-hero.booking-new.delega.title',
      component: DelegaTypeAndSelfDeclarationComponent,
    },
    {
      id: BookingStepId.PrescriptionUpload,
      label: 'bookings-hero.booking-new.prescription-upload.title',
      component: PrescriptionUploadComponent,
    },
    {
      id: BookingStepId.DelegaForms,
      label: 'bookings-hero.booking-new.delega.title',
      component: DelegaFormsComponent,
    },
    {
      id: BookingStepId.MissingData,
      label: 'bookings-hero.booking-new.missing-data.title',
      component: MissingDataComponent,
    },
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
}
