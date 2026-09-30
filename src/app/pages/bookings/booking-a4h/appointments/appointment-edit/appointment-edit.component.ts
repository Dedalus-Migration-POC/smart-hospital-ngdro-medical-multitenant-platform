import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
  untracked,
  ViewContainerRef,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Breadcrumb } from 'src/app/components/breadcrumb/breadcrumb';
import { Spinner } from 'src/app/components/spinner/spinner';
import { PageConfigService } from 'src/app/pages/page-config.service';
import { SmartHospitalState } from 'src/app/store/reducers';
import { BookingStepperComponent } from '../../booking-stepper/booking-stepper.component';
import { BookingUnifiedModalService } from '../../booking-unified-modal.service';
import { resetState, startAppointmentEdit } from '../../state/actions';
import { selectAnyLoading, selectServicesListLoading } from '../../state/selectors';
import { isEditableOrCancellable } from '../appointment.utils';
import { fetchAppointments } from '../state/actions';
import {
  selectAppointments,
  selectAppointmentsError,
  selectAppointmentsLoaded,
  selectAppointmentsLoading,
  selectCheckInHours,
  selectMovingAppointment,
} from '../state/selectors';

/**
 * Host dello spostamento appuntamento: prepara lo stato di booking-a4h in modalità
 * EditAppointment e riusa lo stesso stepper (step data/ora + riepilogo) delle nuove prenotazioni.
 */
@Component({
  selector: 'app-appointment-edit',
  imports: [Breadcrumb, Spinner, BookingStepperComponent],
  template: `
    @if (pageConfig()?.breadcrumb; as breadcrumb) {
      <app-breadcrumb [config]="breadcrumb"></app-breadcrumb>
    }

    @if (started()) {
      <app-booking-stepper></app-booking-stepper>
    }

    @if (loading()) {
      <app-spinner
        [fullScreen]="true"
        text="Loading"
        [className]="'flex-column gap-3 text-secondary'"
      ></app-spinner>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentEditComponent {
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly pageConfigService = inject(PageConfigService);
  private readonly modalService = inject(BookingUnifiedModalService);

  readonly pageConfig = toSignal(this.pageConfigService.get('/booking-a4h/appointments/edit'), {
    initialValue: null,
  });

  private readonly appointmentId = this.activatedRoute.snapshot.paramMap.get('id');
  private readonly appointments = this.store.selectSignal(selectAppointments);
  private readonly loaded = this.store.selectSignal(selectAppointmentsLoaded);
  private readonly fetchingAppointments = this.store.selectSignal(selectAppointmentsLoading);
  private readonly fetchError = this.store.selectSignal(selectAppointmentsError);
  private readonly checkInHours = this.store.selectSignal(selectCheckInHours);
  private readonly bookingLoading = this.store.selectSignal(selectAnyLoading);
  private readonly servicesListLoading = this.store.selectSignal(selectServicesListLoading);
  private readonly moving = this.store.selectSignal(selectMovingAppointment);

  protected readonly started = signal(false);
  protected readonly loading = computed(
    () =>
      this.fetchingAppointments() ||
      this.bookingLoading() ||
      this.servicesListLoading() ||
      this.moving(),
  );

  constructor() {
    const viewContainerRef = inject(ViewContainerRef);
    this.modalService.register(viewContainerRef);
    const destroyRef = inject(DestroyRef);
    destroyRef.onDestroy(() => {
      this.modalService.clear(viewContainerRef);
      this.store.dispatch(resetState());
    });

    // accesso diretto/refresh: serve la lista per ricostruire l'appuntamento da spostare
    if (!this.loaded() && !this.fetchingAppointments()) {
      this.store.dispatch(fetchAppointments());
    }

    effect(() => {
      if (this.fetchError()) {
        untracked(() => this.goToDetails());
        return;
      }
      if (!this.loaded() || this.started()) return;

      const appointment = this.appointments().find((a) => a.id === this.appointmentId);
      untracked(() => {
        if (!appointment || !isEditableOrCancellable(appointment, this.checkInHours())) {
          this.goToDetails();
          return;
        }

        this.started.set(true);
        this.store.dispatch(
          startAppointmentEdit({
            appointment: {
              id: appointment.id,
              serviceIds: appointment.serviceIds ?? [],
              contract: appointment.contract,
              location: {
                id: appointment.location.id,
                name: appointment.location.name,
                address: appointment.location.address,
              },
            },
          }),
        );
      });
    });
  }

  private goToDetails(): void {
    this.router.navigate(
      this.appointmentId
        ? ['booking-a4h', 'appointments', 'details', this.appointmentId]
        : ['booking-a4h', 'appointments'],
      { replaceUrl: true },
    );
  }
}
