import React from 'react'
import { faker } from '@faker-js/faker'

import {
  type ByRoleMatcher,
  cleanup,
  render,
  type RenderResult,
  screen
} from '@testing-library/react'

import { SignUp } from '@/presentation/pages'
import { Helper, ValidationStub } from '@/presentation/test'

const signUpFields = {
  name: '',
  email: '',
  password: '',
  passwordConfirmation: ''
}

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationStub
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationSpy = new ValidationStub()
  validationSpy.errorMessage = params?.validationError
  const sut = render(<SignUp validation={validationSpy} />)
  return { sut, validationSpy }
}

const validateIfShowFieldError = async (
  fieldName: keyof typeof signUpFields,
  role: ByRoleMatcher = 'textbox'
): Promise<void> => {
  const validationError = faker.random.words()
  makeSut({ validationError })
  await Helper.populateFieldAsync(fieldName, role)
  Helper.testStatusForField(fieldName, validationError)
}

describe('Login Component', () => {
  afterEach(cleanup)

  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    const { errorMessage, spinner } = Helper.getFormStatusComponents()
    expect(spinner).not.toBeInTheDocument()
    expect(errorMessage).not.toBeInTheDocument()
    Helper.testButtonIsDisabled()
    Object.keys(signUpFields).forEach((field) => {
      Helper.testStatusForField(field, validationError)
    })
  })

  test('Should call Validation with correct email', async () => {
    const { validationSpy } = makeSut({ validationError: 'Campo obrigatório' })
    const email = faker.internet.email()
    await Helper.populateFieldAsync('email', 'textbox', email)
    expect(validationSpy.fieldName).toEqual('email')
    expect(validationSpy.fieldValue).toEqual(email)
  })

  test('Should show name error if Validation fails', async () => {
    await validateIfShowFieldError('name')
  })

  test('Should show email error if Validation fails', async () => {
    await validateIfShowFieldError('email')
  })

  test('Should show password error if Validation fails', async () => {
    await validateIfShowFieldError('password', 'password')
  })

  test('Should show passwordConfirmation error if Validation fails', async () => {
    await validateIfShowFieldError(
      'passwordConfirmation',
      'passwordConfirmation'
    )
  })

  test('Should show valid name state  if Validation succeeds', async () => {
    await Helper.validateFieldSucceds(makeSut, 'name')
  })

  test('Should show valid email state  if Validation succeeds', async () => {
    await Helper.validateFieldSucceds(makeSut, 'email')
  })

  test('Should show valid password state  if Validation succeeds', async () => {
    await Helper.validateFieldSucceds(makeSut, 'password', 'password')
  })

  test('Should show valid passwordConfirmation state  if Validation succeeds', async () => {
    await Helper.validateFieldSucceds(
      makeSut,
      'passwordConfirmation',
      'passwordConfirmation'
    )
  })

  test('Should enable submit button if form is valid', async () => {
    makeSut()
    const submitButton = screen.getByRole('button')
    await Helper.populateFieldAsync('name')
    await Helper.populateFieldAsync('email')
    await Helper.populateFieldAsync('password', 'password')
    await Helper.populateFieldAsync(
      'passwordConfirmation',
      'passwordConfirmation'
    )
    expect(submitButton).toBeEnabled()
  })
})
