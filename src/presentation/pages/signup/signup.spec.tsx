import React from 'react'
import { faker } from '@faker-js/faker'
import user from '@testing-library/user-event'
import {
  type ByRoleMatcher,
  cleanup,
  render,
  type RenderResult,
  screen
} from '@testing-library/react'

import { SignUp } from '@/presentation/pages'
import { AddAccountSpy, Helper, ValidationStub } from '@/presentation/test'

const signUpFields = {
  name: '',
  email: '',
  password: '',
  passwordConfirmation: ''
}

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationStub
  addAccountSpy: AddAccountSpy
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationSpy = new ValidationStub()
  validationSpy.errorMessage = params?.validationError
  const addAccountSpy = new AddAccountSpy()
  const sut = render(
    <SignUp validation={validationSpy} addAccount={addAccountSpy} />
  )
  return { sut, validationSpy, addAccountSpy }
}

const simulateValidSubmitAsync = async (
  name = faker.name.fullName(),
  email = faker.internet.email(),
  password = faker.internet.password(),
  inputPasswordConfirmation?: string
): Promise<void> => {
  const passwordConfirmation = inputPasswordConfirmation || password
  await Helper.populateFieldAsync('name', 'textbox', name)
  await Helper.populateFieldAsync('email', 'textbox', email)
  await Helper.populateFieldAsync('password', 'password', password)
  await Helper.populateFieldAsync(
    'passwordConfirmation',
    'passwordConfirmation',
    passwordConfirmation
  )
  const submitButton = screen.getByRole('button')
  await user.click(submitButton)
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

const isCallingValidatorWithCorrectValues = async (
  value: string,
  field: keyof typeof signUpFields,
  role: ByRoleMatcher = 'textbox'
): Promise<void> => {
  const { validationSpy } = makeSut({ validationError: 'Campo obrigatório' })
  await Helper.populateFieldAsync(field, role, value)
  expect(validationSpy.fieldName).toEqual(field)
  expect(validationSpy.fieldValue).toEqual(value)
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

  test('Should call Validation with correct name', async () => {
    const name = faker.name.fullName()
    await isCallingValidatorWithCorrectValues(name, 'name')
  })

  test('Should call Validation with correct email', async () => {
    const email = faker.internet.email()
    await isCallingValidatorWithCorrectValues(email, 'email')
  })

  test('Should call Validation with correct password', async () => {
    const password = faker.internet.password()
    await isCallingValidatorWithCorrectValues(password, 'password', 'password')
  })

  test('Should call Validation with correct passwordConfirmation', async () => {
    const passwordConfirmation = faker.internet.password()
    await isCallingValidatorWithCorrectValues(
      passwordConfirmation,
      'passwordConfirmation',
      'passwordConfirmation'
    )
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

  test('Should show spinner on submit', async () => {
    makeSut()
    await simulateValidSubmitAsync()
    const { spinner } = Helper.getFormStatusComponents()
    expect(spinner).toBeInTheDocument()
  })

  test('Should call AddAccount with correct values', async () => {
    const { addAccountSpy } = makeSut()
    const name = faker.name.fullName()
    const email = faker.internet.email()
    const password = faker.internet.password()
    const passwordConfirmation = password
    await simulateValidSubmitAsync(name, email, password, passwordConfirmation)
    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation
    })
  })
})
