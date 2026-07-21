import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Type,
  ViewContainerRef,
  computed,
  inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { SmartHospitalState } from 'src/app/store/reducers';
import {
  cancelAppointment,
  fetchAvailableDaysForRescheduleAppointment,
  fetchBookingByNre,
  fetchBookingsList,
  printMemo,
  sendEmailNotification,
  setSummaryBooking,
} from '../state/actions';
import { combineLatest, map, take } from 'rxjs';
import {
  selectBookingByNreLoading,
  selectBookingByNreResp,
  selectBookingsList,
  selectBookingsListLoading,
} from '../state/selectors';
import { ActivatedRoute } from '@angular/router';
import { Availability } from '../state/model';
import { format, isBefore, startOfTomorrow } from 'date-fns';
import { ModalService, ModalType } from 'src/app/components/modal/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { Spinner } from 'src/app/components/spinner/spinner';
import { Breadcrumb } from 'src/app/components/breadcrumb/breadcrumb';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectAppConfig } from 'src/app/initialize/state/selector';
import { BreadcrumbService } from 'src/app/components/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-booking-hero-details',
  standalone: true,
  imports: [CommonModule, TranslateModule, DesignAngularKitModule, Spinner, Breadcrumb],
  templateUrl: './bookings-hero-details.component.html',
  styleUrls: ['./bookings-hero-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingHeroDetailsComponent implements OnInit {
  private store = inject(Store<SmartHospitalState>);
  private activatedRoute = inject(ActivatedRoute);
  private modalService = inject(ModalService);
  private translateService = inject(TranslateService);
  private viewContainerRef = inject(ViewContainerRef);
  private breadcrumbService = inject(BreadcrumbService);

  readonly pageConfig = toSignal(
    this.store.select(selectAppConfig).pipe(
      take(1),
      map((config) => config.pages.find((page: any) => page.id === '/bookings-hero/details')),
    ),
    { initialValue: null },
  );
  readonly breadcrumbConfig = computed(() => {
    const config = this.pageConfig();
    const bookingId = this.bookingId;
    const nre = this.nre;

    if (!config?.page?.breadcrumb) return null;

    return this.breadcrumbService.interpolateConfig(config.page.breadcrumb, {
      bookingId: bookingId ? bookingId : nre ? nre : '',
    });
  });

  bookingId = this.activatedRoute.snapshot.queryParams['id'];
  nre = this.activatedRoute.snapshot.queryParams['nre'];
  fiscalCode = this.activatedRoute.snapshot.queryParams['fiscalCode'];
  appointmentInfo: IAppointmentInfo[] | null = null;

  readonly bookingsListLoading = this.store.selectSignal(selectBookingsListLoading);
  readonly bookingByNreLoading = this.store.selectSignal(selectBookingByNreLoading);
  readonly bookingsList = this.store.selectSignal(selectBookingsList);
  readonly bookingByNre = this.store.selectSignal(selectBookingByNreResp);

  readonly loading = computed(() => this.bookingsListLoading() || this.bookingByNreLoading());

  ngOnInit(): void {
    if (this.bookingId) {
      this.store
        .select(selectBookingsList)
        .pipe(
          take(1),
          map((bookingsListResp) => {
            if (!bookingsListResp) {
              this.store.dispatch(fetchBookingsList());
            }
          }),
        )
        .subscribe();
    }

    if (this.nre && this.fiscalCode) {
      this.store
        .select(selectBookingByNreResp)
        .pipe(
          take(1),
          map((bookingByNreResp) => {
            if (!bookingByNreResp) {
              this.store.dispatch(
                fetchBookingByNre({
                  payload: {
                    fiscalCode: this.fiscalCode,
                    prescriptionId: this.nre,
                  },
                }),
              );
            }
          }),
        )
        .subscribe();
    }
  }
  isAtMostTomorrow(date: string | number): boolean {
    const targetDate = new Date(date);
    const tomorrowStart = startOfTomorrow();

    return !isBefore(targetDate, tomorrowStart);
  }

  readonly bookingDetails = computed(() => {
    const bookingsListResp = this.bookingsList();
    const bookingByNreResp = this.bookingByNre();

    if (bookingsListResp && this.bookingId) {
      const app = (bookingsListResp?.appointments ?? []).find((el) => el.id === this.bookingId);
      if (app) {
        this.getAppointmentInfo(app);
      }
      return { ...bookingsListResp, appointment: app };
    }

    if (bookingByNreResp) {
      this.getAppointmentInfo(bookingByNreResp?.appointments[0]);
      return {
        ...bookingByNreResp,
        appointment: bookingByNreResp?.appointments[0],
      };
    }

    return null;
  });

  getAppointmentInfo(app: Availability) {
    this.appointmentInfo = [
      {
        label: 'Prestazione',
        value: app.serviceDescriptionList
          ? app.serviceDescriptionList.map((service) => service.description).join(', ')
          : app.descriptionList
            ? app.descriptionList.join(', ')
            : '',
      },
      {
        label: 'Medico',
        value: app.physician ? app.physician.firstName + app.physician.lastName : '',
      },
      { label: 'Nome agenda', value: app.unitDescription },
      { label: 'Indirizzo', value: app.location.address || '' },
      {
        label: 'Data',
        value:
          format(new Date(app.dateTime), 'dd/MM/yyyy') +
          ' alle ore ' +
          format(new Date(app.dateTime), 'HH:mm'),
      },
      { label: 'Presidio', value: app.location.name || '' },
      { label: 'Prenotato per', value: app.delegateFiscalCode || '' },

      {
        label: 'Tariffa',
        value:
          '€' +
          app.billingInfo.reduce((sum, item) => {
            if (item.finalPrice) {
              return sum + item.finalPrice;
            }
            return sum + 0;
          }, 0),
      },
      {
        label: 'Condizioni e Prescrizioni',
        value: app.additionalProperties?.agenda_patient_text || '',
      },
    ];
  }

  onPrintMemo() {
    const bookingDetails = this.bookingDetails();
    this.store.dispatch(
      printMemo({
        payload: {
          sessionId: bookingDetails?.sessionId!,
          appointmentId: bookingDetails?.appointment?.id,
        },
      }),
    );
  }

  onSendEmailNotification() {
    const bookingDetails = this.bookingDetails();
    this.store.dispatch(
      sendEmailNotification({
        payload: {
          sessionId: bookingDetails?.sessionId!,
          appointmentId: bookingDetails?.appointment?.id,
        },
      }),
    );
  }

  onCancel() {
    this.modalService.open(this.viewContainerRef, {
      type: ModalType.INFO,
      title: this.translateService.instant('bookings-hero.bookings-list.delete-modal.title'),
      body: this.translateService.instant('bookings-hero.bookings-list.delete-modal.body'),
      styleClass: 'modal-' + ModalType.INFO.toLowerCase(),
      centered: true,
      buttons: [
        {
          label: this.translateService.instant('bookings-hero.bookings-list.delete-modal.cancel'),
          styleClass: 'btn-outline-primary',
          callback: () => console.log('Annullata modale'),
        },
        {
          label: this.translateService.instant('bookings-hero.bookings-list.delete-modal.confirm'),
          styleClass: 'btn-primary',
          callback: () => {
            this.deleteBooking();
          },
        },
      ],
    });
  }

  deleteBooking() {
    const bookingDetails = this.bookingDetails();
    this.store.dispatch(
      cancelAppointment({
        payload: {
          sessionId: bookingDetails?.sessionId!,
          appointmentId: bookingDetails?.appointment?.id,
        },
      }),
    );
  }
  onReschedule() {
    let payload;
    const bookingDetails = this.bookingDetails();
    payload = this.nre
      ? {
          sessionId: bookingDetails?.sessionId!,
          prescriptionId: this.nre,
          appointmentToMove: { id: bookingDetails?.appointment?.id! },
          maxResults: 100,
        }
      : {
          sessionId: bookingDetails?.sessionId!,
          appointmentToMove: { id: bookingDetails?.appointment?.id! },
          maxResults: 100,
        };
    this.store.dispatch(
      setSummaryBooking({
        payload: {
          bookingType: this.nre ? 'nre_to_move' : 'free_prof_to_move',
          appointmentToMove: bookingDetails?.appointment?.id,
          services: bookingDetails?.appointment?.descriptionList?.map((service) => ({
            name: service,
          })),
          sessionId: bookingDetails?.sessionId,
          prescriptionId: this.nre,
        },
      }),
    );
    this.store.dispatch(fetchAvailableDaysForRescheduleAppointment({ payload }));
  }
}

interface IAppointmentInfo {
  label: string;
  value: string | number;
}
