import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ItNotificationService, NotificationPosition } from 'design-angular-kit';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, tap } from 'rxjs/operators';
import { BookingUnifiedModalService } from '../../booking-unified-modal.service';
import * as AppointmentsActions from './actions';
import { AppointmentsService } from './service';

const APPOINTMENTS_LIST_ROUTE = ['booking-a4h', 'appointments'];

@Injectable()
export class AppointmentsA4hEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly appointmentsService = inject(AppointmentsService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly modalService = inject(BookingUnifiedModalService);
  private readonly notificationService = inject(ItNotificationService);

  fetchAppointments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentsActions.fetchAppointments),
      switchMap(() =>
        this.appointmentsService.fetchAppointments().pipe(
          map((response) => {
            if (response.status !== 200 && response.status !== 204) {
              throw new Error(`Unexpected status ${response.status}`);
            }
            return AppointmentsActions.fetchAppointmentsSuccess({
              appointments: response.body?.appointments ?? [],
            });
          }),
          catchError((error) => of(AppointmentsActions.fetchAppointmentsFailure({ error }))),
        ),
      ),
    ),
  );

  deleteAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentsActions.deleteAppointment),
      exhaustMap(({ appointment }) =>
        this.appointmentsService.deleteAppointment(appointment).pipe(
          map(() =>
            AppointmentsActions.deleteAppointmentSuccess({ appointmentId: appointment.id }),
          ),
          catchError((error) => of(AppointmentsActions.deleteAppointmentFailure({ error }))),
        ),
      ),
    ),
  );

  deleteAppointmentSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AppointmentsActions.deleteAppointmentSuccess),
        tap(() => {
          this.notificationService.success(
            this.translate.instant('appointments.details-page.delete-appointments-confirm-title'),
            this.translate.instant('appointments.details-page.delete-appointments-confirm-message'),
            true,
            8000,
            NotificationPosition.Top,
          );
          this.router.navigate(APPOINTMENTS_LIST_ROUTE, { replaceUrl: true });
        }),
      ),
    { dispatch: false },
  );

  deleteAppointmentFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AppointmentsActions.deleteAppointmentFailure),
        tap(() =>
          this.modalService.openInfo(
            'appointments.warning',
            'appointments.details-page.delete-popup-not-cancellable-message',
          ),
        ),
      ),
    { dispatch: false },
  );

  requestCheckIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentsActions.requestCheckIn),
      exhaustMap(({ appointment }) =>
        this.appointmentsService.requestCheckIn(appointment).pipe(
          map((checkInTicket) => AppointmentsActions.requestCheckInSuccess({ checkInTicket })),
          catchError((error) => of(AppointmentsActions.requestCheckInFailure({ error }))),
        ),
      ),
    ),
  );

  requestCheckInSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentsActions.requestCheckInSuccess),
      map(() => {
        this.modalService.openInfo(
          'appointments.check-in-success-popup.title',
          'appointments.check-in-success-popup.text',
          undefined,
          () =>
            this.router.navigate(APPOINTMENTS_LIST_ROUTE, {
              replaceUrl: true,
              queryParams: { acceptance: true },
            }),
          'appointments.continue',
        );
        // lo stato di accettazione cambia lato server: la lista va ricaricata
        return AppointmentsActions.fetchAppointments();
      }),
    ),
  );

  requestCheckInFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AppointmentsActions.requestCheckInFailure),
        tap(() =>
          this.modalService.openInfo(
            'commons.error',
            'appointments.check-in-popup.failure-message',
            undefined,
            undefined,
            'commons.close',
          ),
        ),
      ),
    { dispatch: false },
  );

  moveAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentsActions.moveAppointment),
      exhaustMap(({ payload }) =>
        this.appointmentsService.moveAppointment(payload).pipe(
          map(() => AppointmentsActions.moveAppointmentSuccess()),
          catchError((error) => of(AppointmentsActions.moveAppointmentFailure({ payload, error }))),
        ),
      ),
    ),
  );

  moveAppointmentSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AppointmentsActions.moveAppointmentSuccess),
        tap(() =>
          this.modalService.openInfo(
            'appointments.edit-success-popup.title',
            'appointments.edit-success-popup.text',
            undefined,
            () => this.router.navigate(APPOINTMENTS_LIST_ROUTE, { replaceUrl: true }),
          ),
        ),
      ),
    { dispatch: false },
  );

  moveAppointmentFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AppointmentsActions.moveAppointmentFailure),
        tap(({ payload, error }) => {
          const reason =
            error instanceof HttpErrorResponse && [406, 417].includes(error.status)
              ? error.status
              : 'unknown';
          this.modalService.openConfirm({
            titleKey: 'appointments.edit-appointment-popup.title',
            bodyKey: `appointments.edit-appointment-error.${reason}`,
            cancelKey: 'commons.cancel',
            confirmKey: 'appointments.retry',
            onConfirm: () => this.store.dispatch(AppointmentsActions.moveAppointment({ payload })),
          });
        }),
      ),
    { dispatch: false },
  );
}
