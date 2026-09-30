import { UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { format, parseISO } from 'date-fns';
import { map } from 'rxjs';
import { Breadcrumb } from 'src/app/components/breadcrumb/breadcrumb';
import { BreadcrumbService } from 'src/app/components/breadcrumb/breadcrumb.service';
import { ImageBlock } from 'src/app/components/image-block/image-block';
import { Spinner } from 'src/app/components/spinner/spinner';
import { PageConfigService } from 'src/app/pages/page-config.service';
import { SmartHospitalState } from 'src/app/store/reducers';
import { BookingUnifiedModalService } from '../../booking-unified-modal.service';
import { AppointmentActionsService } from '../appointment-actions.service';
import { appointmentAddress, canCheckIn, isEditableOrCancellable } from '../appointment.utils';
import { CheckinHintComponent } from '../checkin-hint/checkin-hint.component';
import { fetchAppointments } from '../state/actions';
import {
  selectAppointments,
  selectAppointmentsBusy,
  selectAppointmentsError,
  selectAppointmentsLoaded,
  selectAppointmentsLoading,
  selectCheckInHours,
  selectDeletingAppointment,
  selectRequestingCheckIn,
} from '../state/selectors';

interface DetailRow {
  icon: string;
  labelKey: string;
  value: string;
}

@Component({
  selector: 'app-appointment-details',
  imports: [
    TranslateModule,
    UpperCasePipe,
    RouterLink,
    Breadcrumb,
    ImageBlock,
    Spinner,
    CheckinHintComponent,
  ],
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentDetailsComponent implements OnInit {
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly pageConfigService = inject(PageConfigService);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly modalService = inject(BookingUnifiedModalService);
  protected readonly actions = inject(AppointmentActionsService);

  readonly pageConfig = toSignal(this.pageConfigService.get('/booking-a4h/appointments/details'), {
    initialValue: null,
  });

  private readonly appointmentId = toSignal(
    this.activatedRoute.paramMap.pipe(map((params) => params.get('id'))),
    { initialValue: null },
  );

  private readonly appointments = this.store.selectSignal(selectAppointments);
  private readonly loaded = this.store.selectSignal(selectAppointmentsLoaded);
  private readonly fetching = this.store.selectSignal(selectAppointmentsLoading);
  private readonly checkInHours = this.store.selectSignal(selectCheckInHours);
  protected readonly error = this.store.selectSignal(selectAppointmentsError);
  protected readonly deleting = this.store.selectSignal(selectDeletingAppointment);
  protected readonly requestingCheckIn = this.store.selectSignal(selectRequestingCheckIn);
  protected readonly busy = this.store.selectSignal(selectAppointmentsBusy);
  protected readonly loading = computed(() => this.fetching() || this.requestingCheckIn());

  protected readonly appointment = computed(
    () => this.appointments().find((a) => a.id === this.appointmentId()) ?? null,
  );

  protected readonly isPaid = computed(() => this.appointment()?.paymentStatus === 'PAID');
  protected readonly isDone = computed(() => this.appointment()?.checkInStatus === 'DONE');

  protected readonly editable = computed(() => {
    const appointment = this.appointment();
    return !!appointment && isEditableOrCancellable(appointment, this.checkInHours());
  });

  protected readonly checkInEnabled = computed(() => {
    const appointment = this.appointment();
    return !!appointment && canCheckIn(appointment, this.checkInHours());
  });

  readonly breadcrumbConfig = computed(() => {
    const breadcrumb = this.pageConfig()?.breadcrumb;
    if (!breadcrumb) return null;
    return this.breadcrumbService.interpolateConfig(breadcrumb, {
      service: this.appointment()?.description?.trim() ?? '',
    });
  });

  protected readonly rows = computed<DetailRow[]>(() => {
    const a = this.appointment();
    if (!a) return [];

    const rows: (DetailRow | false)[] = [
      {
        icon: 'fa-stethoscope',
        labelKey: 'appointments.details-page.medicalServiceName',
        value: a.description,
      },
      !!a.physician && {
        icon: 'fa-user-doctor',
        labelKey: 'appointments.details-page.physician',
        value: a.physician,
      },
      {
        icon: 'fa-clock',
        labelKey: 'appointments.details-page.scheduled-on',
        value: format(parseISO(a.scheduledOn), 'dd/MM/yyyy - HH:mm'),
      },
      {
        icon: 'fa-hospital',
        labelKey: 'appointments.details-page.precinct',
        value: appointmentAddress(a),
      },
      !!a.locationDetails?.department && {
        icon: 'fa-house-medical',
        labelKey: 'appointments.details-page.ambulatory',
        value: a.locationDetails.department,
      },
      !!a.locationDetails?.floor && {
        icon: 'fa-stairs',
        labelKey: 'appointments.details-page.floor',
        value: a.locationDetails.floor,
      },
      !!a.locationDetails?.waitingRoom && {
        icon: 'fa-couch',
        labelKey: 'appointments.details-page.waiting-room',
        value: a.locationDetails.waitingRoom,
      },
      !!a.locationDetails?.examinationRoom && {
        icon: 'fa-door-open',
        labelKey: 'appointments.details-page.examination-room',
        value: a.locationDetails.examinationRoom,
      },
    ];
    return rows.filter((row): row is DetailRow => !!row);
  });

  constructor() {
    const viewContainerRef = inject(ViewContainerRef);
    this.modalService.register(viewContainerRef);
    inject(DestroyRef).onDestroy(() => this.modalService.clear(viewContainerRef));
  }

  ngOnInit(): void {
    // accesso diretto/refresh sulla pagina: la lista non è ancora nello store
    if (!this.loaded() && !this.fetching()) {
      this.refresh();
    }
  }

  refresh(): void {
    this.store.dispatch(fetchAppointments());
  }
}
