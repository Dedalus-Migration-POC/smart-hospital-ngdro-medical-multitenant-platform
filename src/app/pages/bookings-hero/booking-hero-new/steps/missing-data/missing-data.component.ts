import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { distinctUntilChanged, map, of, tap } from 'rxjs';
import { SmartHospitalState } from 'src/app/store/reducers';
import { selectUserProfile } from 'src/app/pages/user-profile/state/user-profile.selectors';
import {
  selectBookingHeroSummary,
  selectCitiesList,
  selectProvincesList,
} from '../../../state/selectors';
import {
  createSessionWithAddress,
  fetchCitiesList,
  fetchProvincesList,
  initBookingFromMissingData,
} from '../../../state/actions';
import { SummaryCardComponent } from '../components/summary-card/summary-card.component';
import { InputComponent } from 'src/app/components/input/input.component';
import { SelectComponent } from 'src/app/components/select/select.component';

@Component({
  selector: 'app-hero-missing-data',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    DesignAngularKitModule,
    SummaryCardComponent,
    InputComponent,
    SelectComponent,
  ],
  templateUrl: './missing-data.component.html',
  styleUrls: ['./missing-data.component.scss'],
})
export class MissingDataComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store<SmartHospitalState>);

  registrationForm!: FormGroup;

  readonly provinces = this.store.selectSignal(selectProvincesList);
  readonly cities = this.store.selectSignal(selectCitiesList);
  readonly userProfile = this.store.selectSignal(selectUserProfile);
  readonly bookingSummary = this.store.selectSignal(selectBookingHeroSummary);
  profile: any = {};

  ngOnInit() {
    this.profile = this.userProfile()?.data ?? {};
    this.initForm();
    this.store.dispatch(fetchProvincesList());
    this.registrationForm
      .get('province')
      ?.valueChanges.pipe(
        distinctUntilChanged(),
        tap(() => {
          this.registrationForm.get('cityOfResidence')?.reset();
        }),
        tap((province: string) => {
          this.registrationForm.get('cityOfResidence')?.setValue('');

          if (province) {
            this.registrationForm.get('cityOfResidence')?.enable();
            this.store.dispatch(fetchCitiesList({ province }));
          } else {
            this.registrationForm.get('cityOfResidence')?.disable();
            of([]);
          }
        }),
      )
      .subscribe();
  }

  address = this.profile?.additionalAttributes?.find((el: any) => el.key === 'address')?.value;
  separateAddress = this.address?.split(',');
  houseNum = this.separateAddress?.pop();
  addressVia = this.separateAddress?.join(' ');
  province = this.profile?.additionalAttributes?.find((el: any) => el.key === 'province')?.value;
  comune = this.profile?.additionalAttributes?.find((el: any) => el.key === 'city')?.value;

  private initForm() {
    this.registrationForm = this.fb.group({
      residentialAddress: this.fb.control(
        {
          value: this.addressVia ? this.addressVia : null,
          disabled: this.addressVia ? true : false,
        },
        Validators.required,
      ),
      houseNumber: this.fb.control(
        {
          value: this.houseNum ? this.houseNum : '',
          disabled: this.houseNum ? true : false,
        },
        Validators.required,
      ),
      province: this.fb.control(
        {
          value: this.province ? this.province : '',
          disabled: this.province ? true : false,
        },
        Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z]{2}$')]),
      ),
      cityOfResidence: this.fb.control(
        {
          value: this.comune ? this.comune : '',
          disabled: this.comune ? true : false,
        },
        Validators.required,
      ),
      falseStatementsDisclaimer: this.fb.control(false, Validators.requiredTrue),
    });
  }

  onConfirm() {
    let payload;
    const summary = this.bookingSummary();

    if (summary?.bookingType === 'nre') {
      payload = {
        prescriptionId: summary?.nre || summary?.prescriptionId || '',
        medicalAppointmentPatient: {
          fiscalCode: summary?.fiscalCode!,
        },
        residentialAddress: this.registrationForm.getRawValue().residentialAddress,
        houseNumber: this.registrationForm.getRawValue().houseNumber,
        cityOfResidence: this.registrationForm.getRawValue().cityOfResidence,
        province: this.registrationForm.getRawValue().province,
      };
      this.store.dispatch(initBookingFromMissingData({ payload: payload }));
    }
    if (summary?.bookingType === 'free_prof') {
      payload = {
        serviceIds: summary.services
          ?.map((service) => service.id)
          .filter((id): id is string => !!id)!,
        physicianId: summary.physician?.id!,
        patientAddress: {
          residentialAddress: this.registrationForm.getRawValue().residentialAddress,
          houseNumber: this.registrationForm.getRawValue().houseNumber,
          cityOfResidence: this.registrationForm.getRawValue().cityOfResidence,
        },
      };
      this.store.dispatch(createSessionWithAddress({ payload: payload }));
    }
  }
}
