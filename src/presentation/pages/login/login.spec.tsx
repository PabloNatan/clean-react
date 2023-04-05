import { AuthenticationSpy, ValidationSpy } from '@/presentation/test'

import {
  render,
  screen,
  within,
  type RenderResult
} from '@testing-library/react'
import user from '@testing-library/user-event'
import faker from 'faker'
import React from 'react'
import { Login } from './login'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationSpy = new ValidationSpy()
  const authenticationSpy = new AuthenticationSpy()
  validationSpy.errorMessage = params?.validationError

  const sut = render(
    <Login validation={validationSpy} authentication={authenticationSpy} />
  )

  return { sut, validationSpy, authenticationSpy }
}

const populatePasswordFieldAsync = async (
  password = faker.internet.password()
): Promise<void> => {
  const passwordInput = screen.getByRole('password', { name: /password/i })
  await user.click(passwordInput)
  await user.keyboard(password)
}

const populateEmailFieldAsync = async (
  email = faker.internet.email()
): Promise<void> => {
  const emailInput = screen.getByRole('textbox', { name: /email/i })
  await user.click(emailInput)
  await user.keyboard(email)
}

const simulateValidSubmitAsync = async (
  email = faker.internet.email(),
  password = faker.internet.password()
): Promise<void> => {
  await populateEmailFieldAsync(email)
  await populatePasswordFieldAsync(password)
  const submitButton = screen.getByRole('button')
  await user.click(submitButton)
}

const simulateStatusForField = (
  field: string,
  validationError?: string
): void => {
  const status = screen.getByRole('status', {
    name: new RegExp(`status-${field}`)
  })
  expect(status).toHaveClass(validationError ? 'error' : 'success')
  expect(status.title).toBe(validationError || 'Tudo certo!')
}

describe('Login Component', () => {
  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })

    const formStatus = screen.getByRole('status', { name: /request-feedback/i })
    const spinner = within(formStatus).queryByLabelText('spinner')
    const errorMessage = within(formStatus).queryByLabelText('error-message')
    expect(spinner).not.toBeInTheDocument()
    expect(errorMessage).not.toBeInTheDocument()

    const submitButton = screen.getByRole('button')
    expect(submitButton).toBeDisabled()

    simulateStatusForField('email', validationError)
    simulateStatusForField('password', validationError)
  })

  test('Should call Validation with correct email', async () => {
    const { validationSpy } = makeSut()
    const email = faker.internet.email()
    await populateEmailFieldAsync(email)
    expect(validationSpy.fieldName).toEqual('email')
    expect(validationSpy.fieldValue).toEqual(email)
  })

  test('Should call Validation with correct password', async () => {
    const { validationSpy } = makeSut()
    const password = faker.internet.password()
    await populatePasswordFieldAsync(password)
    expect(validationSpy.fieldName).toEqual('password')
    expect(validationSpy.fieldValue).toEqual(password)
  })

  test('Should show email error if Validation fails', async () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    await populateEmailFieldAsync()
    simulateStatusForField('email', validationError)
  })

  test('Should show password error if Validation fails', async () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    await populatePasswordFieldAsync()
    simulateStatusForField('password', validationError)
  })

  test('Should show valid password state  if Validation succeeds', async () => {
    makeSut()
    await populatePasswordFieldAsync()
    simulateStatusForField('password')
  })

  test('Should show valid email state  if Validation succeeds', async () => {
    makeSut()
    await populateEmailFieldAsync()
    simulateStatusForField('email')
  })

  test('Should enable submit button if form is valid', async () => {
    makeSut()
    const submitButton = screen.getByRole('button')
    await populateEmailFieldAsync()
    await populatePasswordFieldAsync()
    expect(submitButton).toBeEnabled()
  })

  test('Should show spinner on submit', async () => {
    makeSut()
    await simulateValidSubmitAsync()
    const formStatus = screen.getByRole('status', { name: /request-feedback/i })
    const spinner = within(formStatus).queryByLabelText('spinner')
    expect(spinner).toBeInTheDocument()
  })

  test('Should call Authentication with correct values', async () => {
    const { authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    await simulateValidSubmitAsync(email, password)
    expect(authenticationSpy.params).toEqual({ email, password })
  })
})
