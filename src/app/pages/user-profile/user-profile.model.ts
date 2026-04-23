export enum Alignment {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

export enum FieldType {
  TEXT = 'text',
  DATE = 'date',
}

export enum ValidationType {
  Required = 'required',
  Email = 'email',
  Phone_number = 'phone_number',
  Cap = 'cap',
  Text = 'text',
}

export enum ValidationTypeError {
  Required = 'required',
  Email = 'email',
  ValidatePhoneNumber = 'validatePhoneNumber',
  ValidateCap = 'validateCap',
  ValidateText = 'validateText',
}

/*
 * key => is needed for mapping with i18n e.g user-profile-page.fiscalCode (path *.json)
 * type => field type
 * readOnly => field is read-only
 * alignment => how to display label - field
 * validators => field validators (see ValidationType enum values)
 * labelContainerClasses => classes to be added to the label container (horizontal alignment)
 * labelClasses => classes to be added to the label
 * fieldContainerClasses => classes to be added to the field container (horizontal alignment)
 * fieldClasses => classes to be added to the field
 * dateFormat => date format when the type is date, if not entered the default format is 'dd-MM-yyyy'
 * */
export interface Field {
  key: string
  type: FieldType
  alignment: Alignment
  validators?: { type: ValidationType }[]
  readOnly?: boolean
  labelContainerClasses?: string
  labelClasses?: string
  fieldContainerClasses?: string
  fieldClasses?: string
  dateFormat?: string
}

export interface Section {
  readOnly?: boolean
  title: string
  subTitle?: string
  fields: Field[]
}

// Used to dynamically create the registration form layout from the registration.json
// path file => assets/ tenants / messina / config / registration.json
export interface UserConfig {
  sections: Section[]
}

export interface AdditionalAttribute {
  key: string
  displayName: string
  value: string | null
  required: boolean
}

export interface UserProfile {
  fiscalCode: string
  firstName: string
  lastName: string
  email: string
  additionalAttributes: AdditionalAttribute[]
  consents: UserConsent[]
  hasDifferentData: boolean
  consentsSigned: boolean
  code: string | null
}

export interface UserConsent {
  id: number
  accepted?: boolean
  summary?: string
  description?: string
  url?: string
  required?: boolean
  lang?: string
  contractCode: string
  acceptedDate?: string
  type: string
  requireLogin?: boolean
}
