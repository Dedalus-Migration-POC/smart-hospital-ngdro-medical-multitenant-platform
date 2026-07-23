import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { of } from 'rxjs';
import { distinctUntilChanged, map, switchMap, take, tap } from 'rxjs/operators';
import {
  fetchConsents,
  fetchNations,
  fetchProvincesList,
  updateConsents,
} from 'src/app/pages/bookings/bookings-hero/state/actions';
import { IBookingPersonForm } from 'src/app/pages/bookings/bookings-hero/state/model';
import {
  selectBookingHeroSummary,
  selectConsents,
  selectNations,
  selectPersonInfo,
  selectProvincesList,
} from 'src/app/pages/bookings/bookings-hero/state/selectors';
import { BookingsHeroService } from 'src/app/pages/bookings/bookings-hero/state/service';
import { SmartHospitalState } from 'src/app/store/reducers';
import { NgxFormValidators } from 'src/validators';
import { SelectComponent } from 'src/app/components/select/select.component';
import { InputComponent } from 'src/app/components/input/input.component';

@Component({
  selector: 'app-booking-hero-person-form',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    DesignAngularKitModule,
    SelectComponent,
    InputComponent,
  ],
  templateUrl: './booking-person-form.component.html',
  styleUrls: ['./booking-person-form.component.scss'],
})
export class BookingPersonFormComponent implements OnInit {
  @Output() setActiveTab = new EventEmitter();

  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store<SmartHospitalState>);
  protected readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  private readonly bookingsHeroService = inject(BookingsHeroService);

  bookingPersonForm!: FormGroup;
  readonly nations = this.store.selectSignal(selectNations);
  readonly provinces = this.store.selectSignal(selectProvincesList);
  readonly cities = signal<string[]>([]);
  readonly citiesResidence = signal<string[]>([]);
  readonly bookingSummary = this.store.selectSignal(selectBookingHeroSummary);
  readonly delegateType = () => this.bookingSummary()?.delega?.delegateType;

  bookingPersonFormInitValues: IBookingPersonForm | null = null;

  ngOnInit() {
    //GET WAPP, NATIONS, PROVINCES

    this.store.dispatch(fetchConsents());
    this.store.dispatch(fetchNations());
    this.store.dispatch(fetchProvincesList());
    this.store
      .select(selectBookingHeroSummary)
      .pipe(
        take(1),
        tap((summary) => {
          if (summary?.delega?.bookingPersonForm) {
            this.bookingPersonFormInitValues = summary?.delega?.bookingPersonForm;
            if (summary?.delega?.bookingPersonForm.currentProvince) {
              this.loadResidenceCities(summary?.delega?.bookingPersonForm.currentProvince);
            }
            if (summary?.delega?.bookingPersonForm.birthProvince) {
              this.loadBirthCities(summary?.delega?.bookingPersonForm.birthProvince);
            }
          }
        }),
      )
      .subscribe();

    this.initForm();

    this.bookingPersonForm
      .get('birthCountry')!
      .valueChanges.pipe(
        distinctUntilChanged(),
        switchMap((country: string) => {
          this.bookingPersonForm.get('birthProvince')!.setValue('');
          this.bookingPersonForm.get('birthCity')!.setValue('');
          if (country === 'Italy') {
            this.bookingPersonForm.get('birthProvince')!.enable();
            return country;
          } else {
            this.bookingPersonForm.get('birthProvince')!.disable();
            this.bookingPersonForm.get('birthCity')!.disable();
            return ' ';
          }
        }),
      )
      .subscribe();

    this.bookingPersonForm
      .get('taxCode')!
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value: string) => {
        const upperValue = value?.toUpperCase?.() ?? value;
        if (value !== upperValue) {
          this.bookingPersonForm.get('taxCode')!.setValue(upperValue, { emitEvent: false });
        }
      });
  }

  dateFilter = Date.now();

  private initForm() {
    this.store
      .select(selectPersonInfo)
      .pipe(
        take(1),
        map((personInfo) => {
          if (personInfo?.province) {
            this.loadResidenceCities(personInfo?.province);
          }

          let address = personInfo?.address;
          let separateAddress = address?.split(' ');
          let houseNum = separateAddress?.pop();
          let checkN = separateAddress?.slice(-1);
          if (
            checkN &&
            (checkN[0] === 'N.' || checkN[0] === 'n.' || checkN[0] === 'N' || checkN[0] === 'n')
          ) {
            separateAddress?.pop();
          }
          let addressVia = separateAddress?.join(' ');

          this.bookingPersonForm = this.fb.group({
            firstName: new FormControl(
              personInfo?.name || this.bookingPersonFormInitValues?.firstName || '',
              [Validators.required],
            ),
            lastName: new FormControl(
              personInfo?.lastName || this.bookingPersonFormInitValues?.lastName || '',
              [Validators.required],
            ),
            birthDate: new FormControl(
              this.bookingPersonFormInitValues?.birthDate || (null as Date | null),
              [Validators.required],
            ),
            birthCountry: new FormControl(this.bookingPersonFormInitValues?.birthCountry || '', [
              Validators.required,
            ]),
            birthProvince: new FormControl(
              {
                value: this.bookingPersonFormInitValues?.birthProvince || '',
                disabled: true,
              },
              [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
            ),
            birthCity: new FormControl(
              {
                value: this.bookingPersonFormInitValues?.birthCity || '',
                disabled: true,
              },
              [Validators.required],
            ),

            taxCode: new FormControl(
              {
                value: personInfo?.fiscalCode || this.bookingPersonFormInitValues?.taxCode || '',
                disabled: false,
              },
              [Validators.required, NgxFormValidators.taxCodeValidator],
            ),
            currentProvince: new FormControl(
              personInfo?.province || this.bookingPersonFormInitValues?.currentProvince || '',
              [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
            ),
            currentCity: new FormControl(
              {
                value: personInfo?.city || this.bookingPersonFormInitValues?.currentCity || '',
                disabled: true,
              },
              [Validators.required],
            ),
            currentCityCap: new FormControl(
              personInfo?.zipCode || this.bookingPersonFormInitValues?.currentCityCap || '',
              [Validators.required],
            ),
            address: new FormControl(
              addressVia || this.bookingPersonFormInitValues?.address || '',
              [Validators.required],
            ),
            houseNumber: new FormControl(
              houseNum || this.bookingPersonFormInitValues?.houseNumber || '',
              [Validators.required],
            ),
            informative: new FormControl(this.bookingPersonFormInitValues?.informative || false, [
              Validators.requiredTrue,
            ]),
          });
        }),
      )
      .subscribe();
  }

  onChangeResidenceProvince() {
    const province = this.bookingPersonForm.get('currentProvince')?.value;
    this.bookingPersonForm.get('currentCity')!.setValue('');
    if (province) {
      this.loadResidenceCities(province);
      return this.bookingPersonForm.get('currentCity')!.enable();
    } else {
      this.bookingPersonForm.get('currentCity')!.disable();
      this.citiesResidence.set([]);
      return of([]);
    }
  }

  onChangeBirthProvince() {
    const birthProvince = this.bookingPersonForm.get('birthProvince')?.value;
    this.bookingPersonForm.get('birthCity')!.setValue('');
    if (birthProvince) {
      this.loadBirthCities(birthProvince);
      return this.bookingPersonForm.get('birthCity')!.enable();
    } else {
      this.bookingPersonForm.get('birthCity')!.disable();
      this.cities.set([]);
      return of([]);
    }
  }

  private loadResidenceCities(province: string) {
    this.bookingsHeroService
      .getCitiesList(province)
      .pipe(take(1))
      .subscribe((cities) => this.citiesResidence.set(cities ?? []));
  }

  private loadBirthCities(province: string) {
    this.bookingsHeroService
      .getCitiesList(province)
      .pipe(take(1))
      .subscribe((cities) => this.cities.set(cities ?? []));
  }

  submit() {
    this.store
      .select(selectConsents)
      .pipe(
        take(1),
        map((consents) => {
          if (consents) {
            let consentPCT = consents.find((consent) => consent.contractCode === 'PCT');
            let consentAD = consents.find((consent) => consent.contractCode === 'AD');
            this.store.dispatch(
              updateConsents({
                payload: {
                  cfThirdPerson: this.bookingPersonForm.getRawValue().taxCode,
                  consents:
                    consentPCT && consentAD
                      ? [
                          {
                            id: consentPCT?.id,
                            accepted: this.bookingPersonForm.getRawValue().informative,
                          },
                          {
                            id: consentAD?.id,
                            accepted: true, //this.delega.selfDeclaration
                          },
                        ]
                      : [],
                },
              }),
            );
          }
        }),
      )
      .subscribe();
  }
}

