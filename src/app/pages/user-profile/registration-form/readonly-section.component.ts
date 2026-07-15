import { Component, inject, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Field } from '../user-profile.model';
import { format } from 'date-fns';
import { LanguageService } from '../../../initialize/state/services/language.service';

@Component({
  selector: 'app-readonly-section',
  template: `
    <table>
      <tbody>
        @for (field of fields(); track field.key) {
          <tr class="cursor-default">
            <th scope="row" [attr.id]="'readonly-label-' + field.key" [class]="field.labelClasses">
              {{ field.label ? field.label[lang()] : '' }}
            </th>
            <td [attr.headers]="'readonly-label-' + field.key" [class]="field.fieldClasses">
              {{ getValue(field) }}
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class ReadOnlySectionComponent {
  readonly fields = input<Field[]>([]);
  readonly formGroup = input.required<FormGroup>();

  private langService = inject(LanguageService);
  lang = this.langService.lang;

  getValue(field: Field): string {
    const value = this.formGroup().controls[field.key]?.value || '';
    if (field.type === 'date' && value) {
      const formatString = field.dateFormat || 'dd-MM-yyyy';
      if (formatString === 'reverse') {
        let dateToReverse = value.split(/\D/);
        dateToReverse.reverse().join('-');
        return format(new Date(dateToReverse), 'dd-MM-yyyy');
      }
      return format(new Date(value), formatString);
    }
    if (field.key === 'fiscalCode') {
      return value.replace(/.*-/, '');
    }
    return value;
  }
}
