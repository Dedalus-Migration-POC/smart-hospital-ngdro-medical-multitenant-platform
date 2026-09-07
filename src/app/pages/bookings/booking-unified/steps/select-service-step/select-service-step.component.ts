import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { SmartHospitalState } from 'src/app/store/reducers';
import { selectSelectedStruttura } from 'src/app/pages/bookings/booking-unified/state/struttura/struttura.selectors';
import { addMedicalService, findForAvailableDays, resetMedicalService } from '../../state/actions';
import { selectFindPrescriptionByNre } from '../../state/selectors';

/** Step 1 of the SSN flow: pick one sub-service per prescription line. */
@Component({
  selector: 'app-select-service-step',
  imports: [ReactiveFormsModule, TranslateModule, TitleCasePipe],
  templateUrl: './select-service-step.component.html',
  styleUrls: ['./select-service-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectServiceStepComponent {
  private readonly store = inject(Store<SmartHospitalState>);
  protected readonly servicesList = this.store.selectSignal(selectFindPrescriptionByNre);
  private readonly selectedStruttura = this.store.selectSignal(selectSelectedStruttura);

  protected readonly showAlert = computed(() => {
    const services = this.servicesList();
    if (!services) return false;
    let primo = 0;
    let secondo = 0;
    services.prescription.serviceRequestList
      .map((el) => el.service.subServices)
      .flat()
      .forEach((service) => {
        if (service.name.toLowerCase().includes('primo')) primo++;
        if (service.name.toLowerCase().includes('secondo')) secondo++;
      });
    return (primo > 1 && secondo > 0) || (primo > 0 && secondo > 1);
  });

  protected form: FormGroup = new FormGroup({
    selectedPrescriptions: new FormControl({} as { [key: string]: string }, [Validators.required]),
  });

  constructor() {
    effect(() => {
      const services = this.servicesList();
      if (!services) return;

      this.form = new FormGroup({
        selectedPrescriptions: new FormControl({} as { [key: string]: string }, [
          Validators.required,
          minKeysValidator(services.prescription.serviceRequestList.length),
        ]),
      });
    });
  }

  toggleService(serviceId: string, subServiceId: string) {
    this.form.patchValue({
      selectedPrescriptions: {
        ...this.form.value.selectedPrescriptions,
        [serviceId]: subServiceId,
      },
    });
  }

  onConfirmClick() {
    const selectedMedicalServicesId: string[] = Object.values(
      this.form.value?.selectedPrescriptions ?? {},
    );
    this.store.dispatch(resetMedicalService());
    selectedMedicalServicesId.forEach((id) => this.store.dispatch(addMedicalService({ id })));

    const servicesList = this.servicesList();
    if (!servicesList) return;
    this.store.dispatch(
      findForAvailableDays({
        payload: {
          sessionId: servicesList.sessionId,
          from: new Date(),
          to: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          serviceIds: selectedMedicalServicesId,
          unitId: this.selectedStruttura()?.id ? [this.selectedStruttura()!.id] : undefined,
          physicianId: undefined,
        },
      }),
    );
  }
}

function minKeysValidator(min: number): ValidatorFn {
  return (control) => {
    const value = control.value as Record<string, string> | null;
    return Object.keys(value ?? {}).length >= min ? null : { minKeys: true };
  };
}
