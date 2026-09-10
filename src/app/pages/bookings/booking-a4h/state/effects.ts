import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, tap, take, withLatestFrom } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ItNotificationService, NotificationPosition } from 'design-angular-kit';

import { SmartHospitalState } from 'src/app/store/reducers';
import { selectSelectedStruttura } from 'src/app/pages/bookings/booking-a4h/state/struttura/struttura.selectors';

import { BookingUnifiedModalService } from '../booking-unified-modal.service';
import { BookingUnifiedService } from './service';
import * as BookingUnifiedActions from './actions';
import {
  selectActiveStep,
  selectAvailableListToBook,
  selectBookingType,
  selectIsOptimized,
  selectLockAppointmentResponse,
  selectNreInfo,
  selectSelectedDoctor,
  selectSelectedMedicalService,
  selectServicesList,
} from './selectors';
import { BookingStepKey, BOOKING_FLOW_CODES, BookingType, stepsFor } from '../models/booking-type';

/**
 * One entry per requested service, duplicates included: the same service can be
 * prescribed twice (e.g. two identical NRE lines) and needs two distinct
 * appointments, so entries are keyed by `hash` instead of by service id.
 */
function toBookList(requestedServiceIds: string[], availableIds: string[]) {
  const requested = requestedServiceIds.filter((id) => availableIds.includes(id));
  return (requested.length ? requested : availableIds).map((id, i) => ({
    id,
    status: 'TO_BOOK',
    hash: `${id}-${i}`,
  }));
}

@Injectable()
export class BookingUnifiedEffects {
  constructor() {}
  private actions$ = inject(Actions);
  private bookingService = inject(BookingUnifiedService);
  private store = inject(Store<SmartHospitalState>);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private modalService = inject(BookingUnifiedModalService);
  private readonly notificationService = inject(ItNotificationService);

  private notifyError(titleKey: string, descriptionKey: string, options?: { okKey?: string }) {
    this.modalService.openInfo(titleKey, descriptionKey, undefined, undefined, options?.okKey);
  }

  private notifyErrorGeneral() {
    this.notificationService.error(
      this.translate.instant('commons.error'),
      this.translate.instant('commons.generic-error'),
      true,
      8000,
      NotificationPosition.Top,
    );
  }

  private stepIndex(bookingType: BookingType | null, key: BookingStepKey): number {
    return stepsFor(bookingType).indexOf(key);
  }

