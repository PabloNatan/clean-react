import {
  EmailValidation,
  MinLengthValidation,
  RequiredFieldValidation,
  ValidationBuilder
} from '@/validation/validators'
import { faker } from '@faker-js/faker'
import { CompareFieldsValidation } from '../compare-fields/compare-fileds-validation'

describe('ValidationBuilder', () => {
  test('Should return RequiredFieldValidation', () => {
    const field = faker.database.column()
    const validations = ValidationBuilder.field(field).required().build()
    expect(validations).toEqual([new RequiredFieldValidation(field)])
  })

  test('Should return EmailValidation', () => {
    const field = faker.database.column()
    const validations = ValidationBuilder.field(field).email().build()
    expect(validations).toEqual([new EmailValidation(field)])
  })

  test('Should return MinLengthValidation', () => {
    const field = faker.database.column()
    const length = faker.datatype.number()

    const validations = ValidationBuilder.field(field).min(length).build()

    expect(validations).toEqual([new MinLengthValidation(field, length)])
  })

  test('Should return CompareFieldsValidation', () => {
    const field = faker.database.column()
    const fieldToCompare = faker.database.column()

    const validations = ValidationBuilder.field(field)
      .sameAs(fieldToCompare)
      .build()

    expect(validations).toEqual([
      new CompareFieldsValidation(field, fieldToCompare)
    ])
  })

  test('Should return a list of validation', () => {
    const field = faker.database.column()
    const length = faker.datatype.number()

    const validations = ValidationBuilder.field(field)
      .required()
      .min(length)
      .email()
      .build()

    expect(validations).toEqual([
      new RequiredFieldValidation(field),
      new MinLengthValidation(field, length),
      new EmailValidation(field)
    ])
  })
})
