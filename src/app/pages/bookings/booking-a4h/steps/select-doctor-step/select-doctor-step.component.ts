import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { Store } from '@ngrx/store';
import { InputComponent } from 'src/app/components/input/input.component';
import { SmartHospitalState } from 'src/app/store/reducers';
import { selectSelectedStruttura } from 'src/app/pages/bookings/booking-a4h/state/struttura/struttura.selectors';
import { IDoctor } from '../../state/model';
import { BookingType } from '../../models/booking-type';
import {
  findForAvailableDays,
  getDoctorsList,
  getServicesList,
  setSelectedDoctor,
} from '../../state/actions';
import {
  selectCreateSessionResponse,
  selectDoctorsList,
  selectDoctorsListLoading,
  selectSelectedMedicalService,
} from '../../state/selectors';
import { Spinner } from 'src/app/components/spinner/spinner';

/**
 * Doctor picker shared by with-doc-select (flat, filtered by the chosen
 * services) and physicians (full directory, grouped alphabetically).
 */
@Component({
  selector: 'app-select-doctor-step',
  imports: [ReactiveFormsModule, TranslateModule, DesignAngularKitModule, InputComponent, Spinner],
  templateUrl: './select-doctor-step.component.html',
  styleUrls: ['./select-doctor-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectDoctorStepComponent implements OnInit {
  protected readonly back = output<void>();
  readonly bookingType = input<BookingType | null>(null);

  protected readonly BookingType = BookingType;
  protected readonly filter = signal('');
  protected readonly filterControl = new FormControl<string>('', { nonNullable: true });

  private readonly store = inject(Store<SmartHospitalState>);
  private readonly loading = this.store.selectSignal(selectDoctorsListLoading);
  private readonly doctors = this.store.selectSignal(selectDoctorsList);
  private readonly createSessionResponse = this.store.selectSignal(selectCreateSessionResponse);
  private readonly selectedMedicalService = this.store.selectSignal(selectSelectedMedicalService);
  private readonly selectedStruttura = this.store.selectSignal(selectSelectedStruttura);

  protected readonly isLoading = computed(() => this.loading());
  protected readonly filteredDoctors = computed(() => {
    const filter = this.filter().toLowerCase();
    return this.doctors().filter(
      (doctor: IDoctor) => !filter || doctor.lastName.toLowerCase().includes(filter),
    );
  });

  protected readonly groupedDoctors = computed(() => {
    const doctors = this.filteredDoctors();
    const letters = Array.from(new Set(doctors.map((d) => d.lastName[0]))).sort();
    return letters.map((letter) => ({
      letter,
      doctors: doctors.filter((d) => d.lastName.startsWith(letter)),
    }));
  });

  constructor() {
    this.filterControl.valueChanges.subscribe((value) => this.filter.set(value));
  }

  ngOnInit(): void {
    // With-doc-select already has the (service-scoped) doctors list loaded by createSession$.
    if (this.bookingType() === BookingType.Physicians) {
      this.store.dispatch(getDoctorsList({}));
    }
  }

  toggleDoctor(physician: IDoctor) {
    this.store.dispatch(setSelectedDoctor({ physician }));
    if (this.bookingType() === BookingType.Physicians) {
      this.store.dispatch(getServicesList({ filter: physician.id, advanceStepOnLoad: true }));
    } else {
      // with-doc-select: session and services are already known, just re-run the search with the doctor.
      const session = this.createSessionResponse();
      if (!session) return;
      const struttura = this.selectedStruttura();
      this.store.dispatch(
        findForAvailableDays({
          payload: {
            sessionId: session.sessionId,
            from: new Date(),
            to: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            serviceIds: this.selectedMedicalService(),
            unitId: struttura?.id ? [struttura.id] : undefined,
            physicianId: physician.id,
          },
        }),
      );
    }
  }
}
