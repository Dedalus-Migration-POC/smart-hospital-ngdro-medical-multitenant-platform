import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export function integerValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value == null || control.value === '') {
      return null
    }
    const value = Number(control.value)
    const isInteger = Number.isInteger(value)
    return isInteger ? null : { notInteger: true }
  }
}
