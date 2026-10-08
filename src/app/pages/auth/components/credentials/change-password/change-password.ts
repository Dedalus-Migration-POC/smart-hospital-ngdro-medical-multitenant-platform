import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
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
import * as CredentialsActions from '../state/credentials.actions';
import { selectChangePassword } from '../state/credentials.selectors';

type ChangePasswordPageConfig = Omit<PageConfig, 'sections'> &
  UserConfig & {
    messages: Record<string, LocalizedText>;
  };

const REQUIRED_FIELDS = ['currentPassword', 'newPassword', 'repeatNewPassword'];

function matchesNewPassword(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.parent?.get('newPassword')?.value;
  return control.value && control.value !== newPassword ? { validateMatching: true } : null;
}

@Component({
  selector: 'app-change-password',
  imports: [
    Breadcrumb,
    DynamicFormComponent,
    ImageBlock,
    Spinner,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePassword {
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly pageConfigService = inject(PageConfigService);
  private readonly reloadConfig$ = new Subject<void>();
  private readonly successMessage = viewChild<ElementRef<HTMLElement>>('successMessage');
  readonly lang = inject(LanguageService).lang;
  readonly configError = signal(false);
  readonly request = this.store.selectSignal(selectChangePassword);
  readonly form = new FormGroup({
    currentPassword: new FormControl('', { nonNullable: true, validators: Validators.required }),
    newPassword: new FormControl('', { nonNullable: true, validators: Validators.required }),
    repeatNewPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, matchesNewPassword],
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
            '/change-password',
          ) as unknown as Observable<ChangePasswordPageConfig>
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
      REQUIRED_FIELDS.every((id) =>
        this.formConfigs().some((config) => config.fields.some((field) => field.id === id)),
      ) &&
      this.formStatus() === 'VALID' &&
      !this.request().loading &&
      !this.request().success,
  );

  constructor() {
    this.store.dispatch(CredentialsActions.clearChangePassword());
    this.form.controls.newPassword.valueChanges
      .pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe(() => this.form.controls.repeatNewPassword.updateValueAndValidity());
    effect(() => {
      if (this.request().success) this.form.reset();
    });
    afterRenderEffect(() => {
      if (this.request().success) this.successMessage()?.nativeElement.focus();
    });
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (!this.canSubmit() || this.form.invalid) return;
    const { currentPassword, newPassword } = this.form.getRawValue();
    this.store.dispatch(
      CredentialsActions.changePassword({ data: { currentPassword, newPassword } }),
    );
  }

  retryConfig(): void {
    this.configError.set(false);
    this.reloadConfig$.next();
  }
}
