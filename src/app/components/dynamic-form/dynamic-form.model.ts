import { FlexLayoutConfig, LocalizedText, SizeConfig } from '../../shared/models/shared_model';

export type FieldType = 'text' | 'email' | 'number' | 'password' | 'select' | 'hidden' | 'date';

export interface SelectOptionConfig {
  value: string;
  label: LocalizedText | string;
}

export interface ValidatorConfig {
  type:
    | 'required'
    | 'email'
    | 'pattern'
    | 'min'
    | 'max'
    | 'minLength'
    | 'maxLength'
    | 'taxCode'
    | 'phone_number'
    | 'cap'
    | 'text';
  value?: string | number;
}

export interface FormFieldConfig {
  id: string;
  type: FieldType;
  label?: LocalizedText;
  placeholder?: LocalizedText;
  options?: SelectOptionConfig[];
  required?: boolean;
  disabled?: boolean;
  inputClass?: string;
  wrapperClass?: string;
  size?: SizeConfig;
  value?: string | number | boolean;
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
  layoutFields?: FlexLayoutConfig;
  submitButton?: SubmitButtonConfig;
  showSubmitButton?: boolean;
  fields: FormFieldConfig[];
}
