import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, effect, inject, input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SmartHospitalState } from 'src/app/store/reducers';
import { Store } from '@ngrx/store';
import {
  selectUserPhoneNumber,
  selectUserProfile,
} from 'src/app/pages/user-profile/state/user-profile.selectors';
import { ActivatedRoute, Router } from '@angular/router';
import { SummaryComponent } from '../../components/summary/summary.component';
import {
  selectAvailability,
  selectBookingType,
  selectReserve,
} from 'src/app/pages/bookings-ariannaCup/state/selectors';
import { Subject, takeUntil } from 'rxjs';
import {
  reserve,
  reserveHttp500,
  reserveSuccess,
  resetStepNewBooking,
} from 'src/app/pages/bookings-ariannaCup/state/actions';
import { SessionStorageKey, SessionStorageUtils } from 'src/app/utility/session-storage-utils';
import {
  BookingRequest,
  PrivateBookingRequest,
} from 'src/app/pages/bookings-ariannaCup/state/model';
import { Actions, ofType } from '@ngrx/effects';
import { PRIVATE_BOOKING_AVAILABILITY_REQUEST } from 'src/app/pages/bookings-ariannaCup/state/constants';
import { DesignAngularKitModule } from 'design-angular-kit';
import { Spinner } from 'src/app/components/spinner/spinner';
import { InputComponent } from 'src/app/components/input/input.component';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    SummaryComponent,
    DesignAngularKitModule,
    Spinner,
    InputComponent,
  ],
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store<SmartHospitalState>);

  readonly setActiveStep = input.required<(stepIndex: number) => void>();
  readonly activeStepIndex = input.required<number>();

  availability = this.store.selectSignal(selectAvailability);
  selectReserve = this.store.selectSignal(selectReserve);
  phoneNumber = this.store.selectSignal(selectUserPhoneNumber);
  private readonly bookingTypeState = this.store.selectSignal(selectBookingType);
  bookingType = computed(
    () => this.bookingTypeState() ?? this.readSessionItem(SessionStorageKey.bookingType),
  );

  private readonly destroy$ = new Subject<void>();
  private readonly userProfile = this.store.selectSignal(selectUserProfile);

  form!: FormGroup;
  isSSNBooking = computed(() => this.bookingType()?.id === '1');

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private actions$: Actions,
  ) {
    effect(() => {
      const user = this.userProfile();
      if (!user || !this.form) {
        return;
      }

      this.form.patchValue({
        name: user.data?.firstName,
        surname: user.data?.lastName,
        email: user.data?.email,
        phone: user.data?.additionalAttributes[4].value,
      });
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [{ value: '', disabled: true }],
      surname: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      phone: [{ value: '', disabled: true }],
    });

    this.actions$.pipe(ofType(reserveSuccess), takeUntil(this.destroy$)).subscribe(() => {
      this.resetSessionStorage();
    });
    this.actions$.pipe(ofType(reserveHttp500), takeUntil(this.destroy$)).subscribe(() => {
      const title = this.translateService.instant(
        'bookings.booking-new.confirmation.error-500.title',
      );
      const body = this.translateService.instant(
        'bookings.booking-new.confirmation.error-500.body',
      );
      window.alert(`${title}\n\n${body}`);
      this.goBookingList();
    });
  }

  confirmBooking() {
    const title = this.translateService.instant('bookings.booking-new.confirmation.modal.title');
    const body = this.translateService.instant('bookings.booking-new.confirmation.modal.body');
    if (window.confirm(`${title}\n\n${body}`)) {
      this.confirmBookingModal();
    }
  }

  // setStep(step: number) {
  //   this.setActiveStep(step)
  // }

  goBookingList() {
    this.resetSessionStorage();
    this.store.dispatch(resetStepNewBooking());

    this.router.navigate(['/bookings'], { relativeTo: this.activatedRoute });
  }

  goPayment() {
    this.resetSessionStorage();
    this.store.dispatch(resetStepNewBooking());

    this.router.navigate(['/payments-jc'], { relativeTo: this.activatedRoute });
  }

  confirmBookingModal() {
    if (this.isSSNBooking()) {
      this.confirmSSNBooking();
    } else {
      this.confirmPrivateBooking();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private confirmSSNBooking() {
    const choice = this.availability();
    if (choice) {
      const nreSession = SessionStorageUtils.getItem(SessionStorageKey.nre);
      if (nreSession) {
        const nreStored = JSON.parse(nreSession);
        const nre = typeof nreStored === 'string' ? nreStored : (nreStored?.nre ?? '');

        if (nre) {
          const telefonoIntestatario = this.phoneNumber();
          const request: BookingRequest = {
            telefonoIntestatario: telefonoIntestatario || '',
            numImpegnativa: nre,
            schedule: choice.schedule,
            hl7Messages: choice.hl7Messages,
          };

          this.store.dispatch(reserve({ request }));
        }
      }
    }
  }

  private confirmPrivateBooking() {
    const choice = this.availability();
    if (choice) {
      const telefonoIntestatario = this.phoneNumber();
      const request: PrivateBookingRequest = {
        telefonoIntestatario: telefonoIntestatario || '',
        schedule: choice.schedule,
        hl7Messages: choice.hl7Messages,
        regimeErogazione: PRIVATE_BOOKING_AVAILABILITY_REQUEST.regimeErogazione,
        maxResults: PRIVATE_BOOKING_AVAILABILITY_REQUEST.maxResults,
        ais11: PRIVATE_BOOKING_AVAILABILITY_REQUEST.ais11,
      };

      this.store.dispatch(reserve({ request }));
    }
  }

  private resetSessionStorage() {
    SessionStorageUtils.removeItem(SessionStorageKey.nre);
    SessionStorageUtils.removeItem(SessionStorageKey.bookingStep);
    SessionStorageUtils.removeItem(SessionStorageKey.availability);
    SessionStorageUtils.removeItem(SessionStorageKey.bookingType);
    SessionStorageUtils.removeItem(SessionStorageKey.privateBooking);
  }

  private readSessionItem(key: SessionStorageKey): any {
    const raw = SessionStorageUtils.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }
}
