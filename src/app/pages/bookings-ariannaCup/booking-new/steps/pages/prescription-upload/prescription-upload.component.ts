import { CommonModule } from '@angular/common';
import { Component, OnInit, input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { SmartHospitalState } from 'src/app/store/reducers';
import { SummaryComponent } from '../../components/summary/summary.component';
import { SessionStorageKey, SessionStorageUtils } from 'src/app/utility/session-storage-utils';
import { InputComponent } from 'src/app/components/input/input.component';

@Component({
  selector: 'app-booking-upload',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    DesignAngularKitModule,
    SummaryComponent,
    InputComponent,
  ],
  templateUrl: './prescription-upload.component.html',
  styleUrls: ['./prescription-upload.component.scss'],
})
export class PrescriptionUploadComponent implements OnInit {
  readonly setActiveStep = input.required<(stepIndex: number) => void>();
  readonly activeStepIndex = input.required<number>();

  form!: FormGroup;
  uploadPrescriptionLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private store: Store<SmartHospitalState>,
  ) {}

  // TODO fare sola lettura fiscal code
  ngOnInit() {
    this.form = this.fb.group({
      // fiscalCode: [
      //   '',
      //   [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{16}$/)],
      // ],
      nrePart1: ['', [Validators.required, Validators.maxLength(5)]],
      nrePart2: ['', [Validators.required, Validators.maxLength(10)]],
    });
  }

  fetchPrescription() {
    //   const fiscalCode = this.form.value.fiscalCode?.trim().toUpperCase()
    const nre = `${this.form.value.nrePart1?.trim()}${this.form.value.nrePart2?.trim()}`;

    SessionStorageUtils.setItem(SessionStorageKey.nre, JSON.stringify({ nre }));

    this.setActiveStep()(this.activeStepIndex() + 1);
  }
}
