import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { combineLatest, map, startWith, take } from 'rxjs';
import { selectBookingHeroSummary } from 'src/app/pages/bookings/bookings-hero/state/selectors';
import { SmartHospitalState } from 'src/app/store/reducers';
import { SummaryCardComponent } from '../components/summary-card/summary-card.component';
import { DeclarantFormComponent } from '../components/declarant-form/declarant-form.component';
import { BookingPersonFormComponent } from '../components/booking-person-form';
import {
  findByFiscalCode,
  initThirdBooking,
  setActiveStep,
  setSummaryBooking,
} from '../../../state/actions';
import { selectUserProfileData } from 'src/app/pages/user-profile/state/user-profile.selectors';
import { BookingStepId } from '../../../state/model';

@Component({
  selector: 'app-hero-delega-forms',
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    DesignAngularKitModule,
    SummaryCardComponent,
    DeclarantFormComponent,
    BookingPersonFormComponent,
  ],
  templateUrl: './delega-forms.component.html',
  styleUrls: ['./delega-forms.component.scss'],
})
export class DelegaFormsComponent implements OnInit {
  private readonly store = inject(Store<SmartHospitalState>);
  activeTab = 1;
  ngOnInit(): void {}

  setActiveTab(tab: number) {
    this.activeTab = tab;
    if (tab === 1) {
      const el = document.getElementById('delega-forms-tab-1-tab-link');
      if (el) {
        el.click();
      }
    }
    if (tab === 2) {
      const el = document.getElementById('delega-forms-tab-2-tab-link');
      if (el) {
        el.click();
      }
    }
  }

  @ViewChild(DeclarantFormComponent)
  declarantFormComponent!: DeclarantFormComponent;
  @ViewChild(BookingPersonFormComponent)
  bookingPersonFormComponent!: BookingPersonFormComponent;
  isBlocked: boolean = true;

  ngAfterViewInit() {
    combineLatest([
      this.declarantFormComponent.declarantForm.statusChanges.pipe(
        startWith(this.declarantFormComponent.declarantForm.status),
      ),
      this.bookingPersonFormComponent.bookingPersonForm.statusChanges.pipe(
        startWith(this.bookingPersonFormComponent.bookingPersonForm.status),
      ),
    ])
      .pipe(
        map(
          ([declarantFormStatus, bookingPersonFormStatus]) =>
            declarantFormStatus === 'VALID' && bookingPersonFormStatus === 'VALID',
        ),
      )
      .subscribe((isValid) => {
        this.isBlocked = !isValid;
      });
  }

  onConfirm() {
    combineLatest([
      this.store.select(selectBookingHeroSummary),
      this.store.select(selectUserProfileData),
    ])
      .pipe(
        take(1),
        map(([summary, user]) => {
          if (summary && user) {
            this.store.dispatch(
              setSummaryBooking({
                payload: {
                  ...summary,
                  delega: {
                    ...summary.delega!,
                    declarantForm: this.declarantFormComponent.declarantForm.getRawValue(),
                    bookingPersonForm:
                      this.bookingPersonFormComponent.bookingPersonForm.getRawValue(),
                  },
                },
              }),
            );
            const payload = {
              prescriptionId: summary.nre!,
              delegateMedicalAppointmentPatient: {
                fiscalCode: this.bookingPersonFormComponent.bookingPersonForm.getRawValue().taxCode,
                firstName:
                  this.bookingPersonFormComponent.bookingPersonForm.getRawValue().firstName,
                lastName: this.bookingPersonFormComponent.bookingPersonForm.getRawValue().lastName,
                phoneNumber:
                  user.additionalAttributes.find((el) => el.key === 'phone_number')?.value || '',
                email: user.email,
              },
              residentialAddress:
                this.bookingPersonFormComponent.bookingPersonForm.getRawValue().address,
              houseNumber:
                this.bookingPersonFormComponent.bookingPersonForm.getRawValue().houseNumber,
              cityOfResidence:
                this.bookingPersonFormComponent.bookingPersonForm.getRawValue().currentCity,
              province:
                this.bookingPersonFormComponent.bookingPersonForm.getRawValue().currentProvince,
              nation: 'Italy',
              delegationType: summary.delega?.delegateType!,
              delegatorFiscalCode: user.fiscalCode.toUpperCase(),
            };

            if (summary.bookingType === 'nre_delegate') {
              this.store.dispatch(initThirdBooking({ payload }));
            }
            if (summary.bookingType === 'free_prof_delegate') {
              this.store.dispatch(setActiveStep({ step: BookingStepId.SelectMedicalService }));
            }
          }
        }),
      )
      .subscribe();

    //update consents
    this.bookingPersonFormComponent.submit();
  }
}

