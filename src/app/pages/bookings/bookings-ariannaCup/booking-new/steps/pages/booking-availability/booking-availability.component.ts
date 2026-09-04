import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, take } from 'rxjs';
import { SummaryComponent } from '../../components/summary/summary.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SmartHospitalState } from 'src/app/store/reducers';
import { Store } from '@ngrx/store';
import { selectAppConfig } from 'src/app/initialize/state/selector';
import {
  selectFirstAvailability,
  selectOtherAvailability,
} from 'src/app/pages/bookings/bookings-ariannaCup/state/selectors';
import {
  OtherAvailabilityRequest,
  BookingsVm,
  Availability,
  FirstAvailabilityRequest,
  Schedule,
  Service,
} from 'src/app/pages/bookings/bookings-ariannaCup/state/model';
import {
  setAvailability,
  findOtherAvailability,
  findFirstAvailability,
} from 'src/app/pages/bookings/bookings-ariannaCup/state/actions';
import { DesignAngularKitModule } from 'design-angular-kit';
import { SessionStorageKey, SessionStorageUtils } from 'src/app/utility/session-storage-utils';
import { selectUserPhoneNumber } from 'src/app/pages/user-profile/state/user-profile.selectors';
import { isEqual, isValid, parse } from 'date-fns';
import { Spinner } from 'src/app/components/spinner/spinner';
import { ModalService } from 'src/app/components/modal/modal.service';
import { toLocalizedText } from 'src/app/shared/utility/text.utils';
import { ModalConfig } from 'src/app/components/modal/model';

@Component({
  selector: 'app-booking-availability',
  standalone: true,
  imports: [CommonModule, TranslateModule, DesignAngularKitModule, SummaryComponent, Spinner],
  templateUrl: './booking-availability.component.html',
  styleUrls: ['./booking-availability.component.scss'],
})
export class BookingAvailabilityComponent implements OnInit, AfterViewInit {
  private readonly store = inject(Store<SmartHospitalState>);
  private modalService = inject(ModalService);
  private viewContainerRef = inject(ViewContainerRef);

  readonly setActiveStep = input.required<(stepIndex: number) => void>();
  readonly activeStepIndex = input.required<number>();

  // config testuale della modale di conferma, con fallback sulle chiavi di traduzione se assente
  readonly pageConfig = toSignal(
    this.store.select(selectAppConfig).pipe(
      take(1),
      map((config) => config.pages.find((page: any) => page.id === '/bookings/new')),
    ),
    { initialValue: null },
  );

  @ViewChild('tabsAvailability', { read: ElementRef })
  tabsAvailability!: ElementRef<HTMLElement>;

  private requestFirstAvailability!: FirstAvailabilityRequest;
  private activeTabIndex = 0;
  private secondTabInitialized = false;
  private readonly shouldLoadOtherAvailability = signal(false);

  phoneNumber = this.store.selectSignal(selectUserPhoneNumber);

  firstAvailability = this.store.selectSignal(selectFirstAvailability);
  firstAvailabilityBooking = computed(() => this.buildBookingsVm(this.firstAvailability()));

  otherAvailability = this.store.selectSignal(selectOtherAvailability);
  otherAvailabilityBooking = computed(() => this.buildBookingsVm(this.otherAvailability()));

  constructor(
    private renderer: Renderer2,
    private destroyRef: DestroyRef,
    private translateService: TranslateService,
  ) {
    effect(() => {
      if (!this.shouldLoadOtherAvailability() || !this.requestFirstAvailability) {
        return;
      }

      const state = this.firstAvailability();
      if (!state || state.loading || state.error || !state.data?.hl7Messages) {
        return;
      }

      const availabilityRequest: OtherAvailabilityRequest = {
        ...this.requestFirstAvailability,
        hl7Messages: state.data.hl7Messages,
      };

      this.shouldLoadOtherAvailability.set(false);
      this.store.dispatch(findOtherAvailability({ request: availabilityRequest }));
    });
  }

  ngOnInit(): void {
    this.findFirstAvailability();
  }

  ngAfterViewInit(): void {
    // to call listener only the first time the second tab is pressed

    const el = this.tabsAvailability.nativeElement;

    this.activeTabIndex = 0;

    const unlisten = this.renderer.listen(el, 'shown.bs.tab', (ev: any) => {
      const trigger = ev.target as HTMLElement;

      const triggers = Array.from(
        el.querySelectorAll<HTMLElement>('[data-bs-toggle="tab"], [role="tab"]'),
      );

      const idx = triggers.indexOf(trigger);
      if (idx >= 0) {
        this.activeTabIndex = idx;
      }

      if (idx === 1 && !this.secondTabInitialized) {
        this.secondTabInitialized = true;
        this.onSecondTabFirstOpen();
      }
    });

    // automatic cleanup when the component is destroyed
    this.destroyRef.onDestroy(unlisten);
  }

