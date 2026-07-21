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
import { distinctUntilChanged, switchMap, take, tap } from 'rxjs/operators';
import { fetchNations, fetchProvincesList } from 'src/app/pages/bookings-hero/state/actions';
import { IDeclarantForm } from 'src/app/pages/bookings-hero/state/model';
import {
  selectBookingHeroSummary,
  selectNations,
  selectProvincesList,
} from 'src/app/pages/bookings-hero/state/selectors';
import { BookingsHeroService } from 'src/app/pages/bookings-hero/state/service';
import { selectUserProfileData } from 'src/app/pages/user-profile/state/user-profile.selectors';
import { SmartHospitalState } from 'src/app/store/reducers';
import { SelectComponent } from 'src/app/components/select/select.component';

@Component({
  selector: 'app-booking-hero-declarant-form',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    DesignAngularKitModule,
    SelectComponent,
  ],
  templateUrl: './declarant-form.component.html',
  styleUrls: ['./declarant-form.component.scss'],
})
export class DeclarantFormComponent implements OnInit {
  @Output() setActiveTab = new EventEmitter();

  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store<SmartHospitalState>);
  protected readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  private readonly bookingsHeroService = inject(BookingsHeroService);

  declarantForm!: FormGroup;
  readonly nations = this.store.selectSignal(selectNations);
  readonly provinces = this.store.selectSignal(selectProvincesList);
  readonly cities = signal<string[]>([]);
  readonly citiesResidence = signal<string[]>([]);
  readonly user = this.store.selectSignal(selectUserProfileData);

  declarantFormInitValues: IDeclarantForm | null = null;

  ngOnInit() {
    //GET NATIONS, PROVINCES

    this.store.dispatch(fetchNations());
    this.store.dispatch(fetchProvincesList());

    this.store
      .select(selectBookingHeroSummary)
      .pipe(
        take(1),
        tap((summary) => {
          if (summary?.delega?.declarantForm) {
            this.declarantFormInitValues = summary?.delega?.declarantForm;
            if (summary?.delega?.declarantForm.currentProvince) {
              this.loadResidenceCities(summary?.delega?.declarantForm.currentProvince);
            }
            if (summary?.delega?.declarantForm.birthProvince) {
              this.loadBirthCities(summary?.delega?.declarantForm.birthProvince);
            }
          }
        }),
      )
      .subscribe();

    this.initForm();

    this.declarantForm
      .get('birthCountry')!
      .valueChanges.pipe(
        distinctUntilChanged(),
        switchMap((country: string) => {
          this.declarantForm.get('birthProvince')!.setValue('');
          this.declarantForm.get('birthCity')!.setValue('');
          if (country === 'Italy') {
            this.declarantForm.get('birthProvince')!.enable();
            return country;
          } else {
            this.declarantForm.get('birthProvince')!.disable();
            this.declarantForm.get('birthCity')!.disable();
            return ' ';
          }
        }),
      )
      .subscribe();
  }

  dateFilter = Date.now();

  private initForm() {
    this.declarantForm = this.fb.group({
      birthDate: new FormControl(this.declarantFormInitValues?.birthDate || (null as Date | null), [
        Validators.required,
      ]),
      birthCountry: new FormControl(this.declarantFormInitValues?.birthCountry || '', [
        Validators.required,
      ]),
      birthProvince: new FormControl(
        {
          value: this.declarantFormInitValues?.birthProvince || '',
          disabled: true,
        },
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
      ),
      birthCity: new FormControl(
        {
          value: this.declarantFormInitValues?.birthCity || '',
          disabled: true,
        },
        [Validators.required],
      ),

      currentProvince: new FormControl(this.declarantFormInitValues?.currentProvince || '', [
        Validators.required,
        Validators.maxLength(2),
        Validators.minLength(2),
      ]),
      currentCity: new FormControl(
        {
          value: this.declarantFormInitValues?.currentCity || '',
          disabled: true,
        },
        [Validators.required],
      ),
      address: new FormControl(this.declarantFormInitValues?.address || '', [Validators.required]),
      currentCityCap: new FormControl(this.declarantFormInitValues?.currentCityCap || '', [
        Validators.required,
      ]),
    });
  }

  onChangeResidenceProvince() {
    const province = this.declarantForm.get('currentProvince')?.value;
    this.declarantForm.get('currentCity')!.setValue('');
    if (province) {
      this.loadResidenceCities(province);
      return this.declarantForm.get('currentCity')!.enable();
    } else {
      this.declarantForm.get('currentCity')!.disable();
      this.citiesResidence.set([]);
      return of([]);
    }
  }

  onChangeBirthProvince() {
    const birthProvince = this.declarantForm.get('birthProvince')?.value;
    this.declarantForm.get('birthCity')!.setValue('');
    if (birthProvince) {
      this.loadBirthCities(birthProvince);
      return this.declarantForm.get('birthCity')!.enable();
    } else {
      this.declarantForm.get('birthCity')!.disable();
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
    console.log('+++declarantForm', this.declarantForm.value);
  }
}
