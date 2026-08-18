import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, switchMap, take } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  addToCalendar,
  addToCalendarFailure,
  addToCalendarSuccess,
  bookAppointment,
  bookAppointmentFailure,
  bookAppointmentSuccess,
  cancelAppointment,
  cancelAppointmentFailure,
  cancelAppointmentSuccess,
  createSession,
  createSessionFailure,
  createSessionSuccess,
  createSessionWithAddress,
  createSessionWithAddressFailure,
  createSessionWithAddressSuccess,
  createThirdyPartSession,
  createThirdyPartSessionFailure,
  createThirdyPartSessionSuccess,
  fetchAvailableAppointments,
  fetchAvailableAppointmentsFailure,
  fetchAvailableAppointmentsSuccess,
  fetchAvailableDays,
  fetchAvailableDaysFailure,
  fetchAvailableDaysForRescheduleAppointment,
  fetchAvailableDaysForRescheduleAppointmentFailure,
  fetchAvailableDaysForRescheduleAppointmentSuccess,
  fetchAvailableDaysSuccess,
  fetchBookingByNre,
  fetchBookingByNreFailure,
  fetchBookingByNreSuccess,
  fetchBookingsList,
  fetchBookingsListFailure,
  fetchBookingsListSuccess,
  fetchCitiesList,
  fetchCitiesListFailure,
  fetchCitiesListSuccess,
  fetchConsents,
  fetchConsentsFailure,
  fetchConsentsSuccess,
  fetchDelegaTypesList,
  fetchDelegaTypesListFailure,
  fetchDelegaTypesListSuccess,
  fetchHealthcareUnits,
  fetchHealthcareUnitsFailure,
  fetchHealthcareUnitsSuccess,
  fetchNations,
  fetchNationsFailure,
  fetchNationsSuccess,
  fetchPersonInfo,
  fetchPersonInfoFailure,
  fetchPersonInfoSuccess,
  fetchPhysicianByService,
  fetchPhysicianByServiceFailure,
  fetchPhysicianByServiceSuccess,
  fetchProvincesList,
  fetchProvincesListFailure,
  fetchProvincesListSuccess,
  fetchServiceList,
  fetchServiceListFailure,
  fetchServiceListSuccess,
  findByFiscalCode,
  findByFiscalCodeFailure,
  findByFiscalCodeSuccess,
  findPrescription,
  findPrescriptionFailure,
  findPrescriptionSuccess,
  initBookingFromMissingData,
  initBookingFromMissingDataFailure,
  initBookingFromMissingDataSuccess,
  initThirdBooking,
  initThirdBookingFailure,
  initThirdBookingSuccess,
  lockAppointment,
  lockAppointmentFailure,
  lockAppointmentSuccess,
  lockDateToExpire,
  lockDateToExpireFailure,
  lockDateToExpireSuccess,
  moveAppointment,
  moveAppointmentFailure,
  moveAppointmentSuccess,
  printMemo,
  printMemoFailure,
  printMemoSuccess,
  restartLp,
  restartLpFailure,
  restartLpSuccess,
  sendEmailNotification,
  sendEmailNotificationFailure,
  sendEmailNotificationSuccess,
  setActiveStep,
  setSummaryBooking,
  unlockSession,
  unlockSessionFailure,
  unlockSessionSuccess,
  updateConsents,
  updateConsentsFailure,
  updateConsentsSuccess,
} from './actions';
import { Store } from '@ngrx/store';
import { BookingsHeroService } from './service';
import { SmartHospitalState } from 'src/app/store/reducers';
import { selectBookingHeroSummary } from './selectors';
import { BookingStepId } from './model';
import { ActivatedRoute, Router } from '@angular/router';
import { ItNotificationService, NotificationPosition } from 'design-angular-kit';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class BookingsHeroEffects {
  private actions$ = inject(Actions);
  private bookingsHeroService = inject(BookingsHeroService);
  private store = inject(Store<SmartHospitalState>);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private readonly notificationService = inject(ItNotificationService);
  private translate = inject(TranslateService);

  findByFiscalCode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(findByFiscalCode),
      switchMap((action) =>
        this.bookingsHeroService.findByFiscalCode(action.payload).pipe(
          map((data) => {
            console.log('+++data', data);

            if (data) {
              this.store
                .select(selectBookingHeroSummary)
                .pipe(
                  take(1),
                  map((summary) => {
                    if (summary?.bookingType === 'nre') {
                      this.store.dispatch(findPrescription({ payload: action.payload }));
                    }
                    if (summary?.bookingType === 'free_prof') {
                      this.store.dispatch(
                        createSession({
                          serviceIds: summary?.services
                            ?.map((service) => service.id)
                            .filter((id): id is string => !!id)!,
                        }),
                      );
                    }
                    if (
                      summary &&
                      summary?.bookingType === 'free_prof_delegate' &&
                      summary?.delega?.bookingPersonForm
                    ) {
                      const payload = {
                        serviceIds: summary?.services
                          ?.map((service) => service.id)
                          .filter((id): id is string => !!id)!,
                        physicianId: summary.physician?.id!,
                        patientAddress: {
                          province: summary.delega?.bookingPersonForm?.currentProvince, //paziente  (residenza)
                          nation: 'IT', //paziente (residenza)
                          cap: summary.delega.bookingPersonForm.currentCityCap, //paziente  (residenza)
                          residentialAddress: summary.delega.bookingPersonForm.address, //paziente (residenza)
                          houseNumber: summary.delega.bookingPersonForm.houseNumber, //paziente (residenza)
                          cityOfResidence: summary.delega.bookingPersonForm.currentCity, //paziente (residenza)
                        },
                        delegatePatient: {
                          //paziente
                          fiscalCode: summary.delega.bookingPersonForm.taxCode.toUpperCase(),
                          firstName: summary.delega.bookingPersonForm.firstName,
                          lastName: summary.delega.bookingPersonForm.lastName,
                          birthDate: summary.delega.bookingPersonForm.birthDate,
                          email: summary.userEmail!, //del user
                          phoneNumber: summary.userPhoneNumber!, //del user
                        },
                        delegationType: summary.delega.delegateType,
                        delegatorFiscalCode: summary.userFiscalCode?.toUpperCase()!, //user
                      };

                      this.store.dispatch(createThirdyPartSession({ payload }));
                    }
                  }),
                )
                .subscribe();
            } else {
              this.store
                .select(selectBookingHeroSummary)
                .pipe(
                  take(1),
                  map((summary) => {
                    if (summary?.bookingType === 'free_prof_delegate') {
                      if (summary?.delega?.bookingPersonForm) {
                        const payload = {
                          serviceIds: summary?.services
                            ?.map((service) => service.id)
                            .filter((id): id is string => !!id)!,
                          physicianId: summary.physician?.id!,
                          patientAddress: {
                            province: summary.delega?.bookingPersonForm?.currentProvince, //paziente  (residenza)
                            nation: 'IT', //paziente (residenza)
                            cap: summary.delega.bookingPersonForm.currentCityCap, //paziente  (residenza)
                            residentialAddress: summary.delega.bookingPersonForm.address, //paziente (residenza)
                            houseNumber: summary.delega.bookingPersonForm.houseNumber, //paziente (residenza)
                            cityOfResidence: summary.delega.bookingPersonForm.currentCity, //paziente (residenza)
                          },
                          delegatePatient: {
                            //paziente
                            fiscalCode: summary.delega.bookingPersonForm.taxCode.toUpperCase(),
                            firstName: summary.delega.bookingPersonForm.firstName,
                            lastName: summary.delega.bookingPersonForm.lastName,
                            birthDate: summary.delega.bookingPersonForm.birthDate,
                            email: summary.userEmail!, //del user
                            phoneNumber: summary.userPhoneNumber!, //del user
                          },
                          delegationType: summary.delega.delegateType,
                          delegatorFiscalCode: summary.userFiscalCode?.toUpperCase()!, //user
                        };

                        this.store.dispatch(createThirdyPartSession({ payload }));
                      }
                    } else {
                      this.store.dispatch(setActiveStep({ step: BookingStepId.MissingData }));
                    }
                  }),
                )
                .subscribe();
            }
            return findByFiscalCodeSuccess({ data });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );

            return of(findByFiscalCodeFailure({ error }));
          }),
        ),
      ),
    ),
  );

  fetchPersonInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchPersonInfo),
      switchMap((action) =>
        this.bookingsHeroService.fetchPersonInfo(action.payload).pipe(
          map((data) => {
            this.store.dispatch(setActiveStep({ step: BookingStepId.DelegaForms }));
            return fetchPersonInfoSuccess({ data });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );

            return of(fetchPersonInfoFailure({ error }));
          }),
        ),
      ),
    ),
  );

  initThirdBooking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(initThirdBooking),
      switchMap((action) =>
        this.bookingsHeroService.initThirdBooking(action.payload).pipe(
          map((data) => {
            const payload = {
              prescriptionId: data.prescription.id,
              sessionId: data.sessionId,
              maxResults: 100,
            };
            this.store.dispatch(fetchAvailableDays({ payload: payload }));
            this.store
              .select(selectBookingHeroSummary)
              .pipe(
                take(1),
                map((summary) => {
                  this.store.dispatch(
                    setSummaryBooking({
                      payload: {
                        ...summary,
                        prescriptionId: data.prescription.id,
                        sessionId: data.sessionId,
                        services: data.prescription?.serviceRequestList.map((el) => el.service),
                      },
                    }),
                  );
                }),
              )
              .subscribe();

            return initThirdBookingSuccess({ data });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );

            return of(initThirdBookingFailure({ error }));
          }),
        ),
      ),
    ),
  );

  findPrescription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(findPrescription),
      switchMap((action) =>
        this.bookingsHeroService.findPrescription(action.payload).pipe(
          map((data) => {
            const payload = {
              prescriptionId: data.prescription.id,
              sessionId: data.sessionId,
              maxResults: 100,
            };
            this.store.dispatch(fetchAvailableDays({ payload: payload }));
            this.store
              .select(selectBookingHeroSummary)
              .pipe(
                take(1),
                map((summary) => {
                  this.store.dispatch(
                    setSummaryBooking({
                      payload: {
                        ...summary,
                        prescriptionId: data.prescription.id,
                        sessionId: data.sessionId,
                        services: data.prescription?.serviceRequestList.map((el) => el.service),
                      },
                    }),
                  );
                }),
              )
              .subscribe();

            return findPrescriptionSuccess({ data });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );

            return of(findPrescriptionFailure({ error }));
          }),
        ),
      ),
    ),
  );

  createSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createSession),
      switchMap((action) =>
        this.bookingsHeroService.createSession(action.serviceIds).pipe(
          map((data) => {
            this.store
              .select(selectBookingHeroSummary)
              .pipe(
                take(1),
                map((summary) => {
                  const payload = {
                    serviceIds: summary?.services
                      ?.map((service) => service.id)
                      .filter((id): id is string => !!id),
                    sessionId: data.sessionId,
                    physicianId: summary?.physician?.id,
                    maxResults: 100,
                  };
                  (this.store.dispatch(fetchAvailableDays({ payload: payload })),
                    this.store.dispatch(
                      setSummaryBooking({
                        payload: {
                          ...summary,
                          sessionId: data.sessionId,
                          expireOn: data.expireOn,
                        },
                      }),
                    ));
                }),
              )
              .subscribe();

            return createSessionSuccess({ data });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );

            return of(createSessionFailure({ error }));
          }),
        ),
      ),
    ),
  );

  createSessionWithAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createSessionWithAddress),
      switchMap((action) =>
        this.bookingsHeroService.createSessionWithAddress(action.payload).pipe(
          map((data) => {
            this.store
              .select(selectBookingHeroSummary)
              .pipe(
                take(1),
                map((summary) => {
                  const payload = {
                    serviceIds: summary?.services
                      ?.map((service) => service.id)
                      .filter((id): id is string => !!id),
                    sessionId: data.sessionId,
                    physicianId: summary?.physician?.id,
                    maxResults: 100,
                  };
                  (this.store.dispatch(fetchAvailableDays({ payload: payload })),
                    this.store.dispatch(
                      setSummaryBooking({
                        payload: {
                          ...summary,
                          sessionId: data.sessionId,
                          expireOn: data.expireOn,
                        },
                      }),
                    ));
                }),
              )
              .subscribe();

            return createSessionWithAddressSuccess({ data });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );

            return of(createSessionWithAddressFailure({ error }));
          }),
        ),
      ),
    ),
  );

  createThirdyPartSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createThirdyPartSession),
      switchMap((action) =>
        this.bookingsHeroService.createThirdyPartSession(action.payload).pipe(
          map((data) => {
            this.store
              .select(selectBookingHeroSummary)
              .pipe(
                take(1),
                map((summary) => {
                  const payload = {
                    serviceIds: summary?.services
                      ?.map((service) => service.id)
                      .filter((id): id is string => !!id),
                    sessionId: data.sessionId,
                    physicianId: summary?.physician?.id,
                    maxResults: 100,
                  };
                  (this.store.dispatch(fetchAvailableDays({ payload: payload })),
                    this.store.dispatch(
                      setSummaryBooking({
                        payload: {
                          ...summary,
                          sessionId: data.sessionId,
                          expireOn: data.expireOn,
                        },
                      }),
                    ));
                }),
              )
              .subscribe();

            return createThirdyPartSessionSuccess({ data });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );

            return of(createThirdyPartSessionFailure({ error }));
          }),
        ),
      ),
    ),
  );

  fetchProvincesList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchProvincesList),
      switchMap(() =>
        this.bookingsHeroService.getProvincesList().pipe(
          map((data) => fetchProvincesListSuccess({ data })),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );

            return of(fetchProvincesListFailure({ error }));
          }),
        ),
      ),
    ),
  );

  fetchCitiesList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchCitiesList),
      switchMap((action) =>
        this.bookingsHeroService.getCitiesList(action.province).pipe(
          map((data) => fetchCitiesListSuccess({ data })),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );

            return of(fetchCitiesListFailure({ error }));
          }),
        ),
      ),
    ),
  );

  fetchHealthcareUnits$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchHealthcareUnits),
      switchMap(() =>
        this.bookingsHeroService.findAllHealthcareUnits().pipe(
          map((data) => fetchHealthcareUnitsSuccess({ data: data.healthcareUnits })),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );

            return of(fetchHealthcareUnitsFailure({ error }));
          }),
        ),
      ),
    ),
  );

  initBookingFromMissingData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(initBookingFromMissingData),
      switchMap((action) =>
        this.bookingsHeroService.initBookingFromMissingData(action.payload).pipe(
          map((data) => {
            const payload = {
              prescriptionId: data.prescription.id,
              sessionId: data.sessionId,
              maxResults: 100,
            };
            this.store.dispatch(fetchAvailableDays({ payload: payload }));
            this.store
              .select(selectBookingHeroSummary)
              .pipe(
                take(1),
                map((summary) => {
                  this.store.dispatch(
                    setSummaryBooking({
                      payload: {
                        ...summary,
                        prescriptionId: data.prescription.id,
                        sessionId: data.sessionId,
                        services: data.prescription?.serviceRequestList.map((el) => el.service),
                      },
                    }),
                  );
                }),
              )
              .subscribe();

            return initBookingFromMissingDataSuccess({ data });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );

            return of(initBookingFromMissingDataFailure({ error }));
          }),
        ),
      ),
    ),
  );

  fetchAvailableDays$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchAvailableDays),
      switchMap((action) =>
        this.bookingsHeroService.fetchAvailableDays(action.payload).pipe(
          map((data) => {
            this.store.dispatch(setActiveStep({ step: BookingStepId.AvailableDays }));
            return fetchAvailableDaysSuccess({ data: data.availableDays });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );

            return of(fetchAvailableDaysFailure({ error }));
          }),
        ),
      ),
    ),
  );

  fetchAvailableAppointments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchAvailableAppointments),
      switchMap((action) =>
        this.bookingsHeroService.fetchAvailableDays(action.payload, action.useCheck).pipe(
          map((data) => {
            this.store.dispatch(setActiveStep({ step: BookingStepId.AvailableAppointments }));
            return fetchAvailableAppointmentsSuccess({
              data: data.appointments || [],
            });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );
            return of(fetchAvailableAppointmentsFailure({ error }));
          }),
        ),
      ),
    ),
  );

  lockAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(lockAppointment),
      switchMap((action) =>
        this.bookingsHeroService.lock(action.payload).pipe(
          map((data) => {
            this.store
              .select(selectBookingHeroSummary)
              .pipe(
                take(1),
                map((summary) => {
                  this.store.dispatch(lockDateToExpire({ sessionId: summary?.sessionId! }));
                }),
              )
              .subscribe();

            return lockAppointmentSuccess({ data });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );
            return of(lockAppointmentFailure({ error }));
          }),
        ),
      ),
    ),
  );

  lockDateToExpire$ = createEffect(() =>
    this.actions$.pipe(
      ofType(lockDateToExpire),
      switchMap((action) =>
        this.bookingsHeroService.dateToExpire(action.sessionId).pipe(
          map((data) => {
            this.store
              .select(selectBookingHeroSummary)
              .pipe(
                take(1),
                map((summary) => {
                  this.store.dispatch(
                    setSummaryBooking({
                      payload: { ...summary, expireOn: data },
                    }),
                  );
                }),
              )
              .subscribe();
            this.store.dispatch(setActiveStep({ step: BookingStepId.Confirmation }));
            return lockDateToExpireSuccess({ data });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );
            return of(lockDateToExpireFailure({ error }));
          }),
        ),
      ),
    ),
  );

  bookAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(bookAppointment),
      switchMap((action) =>
        this.bookingsHeroService.book(action.sessionId).pipe(
          map((data) => {
            this.store.dispatch(setActiveStep({ step: BookingStepId.ConfirmedAppointment }));

            return bookAppointmentSuccess({ data });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );
            return of(bookAppointmentFailure({ error }));
          }),
        ),
      ),
    ),
  );

  fetchServiceList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchServiceList),
      switchMap((action) =>
        this.bookingsHeroService.fetchServicesByName(action.serviceName).pipe(
          map((data) => {
            return fetchServiceListSuccess({ data });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );
            return of(fetchServiceListFailure({ error }));
          }),
        ),
      ),
    ),
  );

  fetchPhysicianByService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchPhysicianByService),
      switchMap((action) =>
        this.bookingsHeroService.fetchPhysicianByService(action.serviceId).pipe(
          map((data) => {
            return fetchPhysicianByServiceSuccess({ data });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );
            return of(fetchPhysicianByServiceFailure({ error }));
          }),
        ),
      ),
    ),
  );

  fetchDelegateTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchDelegaTypesList),
      switchMap(() =>
        this.bookingsHeroService.fetchDelegateTypes().pipe(
          map((data) => {
            return fetchDelegaTypesListSuccess({ data });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );
            return of(fetchDelegaTypesListFailure({ error }));
          }),
        ),
      ),
    ),
  );

  fetchNations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchNations),
      switchMap(() =>
        this.bookingsHeroService.fetchNations().pipe(
          map((data) => {
            return fetchNationsSuccess({ data: data.items });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );
            return of(fetchNationsFailure({ error }));
          }),
        ),
      ),
    ),
  );

  fetchConsents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchConsents),
      switchMap(() =>
        this.bookingsHeroService.fetchConsents().pipe(
          map((data) => {
            return fetchConsentsSuccess({ data });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );
            return of(fetchConsentsFailure({ error }));
          }),
        ),
      ),
    ),
  );

  updateConsents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateConsents),
      switchMap((action) =>
        this.bookingsHeroService.updateConsents(action.payload).pipe(
          map(() => {
            return updateConsentsSuccess();
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );
            return of(updateConsentsFailure({ error }));
          }),
        ),
      ),
    ),
  );

  restartLp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(restartLp),
      switchMap((action) =>
        this.bookingsHeroService.restartLp(action.sessionId).pipe(
          map((data) => {
            this.store
              .select(selectBookingHeroSummary)
              .pipe(
                take(1),
                map((summary) => {
                  this.store.dispatch(
                    setSummaryBooking({
                      payload: {
                        ...summary,
                        sessionId: data.sessionId,
                        expireOn: data.expireOn,
                      },
                    }),
                  );
                }),
              )
              .subscribe();

            return restartLpSuccess({ data });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );
            return of(restartLpFailure({ error }));
          }),
        ),
      ),
    ),
  );

  unlockSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(unlockSession),
      switchMap((action) =>
        this.bookingsHeroService.unlockSession(action.sessionId).pipe(
          map(() => {
            return unlockSessionSuccess();
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );
            return of(unlockSessionFailure({ error }));
          }),
        ),
      ),
    ),
  );

  printMemo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(printMemo),
      switchMap((action) =>
        this.bookingsHeroService.printMemo(action.payload, action.isBook).pipe(
          map((data) => {
            console.log('Gestire Print PDF', data);

            return printMemoSuccess({ data });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );
            return of(printMemoFailure({ error }));
          }),
        ),
      ),
    ),
  );

  sendEmailNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sendEmailNotification),
      switchMap((action) =>
        this.bookingsHeroService.sendEmailNotification(action.payload, action.isBook).pipe(
          map((data) => {
            console.log('Gestire sendEmailNotification', data);

            return sendEmailNotificationSuccess({ data });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );
            return of(sendEmailNotificationFailure({ error }));
          }),
        ),
      ),
    ),
  );

  addToCalendar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addToCalendar),
      switchMap((action) =>
        this.bookingsHeroService.addToCalendar(action.payload).pipe(
          map((data) => {
            console.log('Gestire addToCalendar', data);

            return addToCalendarSuccess({ data });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );
            return of(addToCalendarFailure({ error }));
          }),
        ),
      ),
    ),
  );

  cancelAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cancelAppointment),
      switchMap((action) =>
        this.bookingsHeroService.cancelAppointment(action.payload).pipe(
          map((data) => {
            this.router.navigate([`bookings-hero`]);
            this.notificationService.success(
              this.translate.instant('bookings-hero.booking-details.cancel-confirm-title'),
              this.translate.instant('bookings-hero.booking-details.cancel-confirm-info'),
              true,
              4000,
              NotificationPosition.Top,
            );
            return cancelAppointmentSuccess({ data });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );
            return of(cancelAppointmentFailure({ error }));
          }),
        ),
      ),
    ),
  );

  fetchBookingByNre$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchBookingByNre),
      switchMap((action) =>
        this.bookingsHeroService.fetchBookingByNre(action.payload).pipe(
          map((data) => {
            this.router.navigate([`bookings-hero/details`], {
              relativeTo: this.activatedRoute,
              queryParams: {
                nre: action.payload.prescriptionId,
                fiscalCode: action.payload.fiscalCode,
              },
            });
            return fetchBookingByNreSuccess({ data });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );
            return of(fetchBookingByNreFailure({ error }));
          }),
        ),
      ),
    ),
  );

  fetchBookingsList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchBookingsList),
      switchMap((action) =>
        this.bookingsHeroService.fetchBookingsList().pipe(
          map((data) => {
            return fetchBookingsListSuccess({ data });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );
            return of(fetchBookingsListFailure({ error }));
          }),
        ),
      ),
    ),
  );

  fetchAvailableDaysForRescheduleAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchAvailableDaysForRescheduleAppointment),
      switchMap((action) =>
        this.bookingsHeroService.fetchAvailableDaysForRescheduleAppointment(action.payload).pipe(
          map((data) => {
            this.router.navigate(['bookings-hero/reschedule']);
            this.store.dispatch(setActiveStep({ step: BookingStepId.AvailableDays }));
            return fetchAvailableDaysForRescheduleAppointmentSuccess({
              data: data.availableDays,
            });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );
            return of(fetchAvailableDaysForRescheduleAppointmentFailure({ error }));
          }),
        ),
      ),
    ),
  );
  moveAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(moveAppointment),
      switchMap((action) =>
        this.bookingsHeroService.move(action.payload).pipe(
          map((data) => {
            this.store.dispatch(setActiveStep({ step: BookingStepId.ConfirmedAppointment }));

            return moveAppointmentSuccess({ data });
          }),
          catchError((error) => {
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant('commons.generic-error'),
              true,
              4000,
              NotificationPosition.Top,
            );
            return of(moveAppointmentFailure({ error }));
          }),
        ),
      ),
    ),
  );
}
