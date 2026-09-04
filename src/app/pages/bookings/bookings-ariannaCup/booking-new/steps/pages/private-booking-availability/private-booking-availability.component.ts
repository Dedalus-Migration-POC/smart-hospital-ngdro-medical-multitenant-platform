import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, input, ViewContainerRef } from '@angular/core';
import { SummaryComponent } from '../../components/summary/summary.component';
import { SmartHospitalState } from 'src/app/store/reducers';
import { Store } from '@ngrx/store';
import {
  selectPrivateBooking,
  selectPrivateDoctor,
  selectPrivateListAvailability,
} from 'src/app/pages/bookings/bookings-ariannaCup/state/selectors';
import {
  Availability,
  BookingsVm,
  Schedule,
} from 'src/app/pages/bookings/bookings-ariannaCup/state/model';
import {
  findPrivateListAvailability,
  setAvailability,
} from 'src/app/pages/bookings/bookings-ariannaCup/state/actions';
import { SessionStorageKey, SessionStorageUtils } from 'src/app/utility/session-storage-utils';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { Spinner } from 'src/app/components/spinner/spinner';
import { ModalService } from 'src/app/components/modal/modal.service';
import { toLocalizedText } from 'src/app/shared/utility/text.utils';

@Component({
  selector: 'app-booking-availability',
  standalone: true,
  imports: [CommonModule, SummaryComponent, TranslateModule, DesignAngularKitModule, Spinner],
  templateUrl: './private-booking-availability.component.html',
  styleUrls: ['./private-booking-availability.component.scss'],
})
export class PrivateBookingAvailabilityComponent implements OnInit {
  private readonly store = inject(Store<SmartHospitalState>);
  private modalService = inject(ModalService);
  private viewContainerRef = inject(ViewContainerRef);

  readonly setActiveStep = input.required<(stepIndex: number) => void>();
  readonly activeStepIndex = input.required<number>();

  privateListAvailability = this.store.selectSignal(selectPrivateListAvailability);
  privateListAvailabilityBooking = computed(() =>
    this.buildBookingsVm(this.privateListAvailability()),
  );
  private readonly privateBookingState = this.store.selectSignal(selectPrivateBooking);
  private readonly privateDoctorState = this.store.selectSignal(selectPrivateDoctor);

  privateBooking = computed(
    () => this.privateBookingState() ?? this.readSessionItem(SessionStorageKey.privateBooking),
  );

  privateDoctor = computed(
    () => this.privateDoctorState() ?? this.readSessionItem(SessionStorageKey.privateDoctor),
  );

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.loadAvailability();
  }

  retry() {
    this.loadAvailability();
  }

  selectAvailability(indexSchedule: number) {
    const state = this.privateListAvailability();
    const schedule = state?.data?.scheduleList?.schedules?.[indexSchedule];
    const hl7Messages = state?.data?.scheduleList?.hl7Messages;

    if (schedule && hl7Messages) {
      const choiceAvailability: Availability = {
        schedule,
        hl7Messages,
      };

      this.modalService.open(this.viewContainerRef, {
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
              callback: () => {},
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
              callback: () => this.confirmBooking(choiceAvailability),
            },
          ],
        },
      });
    }
  }

  private buildBookingsVm(bookingState: any): BookingsVm {
    let bookings: any[] = []; //CardMultiUse[] = [];
    let isEmpty: boolean = false;

    if (bookingState.data?.scheduleList?.schedules) {
      if (bookingState.data?.scheduleList?.schedules?.length) {
        bookings = bookingState.data.scheduleList.schedules.map((schedule: Schedule, i: number) => {
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
            elem.date = schedule.services[0]?.date ?? '';
            elem.prescription = [schedule.services[0]?.description ?? ''];
          }

          return elem;
        });
      } else {
        isEmpty = true;
      }
    }

    return {
      loading: bookingState?.loading ?? false,
      error: bookingState?.error ?? null,
      bookings: bookings,
      isEmptyList: isEmpty,
    };
  }

  private loadAvailability() {
    const booking = this.privateBooking();
    const doctor = this.privateDoctor();
    const codRegPrest = booking?.codRegPrest;
    const descPrest = booking?.descPrest;
    const idAgenda = doctor?.idAgenda;

    if (!codRegPrest || !descPrest || !idAgenda) return;

    this.store.dispatch(
      findPrivateListAvailability({
        request: { codRegPrest, descPrest, idAgenda },
      }),
    );
  }

  private confirmBooking(schedule: Availability) {
    // stored session for refresh
    SessionStorageUtils.setItem(SessionStorageKey.availability, JSON.stringify(schedule));

    this.store.dispatch(setAvailability({ request: schedule }));
    this.setActiveStep()(3);
  }

  private readSessionItem(key: SessionStorageKey): any {
    const raw = SessionStorageUtils.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }
}
