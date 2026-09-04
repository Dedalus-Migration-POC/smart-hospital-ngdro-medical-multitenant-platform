import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ViewContainerRef,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import {
  fetchPrivateBookingList,
  setPrivateBooking,
} from 'src/app/pages/bookings/bookings-ariannaCup/state/actions';
import { RetrievePrestazioni } from 'src/app/pages/bookings/bookings-ariannaCup/state/model';
import { selectPrivateBookings } from 'src/app/pages/bookings/bookings-ariannaCup/state/selectors';
import { SmartHospitalState } from 'src/app/store/reducers';
import { SummaryComponent } from '../../components/summary/summary.component';
import { SessionStorageKey, SessionStorageUtils } from 'src/app/utility/session-storage-utils';
import { Spinner } from 'src/app/components/spinner/spinner';
import { InputComponent } from 'src/app/components/input/input.component';
import { ModalService } from 'src/app/components/modal/modal.service';
import { toLocalizedText } from 'src/app/shared/utility/text.utils';

type PrestazioneItem = RetrievePrestazioni['documents'][number];

interface PrestazioniGroup {
  letter: string;
  items: PrestazioneItem[];
}

@Component({
  selector: 'app-private-booking-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    DesignAngularKitModule,
    SummaryComponent,
    Spinner,
    ReactiveFormsModule,
    InputComponent,
  ],
  templateUrl: './private-booking-list.component.html',
  styleUrls: ['./private-booking-list.component.scss'],
})
export class PrivateBookingListComponent implements OnInit {
  private readonly store = inject(Store<SmartHospitalState>);
  private modalService = inject(ModalService);
  private viewContainerRef = inject(ViewContainerRef);

  readonly setActiveStep = input.required<(stepIndex: number) => void>();
  readonly activeStepIndex = input.required<number>();

  privateBookingList = this.store.selectSignal(selectPrivateBookings);

  bookingList = computed<PrestazioneItem[]>(() => {
    const res = this.privateBookingList();
    return res?.data?.documents ?? [];
  });

  filter = signal('');
  searchControl = new FormControl('');
  selectedBooking = signal<PrestazioneItem | null>(null);

  groupsPrivateBookingList = computed(() => {
    const docs = this.bookingList();
    const q = this.filter().trim().toLowerCase();
    const filtered = !q
      ? docs
      : docs.filter((d: PrestazioneItem) => (d.descPrest ?? '').toLowerCase().includes(q));

    return this.buildPrestazioniGroups(filtered);
  });

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges.subscribe((value) => {
      this.selectedBooking.set(null);
      this.filter.set(value ?? '');
    });

    this.store.dispatch(
      fetchPrivateBookingList({
        request: { filter: this.filter() },
      }),
    );
  }

  retry(): void {
    this.filter.set('');
    this.searchControl.setValue('', { emitEvent: false });
    this.selectedBooking.set(null);

    this.store.dispatch(
      fetchPrivateBookingList({
        request: { filter: this.filter() },
      }),
    );
  }

  confirmSelectedBooking() {
    const selectedBooking = this.selectedBooking();
    if (!selectedBooking) return;

    this.modalService.open(this.viewContainerRef, {
      header: {
        title: {
          text: toLocalizedText(
            this.translateService.instant('bookings.booking-new.availability.confirm-modal.title'),
          ),
        },
      },
      body: {
        text: {
          text: toLocalizedText(
            this.translateService.instant(
              'bookings.booking-new.private-booking-list.confirm-modal.body',
              { descPrest: selectedBooking.descPrest },
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
                    'bookings.booking-new.private-booking-list.confirm-modal.cancel',
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
                    'bookings.booking-new.private-booking-list.confirm-modal.confirm',
                  ),
                ),
              },
            },
            callback: () => this.confirmBooking(this.selectedBooking()!),
          },
        ],
      },
    });
  }

  private takeFirstLetter(value: string): string {
    const letter = (value ?? '').trim();
    if (!letter) return '#';

    // remove accent: È → E, À → A
    const normalized = letter.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const char = normalized[0].toUpperCase();

    // return first letter but start with number show #
    return /^[A-Z]$/.test(char) ? char : '#';
  }

  private buildPrestazioniGroups(docs: PrestazioneItem[]): PrestazioniGroup[] {
    const mapGroups = new Map<string, PrestazioneItem[]>();

    // create group for each letter
    for (const doc of docs ?? []) {
      const firstLetter = this.takeFirstLetter(doc.descPrest);
      const group = mapGroups.get(firstLetter) ?? [];
      group.push(doc);
      mapGroups.set(firstLetter, group);
    }

    // sort items in each group
    for (const group of mapGroups.values()) {
      group.sort((a, b) =>
        (a.descPrest ?? '').localeCompare(b.descPrest ?? '', 'it', {
          sensitivity: 'base',
        }),
      );
    }

    // sort group letters, keep '#' last
    const letters = Array.from(mapGroups.keys()).sort((a, b) => {
      if (a === '#') return 1;
      if (b === '#') return -1;
      return a.localeCompare(b, 'it');
    });

    return letters.map((letter) => ({ letter, items: mapGroups.get(letter)! }));
  }

  private confirmBooking(booking: PrestazioneItem) {
    // stored session for refresh
    SessionStorageUtils.setItem(SessionStorageKey.privateBooking, JSON.stringify(booking));

    this.store.dispatch(setPrivateBooking({ request: booking }));
    this.setActiveStep()(this.activeStepIndex() + 1);
  }
}
