import { Component, computed, inject, input } from '@angular/core';
import { Env, SpidAuthMethod } from '../../model';
import { LanguageService } from '../../../../initialize/state/services/language.service';
import { DEFAULT_PROVIDERS } from './default-providers';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-spid',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './spid.html',
  styleUrl: './spid.scss',
})
export class Spid {
  readonly spidConfig = input<SpidAuthMethod | null>(null);
  readonly router = inject(Router);
  private langService = inject(LanguageService);

  lang = this.langService.lang;

  env: Env = 'dev'; //come definiamo environment?
  showProvidersList = false;
  providers = DEFAULT_PROVIDERS;
  shuffledProviders: typeof DEFAULT_PROVIDERS = [];

  spidProviderPrefix = computed(() => {
    const spidConfig = this.spidConfig();
    return spidConfig?.config.prefixProvider ? spidConfig.config.prefixProvider[this.env] : null;
  });

  testProvider = computed(() => {
    const spidConfig = this.spidConfig();
    return spidConfig?.config.testProvider && spidConfig.config.testProvider[this.env].enable
      ? {
          name: spidConfig.config.testProvider[this.env].name,
          url: 'https://demo.spid.gov.it',
          iconName: 'demo',
        }
      : null;
  });

  returnUrl = computed(() => {
    const spidConfig = this.spidConfig();
    return spidConfig?.config.returnUrl
      ? spidConfig?.config.returnUrl
      : window.location.origin + '/ui/idp-redirect';
  });

  baseUrl = window.location.origin + '/';

  toggleShowProviderList() {
    this.showProvidersList = !this.showProvidersList;
  }

  dismissShowProviderList() {
    this.showProvidersList = false;
  }
  shuffleProviders() {
    this.shuffledProviders = this.providers
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  ngOnDestroy(): void {
    this.dismissShowProviderList();
  }
  focusNext(id: string) {
    document.getElementById(id)?.click();
  }

  submit() {
    const returnUrl = this.router.parseUrl(this.router.url).queryParams['returnUrl'];
    const redirectUrl = returnUrl || '/';
    // localStorage.setItem(IDP_REDIRECT_KEY, redirectUrl);
    // this.userProfileService.logout().subscribe();
  }
}
