import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { SmartHospitalState } from 'src/app/store/reducers';
import { selectUserProfileData } from 'src/app/pages/user-profile/state/user-profile.selectors';
import { selectSelectedStruttura } from 'src/app/pages/bookings/booking-a4h/state/struttura/struttura.selectors';
import { mergePdfByUrls } from '../state/actions';
import { HealthcareUnit } from '../state/model';
import {
  selectAvailableListToBook,
  selectBookAppointmentResponse,
  selectMergePdfByUrls,
} from '../state/selectors';

@Component({
  selector: 'app-booking-unified-confirmed-booking',
  imports: [TranslateModule, RouterLink, DatePipe, TitleCasePipe],
  templateUrl: './confirmed-booking.component.html',
  styleUrls: ['./confirmed-booking.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmedBookingComponent {
  private readonly router = inject(Router);
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly mergePdfByUrlsResponse = this.store.selectSignal(selectMergePdfByUrls);
  private readonly bookAppointmentResponse = this.store.selectSignal(selectBookAppointmentResponse);
  private readonly availableListToBook = this.store.selectSignal(selectAvailableListToBook);

  protected readonly user = this.store.selectSignal(selectUserProfileData);
  private readonly selectedStrutturaState = this.store.selectSignal(selectSelectedStruttura);
  protected readonly selectedStruttura = computed(
    () => this.selectedStrutturaState() as HealthcareUnit | null,
  );
  protected readonly downloadLink = computed(() => {
    const link = this.mergePdfByUrlsResponse();
    return link ? window.URL.createObjectURL(link.body) : null;
  });

  protected readonly bookingSummary = computed(() => {
    const availableListToBook = this.availableListToBook();
    if (availableListToBook?.length) {
      return availableListToBook.map((book: any) => book.bookInfo).filter(Boolean);
    }

    const bookingSummary = this.bookAppointmentResponse();
    return bookingSummary ? [bookingSummary.appointment] : [];
  });

  private readonly preparationLinks = computed(() =>
    this.bookingSummary().flatMap((summary: any) =>
      (summary?.additionalProperties?.preparation ?? [])
        .map((prep: { link?: string }) => prep.link)
        .filter((link: string | undefined): link is string => !!link),
    ),
  );

  private readonly pdfRequested = signal(false);

  constructor() {
    effect(() => {
      const links = this.preparationLinks();
      if (!links.length || this.pdfRequested()) return;

      this.pdfRequested.set(true);
      this.store.dispatch(
        mergePdfByUrls({
          payload: { filename: 'preparationNotes.pdf', urlList: links },
        }),
      );
    });

    effect(() => {
      if (!this.bookingSummary().length) this.router.navigate(['/booking-a4h']);
    });
  }

  onDownload(link: string) {
    const downloadLink = document.createElement('a');
    downloadLink.href = link;
    downloadLink.download = 'preparationNotes.pdf';
    downloadLink.click();
  }
}
