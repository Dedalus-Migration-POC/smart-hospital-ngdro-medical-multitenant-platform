import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { SmartHospitalState } from 'src/app/store/reducers';
import {
  selectBookingHeroSummary,
  selectPhysicianList,
  selectServiceList,
} from '../../../state/selectors';
import {
  fetchPhysicianByService,
  fetchServiceList,
  findByFiscalCode,
  setSummaryBooking,
} from '../../../state/actions';
import { Physician, Service } from '../../../state/model';
import {
  selectUserProfile,
  selectUserProfileData,
} from 'src/app/pages/user-profile/state/user-profile.selectors';
import { SummaryCardComponent } from '../components/summary-card/summary-card.component';
import { InputComponent } from 'src/app/components/input/input.component';

@Component({
  selector: 'app-hero-select-medical-service',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    DesignAngularKitModule,
    SummaryCardComponent,
    InputComponent,
  ],
  templateUrl: './select-medical-service.component.html',
  styleUrls: ['./select-medical-service.component.scss'],
})
export class SelectMedicalServiceComponent implements OnInit {
  private readonly store = inject(Store<SmartHospitalState>);
  searchServiceControl = new FormControl('');
  searchPhysicianControl = new FormControl('');
  readonly filteredSrvices = this.store.selectSignal(selectServiceList);
  selectedService: Service | null = null;
  selectedPhysician: Physician | null = null;

  readonly physicians = this.store.selectSignal(selectPhysicianList);
  readonly searchPhysician = toSignal(
    this.searchPhysicianControl.valueChanges.pipe(
      startWith(this.searchPhysicianControl.value ?? ''),
    ),
    { initialValue: '' },
  );
  readonly filteredPhysicians = computed(() => {
    const physicians = this.physicians() ?? [];
    const search = (this.searchPhysician() ?? '').toLowerCase();
    return physicians.filter(
      (physician) =>
        physician.firstName?.toLowerCase().includes(search) ||
        physician.lastName?.toLowerCase().includes(search),
    );
  });
  readonly bookingSummary = this.store.selectSignal(selectBookingHeroSummary);
  readonly userProfileData = this.store.selectSignal(selectUserProfileData);

  ngOnInit(): void {
    this.searchServiceControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.store.dispatch(fetchServiceList({ serviceName: value || '' }));
      });
  }

  selectService(item: Service) {
    this.searchServiceControl.setValue(item.name, { emitEvent: false });
    this.selectedService = item;
    this.store.dispatch(fetchPhysicianByService({ serviceId: item.id || '' }));
  }

  deleteSelectedService() {
    this.selectedService = null;
    this.selectedPhysician = null;

    this.store.dispatch(fetchServiceList({ serviceName: '' }));
    this.searchServiceControl.reset();
    this.searchPhysicianControl.reset();
    this.store.dispatch(fetchPhysicianByService({ serviceId: '' }));
  }

  selectPhysician(item: Physician) {
    this.searchPhysicianControl.setValue(item.firstName, { emitEvent: false });
    this.selectedPhysician = item;
  }

  deleteSelectedPhysician() {
    this.selectedPhysician = null;
    this.searchPhysicianControl.reset();
  }

  onConfirm() {
    const summary = this.bookingSummary();
    const user = this.userProfileData();
    if (user && user.fiscalCode) {
      let fiscalCodeToBook;
      summary?.bookingType === 'free_prof'
        ? (fiscalCodeToBook = user.fiscalCode)
        : summary?.bookingType === 'free_prof_delegate' &&
            summary?.delega?.bookingPersonForm?.taxCode
          ? (fiscalCodeToBook = summary?.delega?.bookingPersonForm?.taxCode)
          : '';

      this.store.dispatch(
        setSummaryBooking({
          payload: {
            ...summary,
            services: [this.selectedService!],
            physician: this.selectedPhysician,
            fiscalCode: fiscalCodeToBook,
            userEmail: user?.email,
            userPhoneNumber:
              user.additionalAttributes.find((el) => el.key === 'phone_number')?.value || '',
            userFiscalCode: user.fiscalCode,
          },
        }),
      );
      this.store.dispatch(
        findByFiscalCode({
          payload: { fiscalCode: fiscalCodeToBook! },
        }),
      );
    }
  }
}
