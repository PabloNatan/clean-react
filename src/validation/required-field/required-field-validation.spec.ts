import { RequiredFieldValidation } from '@/validation/required-field/required-field-validation'

describe('RequiredFieldValidation', () => {
  test('Should return error if field is empty', () => {
    const sut = new RequiredFieldValidation('email')
    sut.validate('')
  })
})
