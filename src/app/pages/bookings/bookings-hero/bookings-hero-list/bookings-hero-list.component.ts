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
import { Availability, BookingStepId } from '../state/model';
import { DesignAngularKitModule } from 'design-angular-kit';
import { SearchByNreComponent } from './search-by-nre/search-by-nre.component';
import { Spinner } from 'src/app/components/spinner/spinner';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, take } from 'rxjs';
import { selectAppConfig } from 'src/app/initialize/state/selector';
import { Breadcrumb } from 'src/app/components/breadcrumb/breadcrumb';
import { ImageBlock } from 'src/app/components/image-block/image-block';
import { CompiledCardsContainer, DataCardAction } from 'src/app/components/card/model';
import { CardActionsService } from 'src/app/shared/services/card-actions.service';
import { Card } from 'src/app/components/card/card';
import {
  getServiceCardsConfigById,
  getServiceCardsItems,
} from 'src/app/shared/utility/cards.utils';

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
    Card,
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
  private cardActionsService = inject(CardActionsService);

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
      .map((appointment) => ({
        ...appointment,
        dateTime: new Date(appointment.dateTime),
      }))
      .filter((appointment) => isFuture(new Date(appointment.dateTime)))
      .sort((a, b) => compareAsc(new Date(a.dateTime), new Date(b.dateTime)));
  });

  readonly pastReservations = computed(() => {
    const appointments = this.bookingsList()?.appointments ?? [];
    return appointments
      .map((appointment) => ({
        ...appointment,
        dateTime: new Date(appointment.dateTime),
      }))
      .filter((appointment) => isPast(new Date(appointment.dateTime)))
      .sort((a, b) => compareDesc(new Date(a.dateTime), new Date(b.dateTime)));
  });

  readonly cardsSectionItems = computed<any[]>(() => {
    return getServiceCardsItems(this.pageConfig()?.sections, '/bookings-hero');
  });

  readonly cardsConfig = computed<any>(() =>
    getServiceCardsConfigById(this.cardsSectionItems(), 'appointment-cards', '/bookings-hero'),
  );

  private buildCardsContainer(
    appointments: (Omit<Availability, 'dateTime'> & { dateTime: Date | number | string })[],
  ): CompiledCardsContainer {
    const cardsConfig = this.cardsConfig();
    if (!cardsConfig) return { items: [] };

    const templateCard = cardsConfig.items?.[0];
    return {
      ...cardsConfig,
      items: (appointments ?? []).map((appointment: any, index: number) => {
        const compiledActions = this.cardActionsService.compileActions(
          appointment,
          templateCard?.actions as DataCardAction[] | undefined,
          {
            callbackContext: this,
            callbackArgsMode: 'sourceAndParams',
          },
        );
        return {
          ...appointment,
          ...templateCard,
          id: `card-${index + 1}`,
          type: 'data',
          actions: compiledActions,
        } as any;
      }),
    };
  }

  readonly renderedCardsConfigFutureReservations = computed<CompiledCardsContainer>(() => {
    return this.buildCardsContainer(this.futureReservations());
  });

  readonly renderedCardsConfigPastReservations = computed<CompiledCardsContainer>(() => {
    return this.buildCardsContainer(this.pastReservations());
  });

  goToDetails(appointment: Availability) {
    this.router.navigate([`details`], {
      relativeTo: this.activatedRoute,
      queryParams: { id: appointment.id },
    });
  }

  newBooking() {
    this.router.navigate(['new'], { relativeTo: this.activatedRoute });
    this.store.dispatch(setActiveStep({ step: BookingStepId.SelectBookingType }));
  }
}
