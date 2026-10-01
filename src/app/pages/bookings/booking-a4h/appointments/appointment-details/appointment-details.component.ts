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
import { map } from 'rxjs';
import { Breadcrumb } from 'src/app/components/breadcrumb/breadcrumb';
import { BreadcrumbService } from 'src/app/components/breadcrumb/breadcrumb.service';
import { Card } from 'src/app/components/card/card';
import { CompiledCardsContainer, DataCardAction } from 'src/app/components/card/model';
import { ImageBlock } from 'src/app/components/image-block/image-block';
import { Spinner } from 'src/app/components/spinner/spinner';
import { PageConfigService } from 'src/app/pages/page-config.service';
import { CardActionsService } from 'src/app/shared/services/card-actions.service';
import {
  getServiceCardsConfigById,
  getServiceCardsItems,
} from 'src/app/shared/utility/cards.utils';
import { SmartHospitalState } from 'src/app/store/reducers';
import { BookingUnifiedModalService } from '../../booking-unified-modal.service';
import { AppointmentActionsService } from '../appointment-actions.service';
import {
  appointmentAddress,
  canCheckIn,
  checkInHintCode,
  isEditableOrCancellable,
} from '../appointment.utils';
import { fetchAppointments } from '../state/actions';
import { AppointmentDto } from '../state/model';
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

@Component({
  selector: 'app-appointment-details',
  imports: [TranslateModule, RouterLink, Breadcrumb, Card, ImageBlock, Spinner],
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
  private readonly cardActionsService = inject(CardActionsService);
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
  protected readonly loading = computed(
    () => this.fetching() || this.requestingCheckIn() || this.deleting(),
  );

  protected readonly appointment = computed(
    () => this.appointments().find((a) => a.id === this.appointmentId()) ?? null,
  );

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

  private readonly cardsConfig = computed<any>(() =>
    getServiceCardsConfigById(
      getServiceCardsItems(this.pageConfig()?.sections, '/booking-a4h/appointments/details'),
      'appointment-details-card',
      '/booking-a4h/appointments/details',
    ),
  );

  protected readonly renderedCardsConfig = computed<CompiledCardsContainer>(() => {
    const appointment = this.appointment();
    const cardsConfig = this.cardsConfig();
    const templateCard = cardsConfig?.items?.[0];
    if (!appointment || !templateCard) return { items: [] };

    const cardData = {
      ...appointment,
      address: appointmentAddress(appointment),
      hint: checkInHintCode(appointment, this.checkInHours(), true),
      paymentStatusForDisplay:
        appointment.checkInStatus === 'DONE' ? null : appointment.paymentStatus,
      isDone: appointment.checkInStatus === 'DONE',
      editDisabled: !this.editable() || this.busy(),
      checkInDisabled: !this.checkInEnabled() || this.busy(),
    };

    return {
      ...cardsConfig,
      items: [
        {
          ...cardData,
          ...templateCard,
          id: `appointment-details-${appointment.id}`,
          type: 'data',
          actions: this.cardActionsService.compileActions(
            cardData,
            templateCard.actions as DataCardAction[] | undefined,
            { callbackContext: this, callbackArgsMode: 'sourceAndParams' },
          ),
        },
      ],
    };
  });

  editAppointment(appointment: AppointmentDto): void {
    this.actions.editAppointment(appointment);
  }

  deleteAppointment(appointment: AppointmentDto): void {
    this.actions.deleteAppointment(appointment);
  }

  requestCheckIn(appointment: AppointmentDto): void {
    this.actions.requestCheckIn(appointment);
  }

  downloadVademecum(appointment: AppointmentDto): void {
    if (appointment.linkNote) {
      window.open(appointment.linkNote, '_blank', 'noopener,noreferrer');
    }
  }

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
