import { Component, inject, input } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { AuthMethodTabsProps } from '../../model';
import { DesignAngularKitModule } from 'design-angular-kit';
import { LanguageService } from '../../../../initialize/state/services/language.service';
import { Spid } from '../spid/spid';

@Component({
  selector: 'app-auth-methods',
  imports: [CommonModule, DesignAngularKitModule, Spid],
  templateUrl: './auth-methods.html',
  styleUrl: './auth-methods.scss',
})
export class AuthMethods {
  readonly authConfig = input<AuthMethodTabsProps | null>(null);
  private langService = inject(LanguageService);

  lang = this.langService.lang;
}
