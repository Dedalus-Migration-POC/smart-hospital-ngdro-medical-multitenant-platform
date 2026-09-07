import { UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { catchError, EMPTY } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { InputComponent } from 'src/app/components/input/input.component';
import { SmartHospitalState } from 'src/app/store/reducers';
import { selectUserProfileData } from 'src/app/pages/user-profile/state/user-profile.selectors';
import { BookingUnifiedService } from '../../state/service';
import { NgxFormValidators } from 'src/validators';
import { arrayBufferToBase64 } from 'src/utils/buffer-utils';
import { findPrescriptionByNre, resetMedicalService, setNreInfo } from '../../state/actions';

/** Step 0 of the SSN flow: scan/insert the NRE prescription codes. */
@Component({
  selector: 'app-insert-nre-step',
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    DesignAngularKitModule,
    InputComponent,
    UpperCasePipe,
  ],
  templateUrl: './insert-nre-step.component.html',
  styleUrls: ['./insert-nre-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsertNreStepComponent {
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly bookingUnifiedService = inject(BookingUnifiedService);
  private readonly userProfile = this.store.selectSignal(selectUserProfileData);

  protected readonly uploader = viewChild<ElementRef<HTMLInputElement>>('uploader');
  protected readonly uploadError = signal(false);
  protected readonly scanning = signal(false);
  protected readonly fiscalCodeDisabled = signal(false);

  protected readonly nrecfForm = new FormGroup({
    leftCode: new FormControl<string>('', Validators.required),
    rightCode: new FormControl<string>('', Validators.required),
    fiscalCode: new FormControl<string>('', [
      Validators.required,
      NgxFormValidators.taxCodeValidator,
    ]),
  });

  constructor() {
    effect(() => {
      const fiscalCode = this.userProfile()?.fiscalCode;
      if (!fiscalCode) return;

      this.nrecfForm.controls.fiscalCode.setValue(fiscalCode, { emitEvent: false });
      this.nrecfForm.controls.fiscalCode.disable({ emitEvent: false });
      this.fiscalCodeDisabled.set(true);
    });
  }

  onUpload() {
    const uploader = this.uploader()?.nativeElement;
    if (!uploader) return;
    const file = (uploader?.files ?? [])[0];
    if (!file) return;
    file.arrayBuffer().then((arrayBuffer) => {
      this.scanning.set(true);
      this.uploadError.set(false);

      this.bookingUnifiedService
        .scanNreFromImage({
          mimeType: (file.type || '').replace('image/', ''),
          content: arrayBufferToBase64(arrayBuffer),
        })
        .pipe(
          catchError(() => {
            this.scanning.set(false);
            this.uploadError.set(true);
            return EMPTY;
          }),
        )
        .subscribe((response) => {
          this.scanning.set(false);
          this.nrecfForm.controls.leftCode.setValue(response.prescriptionPrimaryCode);
          this.nrecfForm.controls.rightCode.setValue(response.prescriptionSecondaryCode);
          this.nrecfForm.controls.fiscalCode.setValue(response.fiscalCode);
        });
      uploader.value = '';
    });
  }

  onStartBookingSession() {
    const { leftCode, rightCode, fiscalCode } = this.nrecfForm.getRawValue();
    const prescriptionId = (leftCode ?? '') + (rightCode ?? '');
    if (fiscalCode && prescriptionId) {
      this.store.dispatch(setNreInfo({ nreInfo: { fiscalCode, prescriptionId } }));
      this.store.dispatch(findPrescriptionByNre({ payload: { fiscalCode, prescriptionId } }));
    }
    this.store.dispatch(resetMedicalService());
  }
}
