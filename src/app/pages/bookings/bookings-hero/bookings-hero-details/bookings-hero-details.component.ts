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
import { ModalService } from 'src/app/components/modal/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { toLocalizedText } from 'src/app/shared/utility/text.utils';
import { DesignAngularKitModule } from 'design-angular-kit';
import { Spinner } from 'src/app/components/spinner/spinner';
import { Breadcrumb } from 'src/app/components/breadcrumb/breadcrumb';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectAppConfig } from 'src/app/initialize/state/selector';
import { BreadcrumbService } from 'src/app/components/breadcrumb/breadcrumb.service';
import {
  getServiceCardsConfigById,
  getServiceCardsItems,
} from 'src/app/shared/utility/cards.utils';
import { CompiledCardsContainer, DataCardAction } from 'src/app/components/card/model';
import { CardActionsService } from 'src/app/shared/services/card-actions.service';
import { Card } from 'src/app/components/card/card';
import { ImageBlock } from 'src/app/components/image-block/image-block';

@Component({
  selector: 'app-booking-hero-details',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    DesignAngularKitModule,
    Spinner,
    Breadcrumb,
    Card,
    ImageBlock,
  ],
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
  private cardActionsService = inject(CardActionsService);

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

    if (!config?.breadcrumb) return null;

    return this.breadcrumbService.interpolateConfig(config.breadcrumb, {
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

  readonly cardsSectionItems = computed<any[]>(() => {
    return getServiceCardsItems(this.pageConfig()?.sections, '/bookings-hero/details');
  });

  readonly cardsConfig = computed<any>(() =>
    getServiceCardsConfigById(
      this.cardsSectionItems(),
      'appointment-card',
      '/bookings-hero/details',
    ),
  );

  readonly renderedCardsConfig = computed<CompiledCardsContainer>(() => {
    const cardsConfig = this.cardsConfig();
    if (!cardsConfig) return { items: [] };

    const templateCard = cardsConfig.items?.[0];
    return {
      ...cardsConfig,
      items: (this.bookingDetails() ? [this.bookingDetails()] : []).map(
        (booking: any, index: number) => {
          console.log('booking:', booking);
          const compiledActions = this.cardActionsService.compileActions(
            booking,
            templateCard?.actions as DataCardAction[] | undefined,
            {
              callbackContext: this,
              callbackArgsMode: 'sourceAndParams',
            },
          );
          return {
            ...booking,
            ...templateCard,
            id: `card-${index + 1}`,
            type: 'data',
            actions: compiledActions,
          } as any;
        },
      ),
    };
  });

  readonly bookingDetails = computed(() => {
    const bookingsListResp = this.bookingsList();
    const bookingByNreResp = this.bookingByNre();

    if (bookingsListResp && this.bookingId) {
      const app = (bookingsListResp?.appointments ?? []).find((el) => el.id === this.bookingId);
      return {
        ...bookingsListResp,
        appointment: app && this.getAppointmentInfo(app),
      };
    }

    if (bookingByNreResp) {
      let app = bookingByNreResp?.appointments[0];
      return {
        ...bookingByNreResp,
        appointment: this.getAppointmentInfo(app),
      };
    }

    return null;
  });

  getAppointmentInfo(app: Availability) {
    const info = {
      ...app,
      isAtMostTomorrow: this.isAtMostTomorrow(app?.dateTime!),
      dateTime: new Date(app?.dateTime!),
      physician: app?.physician
        ? {
            ...app?.physician,
            name: app.physician.firstName + ' ' + app.physician.lastName,
          }
        : undefined,
      finalPrice:
        '€' +
        app?.billingInfo.reduce((sum, item) => {
          if (item.finalPrice) {
            return sum + item.finalPrice;
          }
          return sum + 0;
        }, 0),
    };
    return info;
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
      header: {
        title: {
          text: toLocalizedText(
            this.translateService.instant('bookings-hero.bookings-list.delete-modal.title'),
          ),
        },
      },
      body: {
        text: {
          text: toLocalizedText(
            this.translateService.instant('bookings-hero.bookings-list.delete-modal.body'),
          ),
        },
      },
      footer: {
        actions: [
          {
            button: {
              outline: true,
              text: {
                text: toLocalizedText(
                  this.translateService.instant('bookings-hero.bookings-list.delete-modal.cancel'),
                ),
              },
            },
            callback: () => console.log('Annullata modale'),
          },
          {
            button: {
              text: {
                text: toLocalizedText(
                  this.translateService.instant('bookings-hero.bookings-list.delete-modal.confirm'),
                ),
              },
            },
            callback: () => {
              this.deleteBooking();
            },
          },
        ],
      },
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
