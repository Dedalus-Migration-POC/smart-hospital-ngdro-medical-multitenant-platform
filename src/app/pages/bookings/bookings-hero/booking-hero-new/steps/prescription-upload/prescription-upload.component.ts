import { Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { catchError, combineLatest, EMPTY, map, take, tap } from 'rxjs';
import { SmartHospitalState } from 'src/app/store/reducers';
import { BookingsHeroService } from '../../../state/service';
import { ScanResult } from '../../../state/model';
import { fetchPersonInfo, findByFiscalCode, setSummaryBooking } from '../../../state/actions';
import { SummaryCardComponent } from '../components/summary-card/summary-card.component';
import { selectBookingHeroSummary } from '../../../state/selectors';
import { NgxFormValidators } from 'src/validators';
import { selectUserProfileData } from 'src/app/pages/user-profile/state/user-profile.selectors';
import { InputComponent } from 'src/app/components/input/input.component';
import { arrayBufferToBase64 } from 'src/utils/buffer-utils';

@Component({
  selector: 'app-hero-booking-upload',
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    DesignAngularKitModule,
    SummaryCardComponent,
    InputComponent,
  ],
  templateUrl: './prescription-upload.component.html',
  styleUrls: ['./prescription-upload.component.scss'],
})
export class PrescriptionUploadComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly bookingsHeroService = inject(BookingsHeroService);

  form!: FormGroup;
  uploadPrescriptionLoading: boolean = false;

  @ViewChild('uploader') uploader!: ElementRef<HTMLInputElement>;
  uploadError = false;
  scanning = false;
  isNre = false;
  ngOnInit() {
    combineLatest([
      this.store.select(selectBookingHeroSummary),
      this.store.select(selectUserProfileData),
    ])
      .pipe(
        take(1),
        tap(
          ([summary, user]) => (
            (this.isNre = summary?.bookingType === 'nre' ? true : false),
            (this.form = this.fb.group({
              fiscalCode: [
                {
                  value:
                    summary?.bookingType === 'nre'
                      ? user?.fiscalCode.toUpperCase().startsWith('TINIT-')
                        ? user?.fiscalCode.slice(6)
                        : user?.fiscalCode
                      : '',
                  disabled: summary?.bookingType === 'nre' ? true : false,
                },
                [Validators.required, NgxFormValidators.taxCodeValidator],
              ],
              nrePart1: ['', [Validators.required, Validators.maxLength(5)]],
              nrePart2: ['', [Validators.required, Validators.maxLength(10)]],
            }))
          ),
        ),
      )
      .subscribe();
  }

  onUpload() {
    const file = (this.uploader.nativeElement.files ?? [])[0];
    file.arrayBuffer().then((arrayBuffer) => {
      const content = arrayBufferToBase64(arrayBuffer);
      this.scanning = true;
      this.uploadError = false;
      this.bookingsHeroService
        .scanNreFromImage({
          mimeType: (file.type || '').replace('image/', ''),
          content,
        })
        .pipe(
          catchError((err) => {
            this.scanning = false;
            this.uploadError = true;

            return EMPTY;
          }),
        )
        .subscribe((response: ScanResult) => {
          this.scanning = false;

          this.form.controls['nrePart1'].setValue(response.prescriptionPrimaryCode);
          this.form.controls['nrePart2'].setValue(response.prescriptionSecondaryCode);
          !this.isNre && this.form.controls['fiscalCode'].setValue(response.fiscalCode);
        });
      this.uploader.nativeElement.value = '';
    });
  }

  fetchPrescription() {
    const fiscalCode = this.form.getRawValue().fiscalCode?.trim().toUpperCase();
    const nre = `${this.form.getRawValue().nrePart1?.trim()}${this.form.getRawValue().nrePart2?.trim()}`;

    this.store
      .select(selectBookingHeroSummary)
      .pipe(
        take(1),
        map((summary) => {
          if (summary) {
            this.store.dispatch(
              setSummaryBooking({
                payload: { ...summary, nre: nre, fiscalCode: fiscalCode },
              }),
            );

            summary.bookingType === 'nre_delegate'
              ? this.store.dispatch(
                  fetchPersonInfo({
                    payload: { prescriptionId: nre, fiscalCode: fiscalCode },
                  }),
                )
              : this.store.dispatch(
                  findByFiscalCode({
                    payload: { prescriptionId: nre, fiscalCode: fiscalCode },
                  }),
                );
          }
        }),
      )
      .subscribe();
  }
}
