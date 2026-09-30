import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap, of, delay } from 'rxjs';
import {
  AppointmentDto,
  AppointmentsResponse,
  CheckInTicketDto,
  MoveAppointmentPayload,
} from './model';
import { APPOINTMENTS } from './mock';

@Injectable({ providedIn: 'root' })
export class AppointmentsService {
  private readonly httpClient = inject(HttpClient);
  private readonly IS_DEV = true;

  fetchAppointments(): Observable<HttpResponse<AppointmentsResponse>> {
    if (this.IS_DEV) {
      return of(new HttpResponse({ status: 200, body: APPOINTMENTS })).pipe(delay(500));
    }
    return this.httpClient.get<AppointmentsResponse>('/checkin/api/appointments', {
      observe: 'response',
    });
  }

  /** La cancellazione richiede una sessione di booking aperta sulle stesse prestazioni. */
  deleteAppointment({ id: appointmentId, serviceIds }: AppointmentDto): Observable<unknown> {
    return this.httpClient
      .post<{ sessionId: string }>('/medical-booking/api/find-by-selection/create-session', {
        serviceIds,
      })
      .pipe(
        switchMap(({ sessionId }) =>
          this.httpClient.post('/medical-booking/api/reservations/cancel', {
            sessionId,
            appointmentId,
          }),
        ),
      );
  }

  requestCheckIn({ id, location }: AppointmentDto): Observable<CheckInTicketDto> {
    return this.httpClient.post<CheckInTicketDto>('/checkin/api/checkin', {
      appointmentIds: [id],
      structureCode: location.id,
    });
  }

  moveAppointment(payload: MoveAppointmentPayload): Observable<unknown> {
    return this.httpClient.post('/medical-booking/api/reservations/move', payload);
  }
}
