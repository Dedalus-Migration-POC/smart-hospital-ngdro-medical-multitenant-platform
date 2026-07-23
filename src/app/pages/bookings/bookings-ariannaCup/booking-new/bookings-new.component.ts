import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, Type } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { BookingTypeComponent } from './steps/pages/booking-type/booking-type.component';
import { PrescriptionUploadComponent } from './steps/pages/prescription-upload/prescription-upload.component';
import { BookingAvailabilityComponent } from './steps/pages/booking-availability/booking-availability.component';
import { ConfirmationComponent } from './steps/pages/confirmation/confirmation.component';
import { SessionStorageKey, SessionStorageUtils } from 'src/app/utility/session-storage-utils';
import { PrivateBookingListComponent } from './steps/pages/private-booking-list/private-booking-list.component';
import { PrivateBookingAvailabilityComponent } from './steps/pages/private-booking-availability/private-booking-availability.component';
import { PrivateDoctorSelectorComponent } from './steps/pages/private-doctor-selector/private-doctor-selector.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { SmartHospitalState } from 'src/app/store/reducers';
import { selectAppConfig } from 'src/app/initialize/state/selector';
import { map, take } from 'rxjs';
import { Breadcrumb } from 'src/app/components/breadcrumb/breadcrumb';

interface StepConfig {
  id: string;
  label: string;
  component: Type<any>;
}

@Component({
  selector: 'app-booking-new',
  standalone: true,
  imports: [CommonModule, TranslateModule, DesignAngularKitModule, Breadcrumb],
  templateUrl: './bookings-new.component.html',
})
export class BookingNewComponent implements OnInit, OnDestroy {
  constructor() {}
  private readonly store = inject(Store<SmartHospitalState>);

  activeStepIndex = 0;
  steps: StepConfig[] = [];
  readonly pageConfig = toSignal(
    this.store.select(selectAppConfig).pipe(
      take(1),
      map((config) => config.pages.find((page: any) => page.id === '/bookings/new')),
    ),
    { initialValue: null },
  );

  ngOnInit() {
    this.steps = this.buildSteps();

    // returns to the stored state if is a refresh page
    const currentStep = SessionStorageUtils.getItem(SessionStorageKey.bookingStep);
    if (currentStep) {
      const stored = JSON.parse(currentStep);
      this.activeStepIndex = stored.step;
    }
  }

  setActiveStep(index: number) {
    this.activeStepIndex = index;

    // store the step to maintain the status after the refresh
    const step = { step: index };
    SessionStorageUtils.setItem(SessionStorageKey.bookingStep, JSON.stringify(step));
  }

  ngOnDestroy(): void {
    // clear
    SessionStorageUtils.removeItem(SessionStorageKey.nre);
    SessionStorageUtils.removeItem(SessionStorageKey.bookingStep);
    SessionStorageUtils.removeItem(SessionStorageKey.availability);
    SessionStorageUtils.removeItem(SessionStorageKey.bookingType);
    SessionStorageUtils.removeItem(SessionStorageKey.privateBooking);
    SessionStorageUtils.removeItem(SessionStorageKey.privateDoctor);
  }

  private buildSteps(): StepConfig[] {
    let steps: StepConfig[];

    steps = [
      // step for SSN
      {
        id: 'bookingType',
        label: 'bookings.booking-new.ssn.title',
        component: BookingTypeComponent,
      },
      {
        id: 'prescriptionUpload',
        label: 'bookings.booking-new.prescription-upload.title',
        component: PrescriptionUploadComponent,
      },
      {
        id: 'availability',
        label: 'bookings.booking-new.availability.title',
        component: BookingAvailabilityComponent,
      },
      {
        id: 'confirmation',
        label: 'bookings.booking-new.confirmation.title',
        component: ConfirmationComponent,
      },
      // step for private professional
      {
        id: 'privateBookingList',
        label: 'bookings.booking-new.private-booking-list.title',
        component: PrivateBookingListComponent,
      },
      {
        id: 'privateDoctorSelector',
        label: 'bookings.booking-new.private-doctor-selector.title',
        component: PrivateDoctorSelectorComponent,
      },
      {
        id: 'privateBookingAvailability',
        label: 'bookings.booking-new.private-booking-availability.title',
        component: PrivateBookingAvailabilityComponent,
      },
    ];

    return steps;
  }
}
