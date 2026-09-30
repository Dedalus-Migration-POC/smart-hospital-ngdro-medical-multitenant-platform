import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SmartHospitalState } from 'src/app/store/reducers';
import { BookingUnifiedModalService } from '../booking-unified-modal.service';
import { deleteAppointment, requestCheckIn } from './state/actions';
import { AppointmentDto } from './state/model';

/** Conferme utente per le azioni su un appuntamento (ex CheckInHelper di Mondino). */
@Injectable({ providedIn: 'root' })
export class AppointmentActionsService {
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly router = inject(Router);
  private readonly modalService = inject(BookingUnifiedModalService);

  requestCheckIn(appointment: AppointmentDto): void {
    this.modalService.openConfirm({
      titleKey: 'appointments.check-in-popup.title',
      bodyKey: 'appointments.check-in-popup.text',
      cancelKey: 'commons.no',
      confirmKey: 'commons.yes',
      onConfirm: () => this.store.dispatch(requestCheckIn({ appointment })),
    });
  }

  deleteAppointment(appointment: AppointmentDto): void {
    this.modalService.openConfirm({
      titleKey: 'appointments.warning',
      bodyKey: 'appointments.details-page.delete-popup-message',
      cancelKey: 'commons.no',
      confirmKey: 'appointments.details-page.delete-popup-confirm-label',
      onConfirm: () => this.store.dispatch(deleteAppointment({ appointment })),
    });
  }

  editAppointment(appointment: AppointmentDto): void {
    this.router.navigate(['booking-a4h', 'appointments', 'edit', appointment.id]);
  }
}
