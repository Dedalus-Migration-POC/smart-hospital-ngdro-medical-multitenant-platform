import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ItCheckboxComponent } from 'design-angular-kit';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizedText } from '../../../shared/models/shared_model';

@Component({
  selector: 'app-consents-form',
  imports: [CommonModule, ItCheckboxComponent, TranslateModule],
  templateUrl: './consents-form.component.html',
  styleUrls: ['./consents-form.component.scss'],
})
export class ConsentsFormComponent {
  readonly userConsentsForm = input<FormGroup | undefined>(undefined);
  readonly isProfile = input(false);
  readonly toggleConsent = output<any>();
  readonly consentsConfig = input<{ title: LocalizedText; subtitle: LocalizedText } | null>();
}
