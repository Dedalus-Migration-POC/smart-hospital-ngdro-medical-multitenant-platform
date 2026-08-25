import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, signal, ViewContainerRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SummaryComponent } from '../../components/summary/summary.component';
import { selectPrivateBooking } from 'src/app/pages/bookings/bookings-ariannaCup/state/selectors';
import { SmartHospitalState } from 'src/app/store/reducers';
import { Store } from '@ngrx/store';
import { MedicoPrestazione } from 'src/app/pages/bookings/bookings-ariannaCup/state/model';
import { SessionStorageKey, SessionStorageUtils } from 'src/app/utility/session-storage-utils';
import { InputComponent } from 'src/app/components/input/input.component';
import { ModalService, ModalType } from 'src/app/components/modal/modal.service';

@Component({
  selector: 'app-doctor-selector',
  standalone: true,
  imports: [CommonModule, TranslateModule, SummaryComponent, ReactiveFormsModule, InputComponent],
  templateUrl: './private-doctor-selector.component.html',
})
export class PrivateDoctorSelectorComponent {
  private readonly store = inject(Store<SmartHospitalState>);
  private modalService = inject(ModalService);
  private viewContainerRef = inject(ViewContainerRef);

  readonly setActiveStep = input.required<(stepIndex: number) => void>();
  readonly activeStepIndex = input.required<number>();

  private readonly privateBookingState = this.store.selectSignal(selectPrivateBooking);

  privateBooking = computed(
    () => this.privateBookingState() ?? this.readSessionItem(SessionStorageKey.privateBooking),
  );

  medici = computed(() => {
    const booking = this.privateBooking();
    const medici = booking?.medici ?? [];
    const locale = this.translateService.currentLang || 'it';

    return [...medici].sort((a, b) =>
      (a.descMedico ?? '').localeCompare(b.descMedico ?? '', locale, {
        sensitivity: 'base',
      }),
    );
  });

  filterDoctor = signal('');
  searchDoctorControl = new FormControl('');
  selectedDoctor = signal<MedicoPrestazione | null>(null);

  filteredMedici = computed(() => {
    const medici = this.medici();
    const q = this.filterDoctor().trim().toLowerCase();

    if (!q) return medici;

    return medici.filter((m) => m.descMedico.toLowerCase().includes(q));
  });

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.searchDoctorControl.valueChanges.subscribe((value) => {
      this.selectedDoctor.set(null);
      this.filterDoctor.set(value ?? '');
    });
  }

  confirmSelectedDoctor() {
    const selectedDoctor = this.selectedDoctor();
    if (!selectedDoctor) return;

    const body = this.translateService.instant(
      'bookings.booking-new.private-doctor-selector.confirm-modal.body',
      { descMedico: selectedDoctor.descMedico },
    );

    const title = this.translateService.instant(
      'bookings.booking-new.private-doctor-selector.confirm-modal.title',
    );
    this.modalService.open(this.viewContainerRef, {
      type: ModalType.INFO,
      title: title,
      body: body,
      styleClass: 'modal-' + ModalType.INFO.toLowerCase(),
      centered: true,
      buttons: [
        {
          label: this.translateService.instant(
            'bookings.booking-new.private-doctor-selector.confirm-modal.cancel',
          ),
          styleClass: 'btn-outline-primary',
          callback: () => {},
        },
        {
          label: this.translateService.instant(
            'bookings.booking-new.private-doctor-selector.confirm-modal.confirm',
          ),
          styleClass: 'btn-primary',
          callback: () => this.confirmDoctor(selectedDoctor!),
        },
      ],
    });
  }

  trackByDoctor(_: number, doctor: MedicoPrestazione) {
    return doctor.idAgenda;
  }

  goBookingList() {
    SessionStorageUtils.removeItem(SessionStorageKey.privateBooking);

    this.setActiveStep()(this.activeStepIndex() - 1);
  }

  private confirmDoctor(doctor: MedicoPrestazione) {
    // stored session for refresh
    SessionStorageUtils.setItem(SessionStorageKey.privateDoctor, JSON.stringify(doctor));

    this.setActiveStep()(this.activeStepIndex() + 1);
  }

  private readSessionItem(key: SessionStorageKey): any {
    const raw = SessionStorageUtils.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }
}
