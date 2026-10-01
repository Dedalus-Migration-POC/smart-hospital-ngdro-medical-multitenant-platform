import { NgTemplateOutlet } from '@angular/common';
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
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { Breadcrumb } from 'src/app/components/breadcrumb/breadcrumb';
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
import { canCheckIn, checkInHintCode } from '../appointment.utils';
import { fetchAppointments } from '../state/actions';
import { AppointmentDto, PENDING_CHECK_IN_STATUSES } from '../state/model';
import {
  selectAppointments,
  selectAppointmentsBusy,
  selectAppointmentsError,
  selectAppointmentsLoading,
  selectCheckInHours,
  selectRequestingCheckIn,
} from '../state/selectors';

const PAGE_ID = '/booking-a4h/appointments';

@Component({
  selector: 'app-appointments-list',
  imports: [
    NgTemplateOutlet,
    TranslateModule,
    DesignAngularKitModule,
    Breadcrumb,
    ImageBlock,
    Spinner,
    Card,
  ],
  templateUrl: './appointments-list.component.html',
  styleUrls: ['./appointments-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentsListComponent implements OnInit {
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly pageConfigService = inject(PageConfigService);
  private readonly modalService = inject(BookingUnifiedModalService);
  private readonly cardActionsService = inject(CardActionsService);
  private readonly appointmentActions = inject(AppointmentActionsService);

  readonly pageConfig = toSignal(this.pageConfigService.get(PAGE_ID), {
    initialValue: null,
  });

  private readonly appointments = this.store.selectSignal(selectAppointments);
  protected readonly error = this.store.selectSignal(selectAppointmentsError);
  private readonly fetching = this.store.selectSignal(selectAppointmentsLoading);
  protected readonly requestingCheckIn = this.store.selectSignal(selectRequestingCheckIn);
  private readonly busy = this.store.selectSignal(selectAppointmentsBusy);
  private readonly checkInHours = this.store.selectSignal(selectCheckInHours);
  protected readonly loading = computed(() => this.fetching() || this.requestingCheckIn());

  private readonly queryParamMap = toSignal(this.activatedRoute.queryParamMap, {
    initialValue: this.activatedRoute.snapshot.queryParamMap,
  });
  protected readonly showAcceptedFirst = computed(
    () => this.queryParamMap().get('acceptance') === 'true',
  );

  protected readonly pendingAppointments = computed(() =>
    this.appointments().filter((a) => PENDING_CHECK_IN_STATUSES.includes(a.checkInStatus)),
  );

  protected readonly acceptedAppointments = computed(() =>
    this.appointments().filter((a) => a.checkInStatus === 'DONE'),
  );

  private readonly cardsSectionItems = computed(() =>
    getServiceCardsItems(this.pageConfig()?.sections, PAGE_ID),
  );

  private readonly pendingCardsConfig = computed<any>(() =>
    getServiceCardsConfigById(this.cardsSectionItems(), 'appointments-cards', PAGE_ID),
  );

  private readonly acceptedCardsConfig = computed<any>(() =>
    getServiceCardsConfigById(this.cardsSectionItems(), 'accepted-appointments-cards', PAGE_ID),
  );

  protected readonly pendingCards = computed(() =>
    this.buildCardsContainer(this.pendingAppointments(), this.pendingCardsConfig()),
  );
  protected readonly acceptedCards = computed(() =>
    this.buildCardsContainer(this.acceptedAppointments(), this.acceptedCardsConfig()),
  );

  constructor() {
    const viewContainerRef = inject(ViewContainerRef);
    this.modalService.register(viewContainerRef);
    inject(DestroyRef).onDestroy(() => this.modalService.clear(viewContainerRef));
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.store.dispatch(fetchAppointments());
  }

  // callback della action "checkIn" nel json della pagina
  requestCheckIn(id: string): void {
    const appointment = this.appointments().find((a) => a.id === id);
    if (appointment) this.appointmentActions.requestCheckIn(appointment);
  }

  private buildCardsContainer(
    appointments: AppointmentDto[],
    cardsConfig: any,
  ): CompiledCardsContainer {
    const templateCard = cardsConfig?.items?.[0];
    if (!templateCard) return { items: [] };

    return {
      ...cardsConfig,
      items: appointments.map((appointment) => {
        const cardData = this.toCardData(appointment);
        return {
          ...cardData,
          ...templateCard,
          id: `appointment-card-${appointment.id}`,
          type: 'data',
          actions: this.cardActionsService.compileActions(
            cardData,
            templateCard.actions as DataCardAction[] | undefined,
            { callbackContext: this, callbackArgsMode: 'paramsOnly' },
          ),
        };
      }),
    };
  }

  // Campi calcolati letti dal JSON e dalle condizioni delle action.
  private toCardData(appointment: AppointmentDto): Record<string, unknown> {
    const hours = this.checkInHours();
    const busy = this.busy();
    return {
      ...appointment,
      hint: checkInHintCode(appointment, hours),
      checkInHours: hours,
      busy,
      checkInDisabled:
        busy || appointment.lockCause === 'too-early' || !canCheckIn(appointment, hours),
    };
  }
}
