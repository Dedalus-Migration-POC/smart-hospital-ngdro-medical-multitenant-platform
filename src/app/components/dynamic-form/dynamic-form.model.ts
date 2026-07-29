import { LocalizedText } from '../../shared/models/shared_model';
import { FlexLayoutConfig } from '../../shared/models/shared_model';

export type FieldType = 'text' | 'email' | 'number' | 'password';

export interface ValidatorConfig {
  type: 'required' | 'email' | 'pattern' | 'min' | 'max' | 'minLength' | 'maxLength' | 'taxCode';
  value?: string | number;
}

export interface FormFieldConfig {
  id: string;
  type: FieldType;
  label?: LocalizedText;
  placeholder?: LocalizedText;
  required?: boolean;
  layoutField?: FlexLayoutConfig;
  validators?: ValidatorConfig[];
  errorMessages?: {
    [key: string]: LocalizedText; // 'required', 'email', 'pattern', etc.
  };
}

export interface SubmitButtonConfig {
  label: LocalizedText;
  layout?: FlexLayoutConfig;
  className?: string;
}

export interface DynamicFormConfig {
  layoutForm?: FlexLayoutConfig;
  submitButton?: SubmitButtonConfig;
  fields: FormFieldConfig[];
}
