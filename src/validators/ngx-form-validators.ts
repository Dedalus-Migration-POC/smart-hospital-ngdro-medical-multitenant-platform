import { ValidationErrors, ValidatorFn, Validators } from '@angular/forms'
import {
  taxCodeValidator,
  taxCodeValidatorNotRequired,
} from './taxCodeValidator'
import { PasswordMatchingParameterizedValidator } from './password-matching-validator'
import { PatternValidator } from './pattern-validator'
import { RangeDateParameterizedValidator } from './rangeDateValidator'
import { PhonePatterns } from './patterns/phone-patterns'
import { EmailPatterns } from './patterns/email-patterns'
import { ClinicalReportsNumber } from './patterns/clinical-report-number'
import { CapPatterns } from './patterns/cap-patterns'
import { TextPatterns } from './patterns/text-patterns'

/**
 * Provides a set of built-in validators that can be used by form controls.
 * Extends Angular Validators
 */
export class NgxFormValidators extends Validators {
  static taxCodeValidator: ValidatorFn = taxCodeValidator

  static taxCodeValidatorNotRequired = taxCodeValidatorNotRequired

  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return PatternValidator(regex, error)
  }

  static passwordMatchingParameterizedValidator(
    field1: any,
    field2: any,
    showErrorsAtFormGroupLevel?: boolean,
  ): ValidatorFn {
    return PasswordMatchingParameterizedValidator(
      field1,
      field2,
      showErrorsAtFormGroupLevel,
    )
  }

  static rangeDateParameterizedValidator(
    from: string,
    to: string,
    showErrorsAtFormGroupLevel?: boolean,
  ): ValidatorFn {
    return RangeDateParameterizedValidator(from, to, showErrorsAtFormGroupLevel)
  }

  static mobilePhoneNumber(error: ValidationErrors): ValidatorFn {
    return NgxFormValidators.patternValidator(new PhonePatterns().MOBILE, error)
  }

  static cap(error: ValidationErrors): ValidatorFn {
    return NgxFormValidators.patternValidator(new CapPatterns().CAP, error)
  }

  static text(error: ValidationErrors): ValidatorFn {
    return NgxFormValidators.patternValidator(new TextPatterns().TEXT, error)
  }

  static clinicalReportNumber(error: ValidationErrors): ValidatorFn {
    return NgxFormValidators.patternValidator(
      new ClinicalReportsNumber().VALID_NUMBER,
      error,
    )
  }

  static override email(error: ValidationErrors): ValidatorFn {
    return NgxFormValidators.patternValidator(
      new EmailPatterns().GENERIC,
      error,
    )
  }
}
