import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'
import { isAfter } from 'date-fns'

/**
 * @deprecated  USE NgxFormValidators.rangeDateParameterizedValidator('dateStart', 'dateEnd', true)  INSTEAD
 * @param control
 * @constructor
 */
export function RangeDateValidator(
  control: AbstractControl,
): ValidationErrors | null {
  if (isAfter(control.value.dateStart, control.value.dateEnd)) {
    return { rangeError: true }
  } else {
    return null // Validazione OK
  }
}

/**
 * @deprecated  USE NgxFormValidators.rangeDateParameterizedValidator(from: string, to: string, showErrorsAtFormGroupLevel?: boolean)  INSTEAD
 * @param from
 * @param to
 * @param showErrorsAtFormGroupLevel
 * @constructor
 */
export function RangeDateParameterizedValidator(
  from: string,
  to: string,
  showErrorsAtFormGroupLevel?: boolean,
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (isAfter(control.value[to], control.value[from])) {
      if (showErrorsAtFormGroupLevel) {
        return { rangeError: true }
      } else {
        control.get(to)?.setErrors({ rangeError: true })
        return null
      }
    } else {
      return null // Validazione OK
    }
  }
}
