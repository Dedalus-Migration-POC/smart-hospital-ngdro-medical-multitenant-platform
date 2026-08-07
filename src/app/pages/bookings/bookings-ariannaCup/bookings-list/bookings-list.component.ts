import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartHospitalState } from 'src/app/store/reducers';
import { Store } from '@ngrx/store';
import { selectBooking, selectDeleteBookingLoading } from '../state/selectors';
import { deleteBooking, fetchBookingList, resetStepNewBooking } from '../state/actions';
import { ActivatedRoute, Router } from '@angular/router';
import { selectUserPhoneNumber } from 'src/app/pages/user-profile/state/user-profile.selectors';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { Schedule, BookingsVm } from '../state/model';
import { isBefore, isValid, parse, startOfToday } from 'date-fns';
import { SessionStorageKey, SessionStorageUtils } from 'src/app/utility/session-storage-utils';
import { Spinner } from 'src/app/components/spinner/spinner';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectAppConfig } from 'src/app/initialize/state/selector';
import { map, take } from 'rxjs';
import { ImageBlock } from 'src/app/components/image-block/image-block';
import { Breadcrumb } from 'src/app/components/breadcrumb/breadcrumb';
import { Card } from 'src/app/components/card/card';
import { CardActionsService } from 'src/app/shared/services/card-actions.service';
import { CompiledCardsContainer, DataCardAction } from 'src/app/components/card/model';

@Component({
  selector: 'app-bookings-list',
  imports: [CommonModule, TranslateModule, Spinner, ImageBlock, Breadcrumb, Card],
  templateUrl: './bookings-list.component.html',
  styleUrls: ['./bookings-list.component.scss'],
})
export class BookingsListComponent implements OnInit {
  private readonly store = inject(Store<SmartHospitalState>);
  private cardActionsService = inject(CardActionsService);

  readonly pageConfig = toSignal(
    this.store.select(selectAppConfig).pipe(
      take(1),
      map((config) => config.pages.find((page: any) => page.id === '/bookings')),
    ),
    { initialValue: null },
  );
  readonly cardsConfig = computed<any>(() => {
    const config = this.pageConfig();
    const sections = config?.sections;
    const cardsSection = sections?.find((section: any) => section.id === 'cards-section');
    const cardsItem = cardsSection?.areas?.center?.items?.find(
      (item: any) => item.type === 'SERVICE_CARDS',
    );
    return cardsItem?.props;
  });
  readonly renderedCardsConfig = computed<CompiledCardsContainer>(() => {
    const cardsConfig = this.cardsConfig();
    if (!cardsConfig) return { items: [] };

    const templateCard = cardsConfig.items?.[0];
    return {
      ...cardsConfig,
      items: (this.bookingsList()?.bookings ?? []).map((report: any, index: number) => {
        const compiledActions = this.cardActionsService.compileActions(
          report,
          templateCard?.actions as DataCardAction[] | undefined,
          {
            callbackContext: this,
            callbackArgsMode: 'sourceAndParams',
          },
        );
        return {
          ...report,
          ...templateCard,
          id: `card-${index + 1}`,
          type: 'data',
          actions: compiledActions,
        } as any;
      }),
    };
  });

  phoneNumber = this.store.selectSignal(selectUserPhoneNumber);
  bookingList = this.store.selectSignal(selectBooking);
  isDeleteBooking = this.store.selectSignal(selectDeleteBookingLoading);
  bookingsList = computed(() => this.buildBookingsVm(this.bookingList()));

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.resetStateNewBooking();

    this.store.dispatch(
      fetchBookingList({
        request: { telefonoIntestatario: this.phoneNumber() ?? '' },
      }),
    );
  }

  deleteBooking(booking: any, indexSchedule: number): void {
    const title = this.translateService.instant('bookings.bookings-list.delete-modal.title');
    const body = this.translateService.instant('bookings.bookings-list.delete-modal.body');
    if (window.confirm(`${title}\n\n${body}`)) {
      this.deleteSchedule(indexSchedule);
    }
  }

  resetStateNewBooking() {
    // clear
    SessionStorageUtils.removeItem(SessionStorageKey.nre);
    SessionStorageUtils.removeItem(SessionStorageKey.bookingStep);
    SessionStorageUtils.removeItem(SessionStorageKey.availability);
    SessionStorageUtils.removeItem(SessionStorageKey.bookingType);
    SessionStorageUtils.removeItem(SessionStorageKey.privateBooking);
    SessionStorageUtils.removeItem(SessionStorageKey.privateDoctor);

    this.store.dispatch(resetStepNewBooking());
  }

  newBooking() {
    this.router.navigate(['new'], { relativeTo: this.activatedRoute });
  }

  retry(): void {
    this.store.dispatch(
      fetchBookingList({
        request: { telefonoIntestatario: this.phoneNumber() ?? '' },
      }),
    );
  }

  private buildBookingsVm(bookingState: any): BookingsVm {
    let bookings: any[] = [];
    let isEmpty: boolean = false;
    let msgErrorText: string = '';

    if (bookingState?.data) {
      if (bookingState.data.schedules && bookingState.data.schedules.length) {
        bookings = bookingState.data.schedules.map((schedule: Schedule, i: number) => {
          // id =>  schedule index (for easy schedule delete)
          let elem: any = {
            ...schedule,
            id: i,
            title: schedule.structure,
            ...(schedule.structureAddress &&
              !/non presente/i.test(schedule.structureAddress) && {
                subtitle: schedule.structureAddress,
              }),
          };

          if (Array.isArray(schedule.services) && schedule.services.length) {
            const services = schedule.services
              .map((s) => s?.description ?? s?.code ?? '')
              .filter(Boolean);

            // they have the same date
            elem.date = schedule.services[0]?.date ?? '';
            elem = { ...elem, prescription: services };

            const firstDateStr = schedule.services[0]?.date?.trim() ?? '';
            const formatDate = 'dd/MM/yyyy HH:mm';
            const firstDate = parse(firstDateStr, formatDate, new Date());

            const isPreviousDate = isValid(firstDate) && isBefore(firstDate, startOfToday());

            if (isPreviousDate) {
              console.log('++++elem', elem);
              elem.isPreviousDate = true;
            }
          }

          return elem;
        });
      } else {
        isEmpty = true;
      }
      // else {
      //   if (bookingState.data.userMessage) {
      //     const userMessage = bookingState.data.userMessage.trim()
      //     if (userMessage.length) {
      //       if (userMessage === '404') {
      //         isEmpty = true
      //       } else {
      //         msgErrorText = userMessage
      //       }
      //     }
      //   }
      // }
    }

    return {
      loading: bookingState?.loading ?? false,
      error: bookingState?.error ?? null,
      bookings: bookings,
      isEmptyList: isEmpty,
      msgError: msgErrorText,
    };
  }

  private deleteSchedule(indexSchedule: number): void {
    const bookingState = this.bookingList();
    const phone = this.phoneNumber();
    const schedules = bookingState?.data?.schedules ?? [];
    const schedule = schedules[indexSchedule];
    console.log('Deleting schedule:', indexSchedule);
    if (!schedule) return;
    this.store.dispatch(
      deleteBooking({
        request: {
          telefonoIntestatario: phone ?? '',
          numImpegnativa: schedule.numImpegnativa || '',
          schedule,
        },
      }),
    );
  }
}
