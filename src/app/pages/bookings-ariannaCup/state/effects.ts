import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, withLatestFrom, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { BookingsService } from './service';
import {
  deleteBooking,
  deleteBookingFailure,
  deleteBookingSuccess,
  fetchBookingList,
  fetchBookingListFailure,
  fetchBookingListSuccess,
  // fetchCardMultiUseConfigBookingList,
  // fetchCardMultiUseConfigBookingListFailure,
  // fetchCardMultiUseConfigBookingListSuccess,
  fetchPrivateBookingList,
  fetchPrivateBookingListFailure,
  fetchPrivateBookingListSuccess,
  findOtherAvailability,
  findOtherAvailabilityFailure,
  findOtherAvailabilitySuccess,
  findFirstAvailability,
  findFirstAvailabilityFailure,
  findFirstAvailabilitySuccess,
  reserve,
  reserveFailure,
  reserveSuccess,
  findPrivateListAvailabilitySuccess,
  findPrivateListAvailabilityFailure,
  findPrivateListAvailability,
  reserveHttp500,
} from './actions';
// import { CardMultiUseConfig } from 'src/app/components/card/card.model'
import { SmartHospitalState } from 'src/app/store/reducers';
import { Store } from '@ngrx/store';
import { selectUserPhoneNumber } from '../../user-profile/state/user-profile.selectors';
import { HttpErrorResponse } from '@angular/common/http';
import { ItNotificationService, NotificationPosition } from 'design-angular-kit';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class BookingsEffects {
  private actions$ = inject(Actions);
  private bookingsService = inject(BookingsService);
  private store = inject(Store<SmartHospitalState>);
  private readonly notificationService = inject(ItNotificationService);
  private translate = inject(TranslateService);

  // fetchCardMultiUseConfigBookingList$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(fetchCardMultiUseConfigBookingList),
  //     concatMap(() =>
  //       this.bookingsService.fetchCardMultiUseConfigBookingList().pipe(
  //         map((data: CardMultiUseConfig) =>
  //           fetchCardMultiUseConfigBookingListSuccess({
  //             data,
  //           }),
  //         ),
  //         catchError((error) =>
  //           of(
  //             fetchCardMultiUseConfigBookingListFailure({
  //               error,
  //             }),
  //           ),
  //         ),
  //       ),
  //     ),
  //   )
  // })

  fetchBookingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchBookingList),
      switchMap(({ request }) =>
        this.bookingsService.fetchBookingList(request).pipe(
          map((data) => fetchBookingListSuccess({ data })),
          catchError((error) => of(fetchBookingListFailure({ error }))),
        ),
      ),
    ),
  );

  deleteBooking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteBooking),
      mergeMap(({ request }) =>
        this.bookingsService.deleteBooking(request).pipe(
          map((data) => {
            this.notificationService.success(
              this.translate.instant('tenant.confirmationPopup.title'),
              this.translate.instant('tenant.confirmationPopup.text'),
              true,
              8000,
              NotificationPosition.Top,
            );
            return deleteBookingSuccess({ data });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('tenant.errorPopup.title'),
              this.translate.instant('tenant.errorPopup.text'),
              true,
              8000,
              NotificationPosition.Top,
            );
            return of(deleteBookingFailure({ error }));
          }),
        ),
      ),
    ),
  );
  deleteBookingSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteBookingSuccess),
      withLatestFrom(this.store.select(selectUserPhoneNumber)),
      map(([, phone]) => fetchBookingList({ request: { telefonoIntestatario: phone ?? '' } })),
    ),
  );

  findFirstAvailability$ = createEffect(() =>
    this.actions$.pipe(
      ofType(findFirstAvailability),
      switchMap(({ request }) =>
        this.bookingsService.findFirstAvailability(request).pipe(
          map((data) => findFirstAvailabilitySuccess({ data })),
          catchError((error) => of(findFirstAvailabilityFailure({ error }))),
        ),
      ),
    ),
  );

  findOtherAvailability$ = createEffect(() =>
    this.actions$.pipe(
      ofType(findOtherAvailability),
      switchMap(({ request }) =>
        this.bookingsService.findOtherAvailability(request).pipe(
          map((data) => findOtherAvailabilitySuccess({ data })),
          catchError((error) => of(findOtherAvailabilityFailure({ error }))),
        ),
      ),
    ),
  );

  reserve$ = createEffect(() =>
    this.actions$.pipe(
      ofType(reserve),
      switchMap(({ request }) =>
        this.bookingsService.reserve(request).pipe(
          map((data) => reserveSuccess({ data })),
          catchError((err: unknown) => {
            const httpErr = err as HttpErrorResponse;
            return of(
              reserveFailure({
                error: {
                  httpStatus: httpErr.status,
                },
              }),
            );
          }),
        ),
      ),
    ),
  );
  reserveHttp500$ = createEffect(() =>
    this.actions$.pipe(
      ofType(reserveFailure),
      filter(({ error }) => error?.httpStatus === 500),
      map(() => reserveHttp500()),
    ),
  );

  fetchPrivateBookingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchPrivateBookingList),
      switchMap(({ request }) =>
        this.bookingsService.fetchPrivateBookingList(request).pipe(
          map((data) => fetchPrivateBookingListSuccess({ data })),
          catchError((error) => of(fetchPrivateBookingListFailure({ error }))),
        ),
      ),
    ),
  );

  findPrivateAvailability$ = createEffect(() =>
    this.actions$.pipe(
      ofType(findPrivateListAvailability),
      switchMap(({ request }) =>
        this.bookingsService
          .findPrivateAvailability(request.codRegPrest, request.descPrest, request.idAgenda)
          .pipe(
            map((data) => findPrivateListAvailabilitySuccess({ data })),
            catchError((error) => of(findPrivateListAvailabilityFailure({ error }))),
          ),
      ),
    ),
  );

  constructor() {}
}
