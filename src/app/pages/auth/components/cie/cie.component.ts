import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfileService } from '../../../user-profile/state/user-profile.service';
import { IDP_REDIRECT_KEY } from '../../../../../constants';
import { LanguageService } from '../../../../initialize/state/services/language.service';
import { CieAuthMethod, Env } from '../../model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cie',
  templateUrl: './cie.component.html',
  styleUrls: ['./cie.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
})
export class CieComponent {
  readonly cieConfig = input<CieAuthMethod | null>(null);
  baseUrl = window.location.origin + '/';

  private userProfileService = inject(UserProfileService);
  private router = inject(Router);
  private langService = inject(LanguageService);
  lang = this.langService.lang;

  returnUrl = window.location.origin + '/ui/idp-redirect';
  env: Env = 'dev'; //come definiamo environment?

  providerId = computed(() => {
    const cieConfig = this.cieConfig();
    return cieConfig?.config.providerId ? cieConfig.config.providerId[this.env] : 'cie';
  });

  submit() {
    const returnUrl = this.router.parseUrl(this.router.url).queryParams['returnUrl'];
    const redirectUrl = returnUrl || '/';
    localStorage.setItem(IDP_REDIRECT_KEY, redirectUrl);
    this.userProfileService.logout().subscribe();
  }
}
