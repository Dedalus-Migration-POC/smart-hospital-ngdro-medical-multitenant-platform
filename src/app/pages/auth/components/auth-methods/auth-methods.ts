import { Component, inject, input } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { AuthMethodTabsProps } from '../../model';
import { DesignAngularKitModule } from 'design-angular-kit';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../../initialize/state/services/language.service';
import { Spid } from '../spid/spid';
import { MyidComponent } from '../myid/myid.component';
import { CieComponent } from '../cie/cie.component';
import { CredentialsLogin } from '../credentials/login/credentials-login';

@Component({
  selector: 'app-auth-methods',
  imports: [
    CommonModule,
    TranslateModule,
    DesignAngularKitModule,
    Spid,
    MyidComponent,
    CieComponent,
    CredentialsLogin,
  ],
  templateUrl: './auth-methods.html',
  styleUrl: './auth-methods.scss',
})
export class AuthMethods {
  readonly authConfig = input<AuthMethodTabsProps | null>(null);
  private langService = inject(LanguageService);

  lang = this.langService.lang;
}