  findPrescriptionByNre$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingUnifiedActions.findPrescriptionByNre),
      withLatestFrom(this.store.select(selectBookingType)),
      concatMap(([action, bookingType]) =>
        this.bookingService.findPrescriptionByNre(action.payload).pipe(
          map((data) => {
            if (!data) {
              this.notifyError('commons.error', 'commons.generic-error');
              return BookingUnifiedActions.findPrescriptionByNreSuccess({ data });
            }

            const continueToSelectService = () =>
              this.store.dispatch(
                BookingUnifiedActions.setActiveStep({
                  step: this.stepIndex(bookingType, BookingStepKey.SelectService),
                }),
              );

            if (data.prescription.serviceRequestList?.length > 1) {
              this.modalService.openInfo(
                'booking-a4h.warning',
                'booking-a4h.multipleServices',
                undefined,
                continueToSelectService,
                'booking-a4h.understood',
              );
            } else {
              continueToSelectService();
            }
            return BookingUnifiedActions.findPrescriptionByNreSuccess({ data });
          }),
          catchError((error) => {
            this.notifyError('commons.error', 'commons.generic-error');
            return of(BookingUnifiedActions.findPrescriptionByNreFailure({ error }));
          }),
        ),
      ),
    ),
  );

  getServicesList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingUnifiedActions.getServicesList),
      concatMap((action) =>
        this.bookingService.getServicesList(action.filter).pipe(
          map((data) => {
            if (action.advanceStepOnLoad) {
              if (data.length) {
                this.store
                  .select(selectBookingType)
                  .pipe(
                    take(1),
                    tap((bookingType) =>
                      this.store.dispatch(
                        BookingUnifiedActions.setActiveStep({
                          step: this.stepIndex(bookingType, BookingStepKey.SelectMedicalService),
                        }),
                      ),
                    ),
                  )
                  .subscribe();
              } else {
                this.notifyError('booking-a4h.warning', 'booking-a4h.noServicesForDoctor', {
                  okKey: 'booking-a4h.understood',
                });
              }
            }
            return BookingUnifiedActions.getServicesListSuccess({ data });
          }),
          catchError((error) => {
            this.notifyErrorGeneral();
            return of(BookingUnifiedActions.getServicesListFailure({ error }));
          }),
        ),
      ),
    ),
  );

  getDoctorsList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingUnifiedActions.getDoctorsList),
      withLatestFrom(this.store.select(selectBookingType)),
      concatMap(([action, bookingType]) =>
        this.bookingService.getDoctorsList(action.serviceIds).pipe(
          map((data) => {
            if (action.advanceStepOnLoad) {
              this.store.dispatch(
                BookingUnifiedActions.setActiveStep({
                  step: this.stepIndex(bookingType, BookingStepKey.SelectDoctor),
                }),
              );
            }
            return BookingUnifiedActions.getDoctorsListSuccess({ data });
          }),
          catchError((error) => {
            this.notifyErrorGeneral();
            return of(BookingUnifiedActions.getDoctorsListFailure({ error }));
          }),
        ),
      ),
    ),
  );

  createSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingUnifiedActions.createSession),
      withLatestFrom(this.store.select(selectBookingType)),
      concatMap(([action, bookingType]) =>
        this.bookingService.createSession(action.payload).pipe(
          map((data) => {
            // WithDocSelect still needs the doctor picked; the others can search availability right away.
            if (bookingType === BookingType.WithDocSelect) {
              this.store.dispatch(
                BookingUnifiedActions.getDoctorsList({
                  serviceIds: action.payload.serviceIds,
                  advanceStepOnLoad: true,
                }),
              );
            } else {
              this.dispatchFindForAvailableDays(data.sessionId, action.payload.serviceIds);
            }
            return BookingUnifiedActions.createSessionSuccess({ data });
          }),
          catchError((error) => {
            this.notifyErrorGeneral();
            return of(BookingUnifiedActions.createSessionFailure({ error }));
          }),
        ),
      ),
    ),
  );

  private dispatchFindForAvailableDays(sessionId: string, serviceIds: string[]) {
    combineLatest([
      this.store.select(selectSelectedStruttura),
      this.store.select(selectSelectedDoctor),
    ])
      .pipe(
        take(1),
        tap(([struttura, selectedDoctor]) => {
          this.store.dispatch(
            BookingUnifiedActions.findForAvailableDays({
              payload: {
                sessionId,
                from: new Date(),
                to: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
                serviceIds,
                unitId: struttura?.id ? [struttura.id] : undefined,
                physicianId: selectedDoctor?.id,
              },
            }),
          );
        }),
      )
      .subscribe();
  }

  find$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingUnifiedActions.findForAvailableDays),
      withLatestFrom(this.store.select(selectSelectedStruttura)),
      concatMap(([action, struttura]) => {
        // Re-read the facility at call time: callers may have captured it before selection.
        const payload = {
          ...action.payload,
          unitId: action.payload.unitId ?? (struttura?.id ? [struttura.id] : undefined),
        };
        return this.bookingService.find(payload).pipe(
          map((data) => {
            this.store.dispatch(
              BookingUnifiedActions.checkAvailableDays({
                sessionId: data.sessionId,
              }),
            );
            return BookingUnifiedActions.findForAvailableDaysSuccess({ data });
          }),
          catchError((error) => {
            this.notifyErrorGeneral();
            return of(BookingUnifiedActions.findForAvailableDaysFailure({ error }));
          }),
        );
      }),
    ),
  );

  checkAvailableDays$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingUnifiedActions.checkAvailableDays),
      withLatestFrom(this.store.select(selectBookingType), this.store.select(selectNreInfo)),
      concatMap(([action, bookingType, nreInfo]) => {
        const useNre = bookingType === BookingType.Ssn && nreInfo;
        const call$ = useNre
          ? this.bookingService.checkAvailableDays(
              action.sessionId,
              nreInfo!.prescriptionId,
              nreInfo!.fiscalCode,
            )
          : this.bookingService.checkAvailableDays(action.sessionId);

        return call$.pipe(
          map((response) => {
            const dateTimeStep = this.stepIndex(bookingType, BookingStepKey.DateTime);

            if (response && response.status === 200 && response.body?.status === 'OK') {
              combineLatest([
                this.store.select(selectSelectedMedicalService),
                this.store.select(selectActiveStep),
                this.store.select(selectAvailableListToBook),
              ])
                .pipe(
                  take(1),
                  tap(([selectedMedicalService, activeStep, availableListToBook]) => {
                    // Solo al primo ingresso nello step data/ora: nel giro multi-appuntamento
                    // ogni prestazione viene prenotata singolarmente e l'avviso non va mostrato.
                    const firstEntry = activeStep < dateTimeStep && !availableListToBook?.length;
                    if (selectedMedicalService?.length > 1 && firstEntry) {
                      this.modalService.openConfirm({
                        titleKey: 'booking-a4h.warning',
                        bodyKey: 'booking-a4h.singleAppointmentOptimized',
                        cancelKey: 'booking-a4h.cancel',
                        confirmKey: 'booking-a4h.proceed',
                        onConfirm: () =>
                          this.store.dispatch(
                            BookingUnifiedActions.setActiveStep({
                              step: dateTimeStep,
                            }),
                          ),
                      });
                    } else {
                      this.store.dispatch(
                        BookingUnifiedActions.setActiveStep({
                          step: dateTimeStep,
                        }),
                      );
                    }
                  }),
                )
                .subscribe();

              return BookingUnifiedActions.checkAvailableDaysSuccess({
                data: response.body,
              });
            } else if (response && response.status === 204) {
              this.store.dispatch(BookingUnifiedActions.setIsOptimized({ isOptimized: false }));
              combineLatest([
                this.store.select(selectSelectedMedicalService),
                this.store.select(selectSelectedStruttura),
              ])
                .pipe(
                  take(1),
                  tap(([serviceIds, struttura]) => {
                    // Con una sola prestazione non c'è nulla da spezzare in più appuntamenti:
                    // ripetere check-availability porterebbe a un giro infinito find -> 204 -> check-availability.
                    if (serviceIds.length < 2) {
                      this.notifyError('booking-a4h.warningExcl', 'booking-a4h.noAvailability');
                      return;
                    }
                    this.modalService.openConfirm({
                      titleKey: 'booking-a4h.warning',
                      bodyKey: 'booking-a4h.multipleAppointments',
                      cancelKey: 'booking-a4h.cancel',
                      confirmKey: 'booking-a4h.proceed',
                      onConfirm: () =>
                        this.store.dispatch(
                          BookingUnifiedActions.checkAvailability({
                            payload: {
                              bookingFlow: BOOKING_FLOW_CODES[bookingType!],
                              serviceIds,
                              unitId: struttura?.id,
                              nre: useNre ? nreInfo!.prescriptionId : undefined,
                              taxCode: useNre ? nreInfo!.fiscalCode : undefined,
                            },
                          }),
                        ),
                    });
                  }),
                )
                .subscribe();
            }
            return BookingUnifiedActions.checkAvailableDaysSuccess({
              data: response.body!,
            });
          }),
          catchError((error) => {
            this.notifyError(
              error.status === 417 ? 'booking-a4h.warningExcl' : 'booking-a4h.errorExcl',
              error.status === 417 ? 'booking-a4h.noAvailability' : 'commons.generic-error',
            );
            return of(BookingUnifiedActions.checkAvailableDaysFailure({ error }));
          }),
        );
      }),
    ),
  );

  lock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingUnifiedActions.lockAppointment),
      withLatestFrom(this.store.select(selectBookingType)),
      concatMap(([action, bookingType]) =>
        this.bookingService.lock(action.payload).pipe(
          map((data) => {
            this.store.dispatch(
              BookingUnifiedActions.setActiveStep({
                step: this.stepIndex(bookingType, BookingStepKey.Review),
              }),
            );
            return BookingUnifiedActions.lockAppointmentSuccess({ data });
          }),
          catchError((error) => {
            this.notifyError('booking-a4h.error', 'commons.generic-error');
            return of(BookingUnifiedActions.lockAppointmentFailure({ error }));
          }),
        ),
      ),
    ),
  );

  releaseLockBookingSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingUnifiedActions.releaseLockBookingSession),
      concatMap((action) =>
        this.bookingService.releaseLockBookingSession(action.payload).pipe(
          map((data) => BookingUnifiedActions.releaseLockBookingSessionSuccess({ data })),
          catchError((error) => {
            this.notifyErrorGeneral();
            return of(BookingUnifiedActions.releaseLockBookingSessionFailure({ error }));
          }),
        ),
      ),
    ),
  );

  book$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingUnifiedActions.bookAppointment),
      withLatestFrom(this.store.select(selectBookingType)),
      concatMap(([action, bookingType]) =>
        this.bookingService.book(action.payload).pipe(
          map((data) => {
            this.store
              .select(selectIsOptimized)
              .pipe(
                take(1),
                tap((isOptimized) => {
                  if (isOptimized) {
                    this.router.navigate(['booking-a4h', bookingType, 'confirmed-booking']);
                  } else {
                    combineLatest([
                      this.store.select(selectLockAppointmentResponse),
                      this.store.select(selectAvailableListToBook),
                    ])
                      .pipe(
                        take(1),
                        tap(([lockAppointmentResponse, availableListToBook]) => {
                          if (availableListToBook) {
                            const targetId =
                              lockAppointmentResponse?.appointment?.serviceDescriptionList?.[0]?.id;
                            // Only the first pending entry: the same service id can appear
                            // more than once (prescriptions with repeated services).
                            const firstMatchIndex = availableListToBook.findIndex(
                              (el: any) => el.status === 'TO_BOOK' && el.id === targetId,
                            );
                            const newList = availableListToBook.map((el: any, index: number) =>
                              index === firstMatchIndex
                                ? {
                                    ...el,
                                    status: 'BOOKED',
                                    bookInfo: data.appointment,
                                  }
                                : el,
                            );
                            this.store.dispatch(
                              BookingUnifiedActions.setAvailableListToBook({
                                payload: newList,
                              }),
                            );
                          }
                        }),
                      )
                      .subscribe();
                  }
                }),
              )
              .subscribe();
            return BookingUnifiedActions.bookAppointmentSuccess({ data });
          }),
          catchError((error) => {
            this.notifyErrorGeneral();
            return of(BookingUnifiedActions.bookAppointmentFailure({ error }));
          }),
        ),
      ),
    ),
  );

  checkAvailability$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingUnifiedActions.checkAvailability),
      withLatestFrom(
        this.store.select(selectSelectedStruttura),
        this.store.select(selectServicesList),
      ),
      concatMap(([action, struttura, servicesList]) => {
        // Re-read the facility at call time: the action can be dispatched from a
        // dialog confirmAction created earlier, whose captured unitId may be stale/undefined.
        const payload = {
          ...action.payload,
          unitId: action.payload.unitId ?? struttura?.id,
        };
        return this.bookingService.checkAvailability(payload).pipe(
          map((data) => {
            const available = data.services.filter((s) => s.available);
            const unavailable = data.services.filter((s) => !s.available);
            const toBook = toBookList(
              payload.serviceIds,
              available.map((s) => s.service),
            );

            if (available.length && unavailable.length) {
              const serviceName = (service: (typeof data.services)[number]) =>
                service.name ??
                servicesList.find((item) => item.id === service.service)?.name ??
                service.service;

              this.modalService.openConfirmText({
                titleKey: 'booking-a4h.warning',
                body: `${this.translate.instant('booking-a4h.partialUnavailability')} <br> - ${unavailable
                  .map(serviceName)
                  .join('<br> - ')}.<br> <strong>${this.translate.instant(
                  'booking-a4h.bookAvailableQuestion',
                )}</strong> <br> - ${available.map(serviceName).join(', <br> - ')}?`,
                cancelKey: 'booking-a4h.cancel',
                confirmKey: 'booking-a4h.proceed',
                onConfirm: () => {
                  this.store.dispatch(BookingUnifiedActions.resetMedicalService());
                  this.store.dispatch(
                    BookingUnifiedActions.setAvailableListToBook({
                      payload: toBook,
                    }),
                  );
                },
              });
            } else if (available.length) {
              this.store.dispatch(BookingUnifiedActions.resetMedicalService());
              this.store.dispatch(
                BookingUnifiedActions.setAvailableListToBook({
                  payload: toBook,
                }),
              );
            } else {
              this.notifyError('booking-a4h.warning', 'booking-a4h.noneAvailable');
            }
            return BookingUnifiedActions.checkAvailabilitySuccess({ data });
          }),
          catchError((error) => {
            this.notifyErrorGeneral();
            return of(BookingUnifiedActions.checkAvailabilityFailure({ error }));
          }),
        );
      }),
    ),
  );

  getHealthCareUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingUnifiedActions.getHealthCareUnit),
      concatMap(() =>
        this.bookingService.getHealthCareUnit().pipe(
          map((data) => BookingUnifiedActions.getHealthCareUnitSuccess({ data })),
          catchError((error) => {
            this.notifyErrorGeneral();
            return of(BookingUnifiedActions.getHealthCareUnitFailure({ error }));
          }),
        ),
      ),
    ),
  );

  mergePdfByUrls$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingUnifiedActions.mergePdfByUrls),
      concatMap((action) =>
        this.bookingService.mergePdfByUrls(action.payload).pipe(
          map((data) => BookingUnifiedActions.mergePdfByUrlsSuccess({ data })),
          catchError((error) => {
            // Log the error but don't dispatch a notification - the PDF merge is optional
            console.error('mergePdfByUrls error:', error);
            return of(BookingUnifiedActions.mergePdfByUrlsFailure({ error }));
          }),
        ),
      ),
    ),
  );
}
