import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { SmartHospitalState } from 'src/app/store/reducers';
import { fetchBookingsList, setActiveStep } from '../state/actions';
import {
  selectBookingByNreError,
  selectBookingByNreLoading,
  selectBookingsList,
  selectBookingsListError,
  selectBookingsListLoading,
} from '../state/selectors';
import { compareAsc, compareDesc, format, isFuture, isPast } from 'date-fns';
import { BookingStepId } from '../state/model';
import { DesignAngularKitModule } from 'design-angular-kit';
import { SearchByNreComponent } from './search-by-nre/search-by-nre.component';
import { Spinner } from 'src/app/components/spinner/spinner';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, take } from 'rxjs';
import { selectAppConfig } from 'src/app/initialize/state/selector';
import { Breadcrumb } from 'src/app/components/breadcrumb/breadcrumb';
import { ImageBlock } from 'src/app/components/image-block/image-block';

@Component({
  selector: 'app-bookings-hero-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    DesignAngularKitModule,
    Spinner,
    SearchByNreComponent,
    Breadcrumb,
    ImageBlock,
  ],
  templateUrl: './bookings-hero-list.component.html',
  styleUrls: ['./bookings-hero-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingsHeroListComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private translateService = inject(TranslateService);
  private store = inject(Store<SmartHospitalState>);

  readonly pageConfig = toSignal(
    this.store.select(selectAppConfig).pipe(
      take(1),
      map((config) => config.pages.find((page: any) => page.id === '/bookings-hero')),
    ),
    { initialValue: null },
  );

  ngOnInit(): void {
    this.store.dispatch(fetchBookingsList());
  }

  readonly bookingsList = this.store.selectSignal(selectBookingsList);
  readonly bookingsListLoading = this.store.selectSignal(selectBookingsListLoading);
  readonly bookingByNreLoading = this.store.selectSignal(selectBookingByNreLoading);
  readonly bookingsListError = this.store.selectSignal(selectBookingsListError);
  readonly bookingByNreError = this.store.selectSignal(selectBookingByNreError);
  readonly loading = computed(() => this.bookingsListLoading() || this.bookingByNreLoading());

  readonly futureReservations = computed(() => {
    const appointments = this.bookingsList()?.appointments ?? [];
    return appointments
      .filter((appointment) => isFuture(new Date(appointment.dateTime)))
      .sort((a, b) => compareAsc(new Date(a.dateTime), new Date(b.dateTime)));
  });

  readonly pastReservations = computed(() => {
    const appointments = this.bookingsList()?.appointments ?? [];
    return appointments
      .filter((appointment) => isPast(new Date(appointment.dateTime)))
      .sort((a, b) => compareDesc(new Date(a.dateTime), new Date(b.dateTime)));
  });

  // Nota migrazione: il vecchio CardMultiuseService non e' disponibile in questa codebase;
  // la lista usa quindi rendering diretto delle card mantenendo ordinamento e comportamento.
  readonly toReadableDateTime = (dateTime: string | number) =>
    format(new Date(dateTime), 'dd/MM/yyyy HH:mm');

  goToDetails(id: string) {
    this.router.navigate([`details`], {
      relativeTo: this.activatedRoute,
      queryParams: { id: id },
    });
  }

  newBooking() {
    this.router.navigate(['new'], { relativeTo: this.activatedRoute });
    this.store.dispatch(setActiveStep({ step: BookingStepId.SelectBookingType }));
  }
}
