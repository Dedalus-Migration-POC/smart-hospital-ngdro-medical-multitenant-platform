import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ItCheckboxComponent } from 'design-angular-kit';
import { LanguageService } from '../../../initialize/state/services/language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-consents-form',
  imports: [CommonModule, ItCheckboxComponent, TranslateModule],
  templateUrl: './consents-form.component.html',
  styleUrls: ['./consents-form.component.scss'],
})
export class ConsentsFormComponent {
  @Input() userConsentsForm?: FormGroup;
  @Input() isProfile?: boolean;
  @Output() toggleConsent = new EventEmitter();
  @Input() consentsConfig?: {
    title: { [key: string]: string };
    subtitle: { [key: string]: string };
  } | null;

  private langService = inject(LanguageService);
  lang = this.langService.lang;
}
