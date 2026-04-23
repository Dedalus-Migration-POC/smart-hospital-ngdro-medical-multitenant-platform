import { AbstractControl, ValidatorFn } from '@angular/forms'

/**
 * @deprecated  USE NgxFormValidators.passwordMatchingValidator('newpassword', 'confirmnewpassword', true) INSTEAD
 * @param control
 * @constructor
 */
export function PasswordMatchingValidator(control: AbstractControl) {
  if (control.get('newpassword') && control.get('confirmnewpassword')) {
    if (
      control.get('newpassword')?.value !==
      control.get('confirmnewpassword')?.value
    ) {
      return {
        validateMatching: true,
      }
    }
  }
  return null
}

/**
 * @deprecated  USE NgxFormValidators.passwordMatchingValidator(field1: any, field2: any, showErrorsAtFormGroupLevel?: boolean) INSTEAD
 *
 * example NgxFormValidators.passwordMatchingParameterizedValidator('identity.password', 'identity.confirmPassword'),
 *
 * @param field1  can be nested : person.identity.password
 * @param field2  can be nested : person.identity.confirmPassword
 * @param showErrorsAtFormGroupLevel
 * @constructor
 */
export function PasswordMatchingParameterizedValidator(
  field1: any,
  field2: any,
  showErrorsAtFormGroupLevel?: boolean,
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    function controlDeepVisit(control: AbstractControl, arr: string[]): any {
      if (arr.length === 1) {
        return control.get(arr.shift() ?? '')
      } else {
        const ctrl = control.get(arr.shift() ?? '')
        return ctrl ? controlDeepVisit(ctrl, arr) : control
      }
    }

    if (
      controlDeepVisit(control, field1.split('.'))?.value !==
      controlDeepVisit(control, field2.split('.'))?.value
    ) {
      if (showErrorsAtFormGroupLevel) {
        return { validateMatching: true }
      } else {
        control.get(field2)?.setErrors({ validateMatching: true })
        return null
      }
    } else {
      return null // Validazione OK
    }
  }
}
