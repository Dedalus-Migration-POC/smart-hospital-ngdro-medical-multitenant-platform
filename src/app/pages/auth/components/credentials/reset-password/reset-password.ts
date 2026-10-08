import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, Observable, of, startWith, Subject, switchMap } from 'rxjs';
import { Breadcrumb } from 'src/app/components/breadcrumb/breadcrumb';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { ImageBlock } from 'src/app/components/image-block/image-block';
import { Spinner } from 'src/app/components/spinner/spinner';
import { LanguageService } from 'src/app/initialize/state/services/language.service';
import { PageConfigService } from 'src/app/pages/page-config.service';
import { PageConfig } from 'src/app/pages/page.model';
import { UserConfig } from 'src/app/pages/user-profile/user-profile.model';
import { LocalizedText } from 'src/app/shared/models/shared_model';
import { SmartHospitalState } from 'src/app/store/reducers';
import { NgxFormValidators } from 'src/validators';
import * as CredentialsActions from '../state/credentials.actions';
import { selectResetPassword } from '../state/credentials.selectors';

type ResetPasswordPageConfig = Omit<PageConfig, 'sections'> &
  UserConfig & {
    messages: Record<string, LocalizedText>;
  };

@Component({
  selector: 'app-reset-password',
  imports: [
    Breadcrumb,
    DynamicFormComponent,
    ImageBlock,
    Spinner,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPassword {
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly pageConfigService = inject(PageConfigService);
  private readonly reloadConfig$ = new Subject<void>();
  private readonly successMessage = viewChild<ElementRef<HTMLElement>>('successMessage');
  readonly lang = inject(LanguageService).lang;
  readonly configError = signal(false);
  readonly request = this.store.selectSignal(selectResetPassword);
  readonly form = new FormGroup({
    fiscalCode: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, NgxFormValidators.taxCodeValidator],
    }),
  });
  private readonly formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  readonly pageConfig = toSignal(
    this.reloadConfig$.pipe(
      startWith(undefined),
      switchMap(() =>
        (
          this.pageConfigService.get(
            '/reset-password',
          ) as unknown as Observable<ResetPasswordPageConfig>
        ).pipe(
          catchError(() => {
            this.configError.set(true);
            return of(null);
          }),
        ),
      ),
    ),
    { initialValue: null },
  );
  readonly formConfigs = computed(() =>
    (this.pageConfig()?.sections ?? []).flatMap((section) =>
      (section.areas?.center?.items ?? [])
        .filter((item) => item.type === 'DYNAMIC_FORM' && item.enabled !== false)
        .map((item) => ({ ...item.props, showSubmitButton: false })),
    ),
  );
  readonly canSubmit = computed(
    () =>
      !!this.pageConfig() &&
      !this.configError() &&
      this.formConfigs().some((config) =>
        config.fields.some((field) => field.id === 'fiscalCode'),
      ) &&
      this.formStatus() === 'VALID' &&
      !this.request().loading &&
      !this.request().success,
  );

  constructor() {
    this.store.dispatch(CredentialsActions.clearResetPassword());
    afterRenderEffect(() => {
      if (this.request().success) this.successMessage()?.nativeElement.focus();
    });
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (!this.canSubmit() || this.form.invalid) return;
    this.store.dispatch(
      CredentialsActions.resetPassword({
        data: { fiscalCode: this.form.controls.fiscalCode.value.trim().toUpperCase() },
      }),
    );
  }

  retryConfig(): void {
    this.configError.set(false);
    this.reloadConfig$.next();
  }
}
