import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../../initialize/state/services/language.service';
import { MyIdAuthMethod } from '../../model';
import { IDP_REDIRECT_KEY } from '../../../../../constants';

@Component({
  selector: 'app-myid',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './myid.component.html',
  styleUrl: './myid.component.scss',
})
export class MyidComponent {
  readonly myIdConfig = input<MyIdAuthMethod | null>(null);

  readonly router = inject(Router);
  private langService = inject(LanguageService);

  lang = this.langService.lang;
  baseUrl = window.location.origin + '/';
  returnUrl = computed(() => {
    const myIdConfig = this.myIdConfig();
    return myIdConfig?.config.returnUrl
      ? myIdConfig?.config.returnUrl
      : window.location.origin + '/ui/idp-redirect';
  });

  showIcon = computed(() => {
    const myIdConfig = this.myIdConfig();
    return myIdConfig?.button.showIcon;
  });

  submit() {
    const returnUrl = this.router.parseUrl(this.router.url).queryParams['returnUrl'];
    const redirectUrl = returnUrl || '/';
    localStorage.setItem(IDP_REDIRECT_KEY, redirectUrl);
    // this.userProfileService.logout().subscribe();
  }
}
