import { RequiredFieldError } from '@/validation/errors/required-field-error'
import { type FieldValidation } from '../protocols/field-validation'

export class RequiredFieldValidation implements FieldValidation {
  constructor(readonly field: string) {}

  validate(value: string): Error {
    return new RequiredFieldError()
  }
}
