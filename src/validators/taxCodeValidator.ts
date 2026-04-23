import { AbstractControl, ValidationErrors } from '@angular/forms'

/**
 * @deprecated USE NgxFormValidators.taxCodeValidator or NgxFormValidators.taxCodeValidatorNotRequired INSTEAD
 * @param control
 * @param required
 */
export function checkTaxCode(
  control: AbstractControl,
  required: boolean,
): ValidationErrors | null {
  if (control.value === null || control.value === '') {
    return required ? { required: true } : null
  }
  const cf = control.value.toUpperCase()
  const cfReg =
    /^[A-Za-z]{6}[0-9LMNPQRSTUV]{2}[A-Za-z]{1}[0-9LMNPQRSTUV]{2}[A-Za-z]{1}[0-9LMNPQRSTUV]{3}[A-Za-z]{1}$/
  if (!cfReg.test(cf)) {
    return { validateFiscalCode: true }
  }
  const set1 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const set2 = 'ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const setpari = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const setdisp = 'BAKPLCQDREVOSFTGUHMINJWZYX'
  let s = 0
  for (let i = 1; i <= 13; i += 2) {
    s += setpari.indexOf(set2.charAt(set1.indexOf(cf.charAt(i))))
  }
  for (let i = 0; i <= 14; i += 2) {
    s += setdisp.indexOf(set2.charAt(set1.indexOf(cf.charAt(i))))
  }
  if (s % 26 !== cf.charCodeAt(15) - 'A'.charCodeAt(0)) {
    return { validateFiscalCode: true }
  }
  return null // CODICE FISCALE OK
}

/**
 * @deprecated  USE NgxFormValidators.taxCodeValidatorNotRequired INSTEAD
 * @param control
 */
export function taxCodeValidatorNotRequired(
  control: AbstractControl,
): ValidationErrors | null {
  return checkTaxCode(control, false)
}

/**
 * @deprecated USE NgxFormValidators.taxCodeValidator INSTEAD
 * @param control
 */
export function taxCodeValidator(
  control: AbstractControl,
): ValidationErrors | null {
  return checkTaxCode(control, true)
}

/**
 * @deprecated USE NgxFormValidators.taxCodeValidator INSTEAD
 * @param control
 * @constructor
 */
export function TaxCodeValidator(
  control: AbstractControl,
): ValidationErrors | null {
  return checkTaxCode(control, true)
}

/**
 * @deprecated USE NgxFormValidators.taxCodeValidatorNotRequired INSTEAD
 * @param control
 * @constructor
 */
export function TaxCodeValidatorNotRequired(
  control: AbstractControl,
): ValidationErrors | null {
  return checkTaxCode(control, false)
}
