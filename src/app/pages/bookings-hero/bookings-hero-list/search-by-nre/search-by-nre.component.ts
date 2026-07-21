import { Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { catchError, EMPTY } from 'rxjs';
import { InputComponent } from 'src/app/components/input/input.component';
import { SmartHospitalState } from 'src/app/store/reducers';
import { NgxFormValidators } from 'src/validators';
import { BookingsHeroService } from '../../state/service';
import { fetchBookingByNre } from '../../state/actions';
import { ScanResult } from '../../state/model';
import { arrayBufferToBase64 } from 'src/utils/buffer-utils';

@Component({
  selector: 'app-hero-booking-search-by-nre',
  standalone: true,
  imports: [TranslateModule, ReactiveFormsModule, DesignAngularKitModule, InputComponent],
  templateUrl: './search-by-nre.component.html',
  styleUrls: ['./search-by-nre.component.scss'],
})
export class SearchByNreComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly bookingsHeroService = inject(BookingsHeroService);

  form!: FormGroup;
  uploadPrescriptionLoading: boolean = false;

  @ViewChild('uploader') uploader!: ElementRef<HTMLInputElement>;
  uploadError = false;
  scanning = false;

  ngOnInit() {
    this.form = this.fb.group({
      fiscalCode: ['', [Validators.required, NgxFormValidators.taxCodeValidator]],
      nrePart1: ['', [Validators.required, Validators.maxLength(5)]],
      nrePart2: ['', [Validators.required, Validators.maxLength(10)]],
    });
  }

  fetchPrescription() {
    const fiscalCode = this.form.value.fiscalCode?.trim().toUpperCase();
    const nre = `${this.form.value.nrePart1?.trim()}${this.form.value.nrePart2?.trim()}`;
    this.store.dispatch(
      fetchBookingByNre({
        payload: { fiscalCode: fiscalCode, prescriptionId: nre },
      }),
    );
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
          this.form.controls['fiscalCode'].setValue(response.fiscalCode);
        });
      this.uploader.nativeElement.value = '';
    });
  }
}
