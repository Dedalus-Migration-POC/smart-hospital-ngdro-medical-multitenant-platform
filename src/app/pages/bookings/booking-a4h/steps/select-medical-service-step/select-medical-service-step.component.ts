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
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { InputComponent } from 'src/app/components/input/input.component';
import { SmartHospitalState } from 'src/app/store/reducers';
import { BookingUnifiedModalService } from '../../booking-unified-modal.service';
import { MedicalService } from '../../state/model';
import { BOOKING_FLOW_CODES, BookingType } from '../../models/booking-type';
import {
  addMedicalService,
  createSession,
  getServicesList,
  removeMedicalService,
  setServicesVisibility,
} from '../../state/actions';
import {
  selectSelectedMedicalService,
  selectServicesList,
  selectServicesListLoading,
  selectServicesVisibility,
} from '../../state/selectors';
import { Spinner } from 'src/app/components/spinner/spinner';

/** Max simultaneous services a citizen can pick when no physician is pre-selected. */
const MAX_SERVICES_WITHOUT_DOCTOR = 8;

/**
 * Service picker shared by no-doc-select, with-doc-select and physicians flows.
 * In the physicians flow the list is already filtered by the chosen doctor and
 * loaded by `select-doctor-step`, so this component just needs to render it.
 */
@Component({
  selector: 'app-select-medical-service-step',
  imports: [ReactiveFormsModule, TranslateModule, DesignAngularKitModule, InputComponent, Spinner],
  templateUrl: './select-medical-service-step.component.html',
  styleUrls: ['./select-medical-service-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectMedicalServiceStepComponent implements OnInit {
  protected readonly back = output<void>();
  readonly bookingType = input<BookingType | null>(null);

  protected readonly BookingType = BookingType;
  protected readonly filter = signal('');
  protected readonly filterControl = new FormControl<string>('', { nonNullable: true });

  private readonly store = inject(Store<SmartHospitalState>);
  private readonly translate = inject(TranslateService);
  private readonly modalService = inject(BookingUnifiedModalService);

  protected readonly loading = this.store.selectSignal(selectServicesListLoading);
  protected readonly showAllServices = this.store.selectSignal(selectServicesVisibility);
  protected readonly selectedMedicalServicesId = this.store.selectSignal(
    selectSelectedMedicalService,
  );
  private readonly services = this.store.selectSignal(selectServicesList);

  protected readonly selectedMedicalServicesList = computed(() =>
    this.services().filter((service) => this.selectedMedicalServicesId().includes(service.id)),
  );

  protected readonly groupedServices = computed(() => {
    const filter = this.filter().toLowerCase();
    const selectedIds = this.selectedMedicalServicesId();
    const base = this.showAllServices()
      ? this.services()
      : this.services().filter((s) => s.enabled);
    const filtered = base.filter((s) => !filter || s.name.toLowerCase().includes(filter));
    const withChecked = filtered.map((s) => ({
      ...s,
      isChecked: selectedIds.includes(s.id),
    }));
    const letters = Array.from(new Set(withChecked.map((s) => s.name[0])));
    return letters.sort().map((letter) => ({
      letter,
      services: withChecked.filter((s) => s.name.startsWith(letter)),
    }));
  });

  constructor() {
    this.filterControl.valueChanges.subscribe((value) => this.filter.set(value));
  }

  ngOnInit(): void {
    // Physicians flow already loaded the (doctor-scoped) list before this step is shown.
    if (this.bookingType() !== BookingType.Physicians) {
      this.store.dispatch(getServicesList({ filter: BOOKING_FLOW_CODES[this.bookingType()!] }));
    }
  }

  isChecked() {
    this.store.dispatch(setServicesVisibility());
  }

  /** Il limite non si applica al flusso physicians, dove la lista è già ristretta al medico. */
  get limitReached(): boolean {
    return (
      this.bookingType() !== BookingType.Physicians &&
      this.selectedMedicalServicesId().length >= MAX_SERVICES_WITHOUT_DOCTOR
    );
  }

  toggleService(id: string) {
    const input = document.getElementById('selected-service' + id) as HTMLInputElement;
    if (!input) return;
    if (input.checked) {
      if (this.limitReached) {
        input.checked = false;
        return;
      }
      this.store.dispatch(addMedicalService({ id }));
      if (this.limitReached) {
        this.modalService.openInfo('errorTitle', 'maxServicesLimitReached');
      }
    } else {
      this.store.dispatch(removeMedicalService({ id }));
    }
  }

  onServiceDelete(service: MedicalService) {
    const input = document.getElementById('selected-service' + service.id) as HTMLInputElement;
    this.store.dispatch(removeMedicalService({ id: service.id }));
    if (input) input.click();
  }

  onConfirmClick() {
    const services = this.selectedMedicalServicesList()
      .map((service) => `&#x2022; ${service.name}`)
      .join('<br>');

    this.modalService.openConfirm({
      titleKey: 'booking-a4h.selectService.confirmModal.title',
      bodyKey: 'booking-a4h.selectService.confirmModal.body',
      bodyParams: { services },
      cancelKey: 'booking-a4h.cancel',
      confirmKey: 'booking-a4h.proceed',
      onConfirm: () =>
        this.store.dispatch(
          createSession({
            payload: { serviceIds: this.selectedMedicalServicesId() },
          }),
        ),
    });
  }
}
