import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { SmartHospitalState } from 'src/app/store/reducers';
import { BookingType } from './models/booking-type';
import { State } from './state/reducer';
import { restoreStateFromLocalStorage } from './state/actions';
import { selectBookingUnifiedState } from './state/selectors';
import { HealthcareUnit } from './state/model';
import { setSelectedStruttura } from './state/struttura/struttura.actions';
import { selectSelectedStruttura } from './state/struttura/struttura.selectors';

interface BookingResume {
  returnUrl: string;
  bookingType: BookingType;
  bookingState: State;
  selectedStruttura: HealthcareUnit | null;
  sessionId: string | null;
  createdAt: number;
}

const BOOKING_RESUME_KEY = 'booking-a4h:resume';
const MAX_RESUME_AGE_MS = 30 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class BookingResumeService {
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly bookingState = this.store.selectSignal(selectBookingUnifiedState);
  private readonly selectedStruttura = this.store.selectSignal(selectSelectedStruttura);

  save(returnUrl: string, bookingType: BookingType): void {
    const resume: BookingResume = {
      returnUrl,
      bookingType,
      bookingState: this.bookingState(),
      selectedStruttura: this.selectedStruttura(),
      sessionId: localStorage.getItem('bookingSessionId'),
      createdAt: Date.now(),
    };

    sessionStorage.setItem(BOOKING_RESUME_KEY, JSON.stringify(resume));
  }

  restore(bookingType: BookingType): string | null {
    const resume = this.read();
    if (!resume || resume.bookingType !== bookingType) return null;

    this.store.dispatch(restoreStateFromLocalStorage({ state: resume.bookingState }));
    if (resume.selectedStruttura) {
      this.store.dispatch(setSelectedStruttura({ struttura: resume.selectedStruttura }));
    }
    if (resume.sessionId) {
      localStorage.setItem('bookingSessionId', resume.sessionId);
    }

    return resume.returnUrl;
  }

  clear(): void {
    sessionStorage.removeItem(BOOKING_RESUME_KEY);
  }

  private read(): BookingResume | null {
    const raw = sessionStorage.getItem(BOOKING_RESUME_KEY);
    if (!raw) return null;

    try {
      const resume = JSON.parse(raw) as BookingResume;
      if (Date.now() - resume.createdAt > MAX_RESUME_AGE_MS) {
        this.clear();
        return null;
      }
      return resume;
    } catch {
      this.clear();
      return null;
    }
  }
}
