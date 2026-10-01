import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  untracked,
} from '@angular/core';
import { formatDate, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { addDays, endOfDay, formatISO, startOfDay } from 'date-fns';

import { SmartHospitalState } from 'src/app/store/reducers';
import { selectSelectedStruttura } from 'src/app/pages/bookings/booking-a4h/state/struttura/struttura.selectors';
import { selectUserProfileData } from 'src/app/pages/user-profile/state/user-profile.selectors';
import {
  HealthcareUnit,
  MedicalService,
  PrescriptionServiceRequest,
  PrescriptionSubService,
} from '../state/model';
import { BookingUnifiedModalService } from '../booking-unified-modal.service';

import { BookingStepKey, BookingType, isBookingType, stepsFor } from '../models/booking-type';
import {
  addMedicalService,
  bookAppointment,
  findForAvailableDays,
  lockAppointment,
  releaseLockBookingSession,
  removeMedicalService,
  resetMedicalService,
  resetState,
  setActiveStep,
} from '../state/actions';
import {
  selectActiveStep,
  selectAppointmentToMove,
  selectAvailableListToBook,
  selectCheckAvailableDaysLoading,
  selectCheckAvailableDaysResponse,
  selectCreateSessionResponse,
  selectExpireOnLockAppointmentResponse,
  selectFindLoading,
  selectFindPrescriptionByNre,
  selectIsOptimized,
  selectLockAppointmentResponse,
  selectSelectedDoctor,
  selectSelectedMedicalService,
  selectServicesList,
} from '../state/selectors';
import { InsertNreStepComponent } from '../steps/insert-nre-step/insert-nre-step.component';
import { SelectDoctorStepComponent } from '../steps/select-doctor-step/select-doctor-step.component';
import { SelectMedicalServiceStepComponent } from '../steps/select-medical-service-step/select-medical-service-step.component';
import { SelectServiceStepComponent } from '../steps/select-service-step/select-service-step.component';
import { DateTimeStepComponent } from '../steps/date-time-step/date-time-step.component';
import { ReviewStepComponent } from '../steps/review-step/review-step.component';
import { CountdownTimerComponent } from 'src/app/components/countdown-timer/countdown-timer.component';
import { BookingResumeService } from '../booking-resume.service';
import { moveAppointment } from '../appointments/state/actions';

/** Translation key for the page title of each step, independent of its numeric index. */
const STEP_TITLE_KEY: Record<BookingStepKey, string> = {
  [BookingStepKey.InsertNre]: 'bookingWithSsnTitle',
  [BookingStepKey.SelectService]: 'selectServiceTitle',
  [BookingStepKey.SelectMedicalService]: 'stepTitleSelectService',
  [BookingStepKey.SelectDoctor]: 'stepTitleSelectDoctor',
  [BookingStepKey.DateTime]: 'stepTitleSelectDateTime',
  [BookingStepKey.Review]: 'stepTitleReviewAndConfirm',
};

/** Translation key for the it-steppers-item label of each step. */
const STEP_LABEL_KEY: Record<BookingStepKey, string> = {
  [BookingStepKey.InsertNre]: 'insertNre',
  [BookingStepKey.SelectService]: 'selectService',
  [BookingStepKey.SelectMedicalService]: 'selectService',
  [BookingStepKey.SelectDoctor]: 'selectDoctor',
  [BookingStepKey.DateTime]: 'selectDateAndTime',
  [BookingStepKey.Review]: 'appointmentSummary',
};

/**
 * Single stepper reused by every booking flow. Which `it-steppers-item`s are
 * rendered - and in which order - is fully driven by `BOOKING_FLOW_STEPS`
 * (see models/booking-type.ts); this replaces the four near-identical
 * `booking-stepper` components that used to exist per flow.
 */
@Component({
  selector: 'app-booking-stepper',
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    DesignAngularKitModule,
    TitleCasePipe,
    UpperCasePipe,
    InsertNreStepComponent,
    SelectServiceStepComponent,
    SelectMedicalServiceStepComponent,
    SelectDoctorStepComponent,
    DateTimeStepComponent,
    ReviewStepComponent,
    CountdownTimerComponent,
  ],
  templateUrl: './booking-stepper.component.html',
  styleUrls: ['./booking-stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingStepperComponent implements OnInit {
  readonly BookingStepKey = BookingStepKey;

  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly translate = inject(TranslateService);
  private readonly modalService = inject(BookingUnifiedModalService);
  private readonly bookingResumeService = inject(BookingResumeService);

  protected bookingType: BookingType | null = null;
  protected steps: BookingStepKey[] = [];
  protected readonly activeStep = this.store.selectSignal(selectActiveStep);
  private readonly sessionId = signal<string | undefined>(undefined);
  protected readonly selectedServiceName = signal<
    { id: string; name?: string; hash?: string } | undefined
  >(undefined);
  private selectedUnitId: string | undefined;
  private selectedDoctorId: string | undefined;

  private readonly selectedStrutturaState = this.store.selectSignal(selectSelectedStruttura);
  private readonly appointmentToMove = this.store.selectSignal(selectAppointmentToMove);
  protected readonly selectedStruttura = computed<HealthcareUnit | null>(() => {
    // Nello spostamento la struttura è quella dell'appuntamento, non quella scelta per le nuove prenotazioni.
    const toMove = this.appointmentToMove();
    if (toMove) {
      const { id, name, address } = toMove.location;
      return { id: id ?? '', name, address: address ?? undefined };
    }
    return this.selectedStrutturaState() as HealthcareUnit | null;
  });
  private readonly selectedDoctor = this.store.selectSignal(selectSelectedDoctor);
  protected readonly availableDays = this.store.selectSignal(selectCheckAvailableDaysResponse);
  private readonly findLoading = this.store.selectSignal(selectFindLoading);
  private readonly checkAvailableDaysLoading = this.store.selectSignal(
    selectCheckAvailableDaysLoading,
  );
  protected readonly availableDaysLoading = computed(
    () => this.findLoading() || this.checkAvailableDaysLoading(),
  );
  protected readonly isOptimized = this.store.selectSignal(selectIsOptimized);
  protected readonly expireOn = this.store.selectSignal(selectExpireOnLockAppointmentResponse);
  protected readonly selectedMedicalServicesId = this.store.selectSignal(
    selectSelectedMedicalService,
  );
  private readonly servicesList = this.store.selectSignal(selectServicesList);
  private readonly prescriptionSession = this.store.selectSignal(selectFindPrescriptionByNre);
  private readonly createSessionResponse = this.store.selectSignal(selectCreateSessionResponse);
  private readonly lockAppointmentResponse = this.store.selectSignal(selectLockAppointmentResponse);
  private readonly availableListToBookState = this.store.selectSignal(selectAvailableListToBook);
  private readonly userProfile = this.store.selectSignal(selectUserProfileData);

  rangeDate = new FormGroup({
    start: new FormControl<string | null>(formatISO(new Date()).substring(0, 10)),
    end: new FormControl<string | null>(formatISO(addDays(new Date(), 60)).substring(0, 10)),
  });

  /** Nel flusso SSN le prestazioni arrivano dalla ricetta, negli altri dalla lista servizi. */
  protected readonly serviceCatalog = computed(() => [
    ...this.servicesList().map((s) => ({ id: s.id, name: s.name })),
    ...(this.prescriptionSession()?.prescription.serviceRequestList ?? [])
      .map((req: PrescriptionServiceRequest) => req.service.subServices)
      .flat()
      .map((s: PrescriptionSubService) => ({ id: s.id, name: s.name })),
  ]);

  protected readonly selectedMedicalServicesList = computed(() =>
    this.serviceCatalog().filter((service) =>
      this.selectedMedicalServicesId().includes(service.id),
    ),
  );

  protected readonly bookingSummary = computed(() => this.lockAppointmentResponse()?.appointment);

  protected readonly availableListToBook = computed(() => {
    const services = this.serviceCatalog();
    const availableListToBook = this.availableListToBookState();
    if (!availableListToBook) return undefined;
    return availableListToBook.map((el: any) => ({
      ...services.find((av: any) => el.id === av.id),
      id: el.id,
      status: el.status,
      hash: el.hash,
    }));
  });

  constructor() {
    effect(() => {
      this.selectedUnitId = this.selectedStruttura()?.id;
      this.selectedDoctorId = this.selectedDoctor()?.id;
    });

    effect(() => {
      const response = this.createSessionResponse();
      if (response?.sessionId) {
        this.sessionId.set(response.sessionId);
        localStorage.setItem('bookingSessionId', response.sessionId);
      }
    });

    effect(() => {
      const response = this.prescriptionSession();
      if (response?.sessionId) {
        this.sessionId.set(response.sessionId);
        localStorage.setItem('bookingSessionId', response.sessionId);
      }
    });

    effect(() => {
      const availableListToBook = this.availableListToBookState();
      if (!availableListToBook?.length) return;

      const availableToBook = availableListToBook.find((el: any) => el.status === 'TO_BOOK');
      const sessionId = this.sessionId();
      if (availableToBook && sessionId) {
        untracked(() => {
          this.store.dispatch(resetMedicalService());
          this.store.dispatch(addMedicalService({ id: availableToBook.id }));
          this.store.dispatch(
            findForAvailableDays({
              payload: {
                sessionId,
                from: startOfDay(new Date(this.rangeDate.getRawValue().start ?? Date.now())),
                to: endOfDay(new Date(this.rangeDate.getRawValue().end ?? Date.now())),
                serviceIds: [availableToBook.id],
                unitId: this.selectedUnitId ? [this.selectedUnitId] : undefined,
                physicianId: this.selectedDoctorId,
              },
            }),
          );
          this.selectedServiceName.set({
            ...this.serviceCatalog().find((s) => s.id === availableToBook.id),
            id: availableToBook.id,
            hash: availableToBook.hash,
          });
        });
      } else if (this.bookingType) {
        this.router.navigate(['booking-a4h', this.bookingType, 'confirmed-booking']);
      }
    });
  }

  pageTitle(): string {
    const key = STEP_TITLE_KEY[this.steps[this.activeStep()]];
    return key ? this.translate.instant('booking-a4h.' + key) : '';
  }

  stepLabel(step: BookingStepKey): string {
    const key = STEP_LABEL_KEY[step];
    return key ? this.translate.instant('booking-a4h.stepsTitle.' + key) : '';
  }

  ngOnInit(): void {
    const bookingTypeParam =
      this.activatedRoute.parent?.snapshot.paramMap.get('bookingType') ?? null;
    const routeBookingType = this.activatedRoute.snapshot.data['bookingType'] as
      | BookingType
      | undefined;
    this.bookingType = isBookingType(bookingTypeParam)
      ? bookingTypeParam
      : (routeBookingType ?? null);
    this.steps = stepsFor(this.bookingType);

    this.sessionId.set(localStorage.getItem('bookingSessionId') ?? undefined);
  }

  private get isEditMode(): boolean {
    return this.bookingType === BookingType.EditAppointment;
  }

  private exitEdit(): void {
    const id = this.appointmentToMove()?.id;
    this.store.dispatch(resetState());
    this.router.navigate(
      id ? ['booking-a4h', 'appointments', 'details', id] : ['booking-a4h', 'appointments'],
      { replaceUrl: true },
    );
  }

  applyFilter(range: { start: string | null; end: string | null } = this.rangeDate.getRawValue()) {
    this.store.dispatch(
      findForAvailableDays({
        payload: {
          sessionId: this.sessionId()!,
          from: startOfDay(new Date(range.start ?? Date.now())),
          to: endOfDay(new Date(range.end ?? Date.now())),
          serviceIds: this.selectedMedicalServicesId(),
          unitId: this.selectedUnitId ? [this.selectedUnitId] : undefined,
          physicianId: this.selectedDoctorId,
        },
      }),
    );
  }

  onAppointmentClick(id: string) {
    this.store.dispatch(
      lockAppointment({
        payload: { sessionId: this.sessionId()!, appointmentId: id },
      }),
    );
  }

  onServiceDelete(serv: MedicalService) {
    const input = document.getElementById('selected-service' + serv.id) as HTMLInputElement;
    this.store.dispatch(removeMedicalService({ id: serv.id }));
    input?.click();
  }

  onExpiration() {
    this.modalService.openInfo('Info', 'expiration-session-message', undefined, () => {
      if (this.isEditMode) {
        this.exitEdit();
        return;
      }
      this.router.navigate(['booking']);
      this.store.dispatch(resetState());
    });
  }

  onBackClick() {
    if (this.activeStep() > 0) {
      if (this.steps[this.activeStep()] === BookingStepKey.Review) {
        this.store.dispatch(
          releaseLockBookingSession({
            payload: {
              sessionId: this.sessionId()!,
              appointmentId: this.bookingSummary()?.id,
            },
          }),
        );
      }
      this.store.dispatch(setActiveStep({ step: this.activeStep() - 1 }));
    } else if (this.isEditMode) {
      this.exitEdit();
    } else {
      this.router.navigate(['booking-a4h']);
    }
  }

  onSubmit() {
    if (this.isEditMode) {
      this.confirmMove();
      return;
    }

    const user = this.userProfile();
    if (!user) {
      if (!this.bookingType) {
        this.router.navigate(['/']);
        return;
      }

      this.bookingResumeService.save(this.router.url, this.bookingType);
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url },
      });
      return;
    }

    this.store.dispatch(bookAppointment({ payload: { sessionId: this.sessionId()! } }));
  }

  private confirmMove() {
    const summary = this.bookingSummary();
    if (!summary) return;

    // gli slot arrivano in GMT, come nelle altre visualizzazioni dello stepper
    this.modalService.openConfirm({
      titleKey: 'appointments.edit-appointment-popup.title',
      bodyKey: 'appointments.edit-appointment-popup.text',
      bodyParams: {
        date: formatDate(summary.dateTime, 'dd/MM/yyyy', 'en-US', 'GMT'),
        time: formatDate(summary.dateTime, 'HH:mm', 'en-US', 'GMT'),
      },
      cancelKey: 'commons.no',
      confirmKey: 'commons.yes',
      onConfirm: () =>
        this.store.dispatch(
          moveAppointment({
            payload: { sessionId: this.sessionId()!, newAppointmentId: summary.id },
          }),
        ),
    });
  }

  onCancel() {
    this.store.dispatch(
      releaseLockBookingSession({
        payload: {
          sessionId: this.sessionId()!,
          appointmentId: this.bookingSummary()?.id,
        },
      }),
    );
    if (this.isEditMode) {
      this.exitEdit();
      return;
    }
    this.store.dispatch(resetState());
    this.router.navigate(['booking-a4h']);
  }
}