  private findFirstAvailability() {
    const nreSession = SessionStorageUtils.getItem(SessionStorageKey.nre);
    if (nreSession) {
      const nreStored = JSON.parse(nreSession);
      const nre = typeof nreStored === 'string' ? nreStored : (nreStored?.nre ?? '');

      if (nre) {
        const telefonoIntestatario = this.phoneNumber();
        const request: FirstAvailabilityRequest = {
          telefonoIntestatario: telefonoIntestatario || '',
          numImpegnativa: nre,
          company: '',
        };

        this.requestFirstAvailability = request;

        this.store.dispatch(findFirstAvailability({ request: this.requestFirstAvailability }));
      }
    }
  }

  private onSecondTabFirstOpen() {
    if (!this.requestFirstAvailability) return;

    this.shouldLoadOtherAvailability.set(true);
  }

  private buildBookingsVm(bookingState: any): BookingsVm {
    let bookings: any[] = [];
    let isEmpty: boolean = false;
    let msgErrorText: string = '';

    if (bookingState?.data) {
      if (bookingState.data.schedules && bookingState.data.schedules.length) {
        bookings = bookingState.data.schedules.map((schedule: Schedule, i: number) => {
          // highlight pediatrica|pediatriche words
          const highlighted = schedule.structure.replace(
            /\b(pediatrica|pediatriche)\b/gi,
            (match) => `<span class="text-danger">${match}</span>`,
          );
          // id =>  schedule index (for easy schedule delete)
          let elem: any = {
            id: i,
            title: highlighted,
            ...(schedule.structureAddress &&
              !/non presente/i.test(schedule.structureAddress) && {
                subtitle: schedule.structureAddress,
              }),
          };

          if (Array.isArray(schedule.services) && schedule.services.length) {
            const isSameDatesTimesServices = this.isSameDatesTimesEqual(schedule.services);

            const services = schedule.services
              .map((s) => s?.description ?? s?.code ?? '')
              .filter(Boolean);

            elem = { ...elem, prescription: services };

            if (isSameDatesTimesServices) {
              elem.date = schedule.services[0]?.date ?? '';
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

  selectAvailability(indexSchedule: number) {
    const state = this.activeTabIndex === 0 ? this.firstAvailability() : this.otherAvailability();
    const schedule = state?.data?.schedules?.[indexSchedule];
    const hl7Messages = state?.data?.hl7Messages;

    if (schedule && hl7Messages) {
      const choiceAvailability: Availability = {
        schedule,
        hl7Messages,
      };

      // config di pagina (contenuto + stile) oppure fallback sulle chiavi di traduzione esistenti
      const modalConfig: ModalConfig = this.pageConfig()?.page?.modals?.['confirmAvailability'] ?? {
        header: {
          title: {
            text: toLocalizedText(
              this.translateService.instant(
                'bookings.booking-new.availability.confirm-modal.title',
              ),
            ),
          },
        },
        body: {
          text: {
            text: toLocalizedText(
              this.translateService.instant(
                'bookings.booking-new.availability.confirm-modal.body',
                { date: schedule?.services[0].date },
              ),
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
                    this.translateService.instant(
                      'bookings.booking-new.availability.confirm-modal.cancel',
                    ),
                  ),
                },
              },
            },
            {
              button: {
                text: {
                  text: toLocalizedText(
                    this.translateService.instant(
                      'bookings.booking-new.availability.confirm-modal.confirm',
                    ),
                  ),
                },
              },
            },
          ],
        },
      };

      // le callback esistono solo a runtime: la config (statica) non puo' contenerle
      const [cancelAction, confirmAction] = modalConfig.footer?.actions ?? [];
      if (cancelAction) cancelAction.callback = () => {};
      if (confirmAction) confirmAction.callback = () => this.confirmBooking(choiceAvailability);

      this.modalService.open(this.viewContainerRef, modalConfig);
    }
  }

  retry() {
    if (this.activeTabIndex === 0) {
      this.findFirstAvailability();
    } else {
      this.onSecondTabFirstOpen();
    }
  }

  private confirmBooking(schedule: Availability) {
    // stored session for refresh
    SessionStorageUtils.setItem(SessionStorageKey.availability, JSON.stringify(schedule));

    this.store.dispatch(setAvailability({ request: schedule }));
    this.setActiveStep()(this.activeStepIndex() + 1);
  }

  private isSameDatesTimesEqual(services: Service[]): boolean {
    if (!Array.isArray(services) || services.length <= 1) return true;

    const formatDate = 'dd/MM/yyyy HH:mm';
    const firstDate = parse(services[0].date?.trim() ?? '', formatDate, new Date());
    if (!isValid(firstDate)) return false;

    for (let i = 1; i < services.length; i++) {
      const date = parse(services[i].date?.trim() ?? '', formatDate, new Date());
      if (!isValid(date) || !isEqual(date, firstDate)) return false;
    }
    return true;
  }
}
