import { ValidationSpy } from '@/presentation/test'
import {
  render,
  screen,
  within,
  type RenderResult
} from '@testing-library/react'
import faker from 'faker'
import user from '@testing-library/user-event'
import React from 'react'
import { Login } from './login'
import {
  type Authentication,
  type AuthenticationParams
} from '@/domain/usecases'
import { type AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/test'

class AuthenticationSpy implements Authentication {
  account = mockAccountModel()
  params: AuthenticationParams
  async auth(params: AuthenticationParams): Promise<AccountModel> {
    this.params = params
    return Promise.resolve(this.account)
  }
}

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

    const emailStatus = screen.getByRole('status', { name: /status-email/i })
    expect(emailStatus).toHaveClass('error')
    expect(emailStatus.title).toBe(validationError)

    const passwordStatus = screen.getByRole('status', {
      name: /status-password/i
    })
    expect(passwordStatus).toHaveClass('error')
    expect(passwordStatus.title).toBe(validationError)
  })

  test('Should call Validation with correct email', async () => {
    const { validationSpy } = makeSut()
    const emailInput = screen.getByRole('textbox', { name: /email/i })
    const email = faker.internet.email()
    await user.click(emailInput)
    await user.keyboard(email)
    expect(validationSpy.fieldName).toEqual('email')
    expect(validationSpy.fieldValue).toEqual(email)
  })

  test('Should call Validation with correct password', async () => {
    const { validationSpy } = makeSut()
    const passwordInput = screen.getByRole('password', { name: /password/i })
    const password = faker.internet.password()
    await user.click(passwordInput)
    await user.keyboard(password)
    expect(validationSpy.fieldName).toEqual('password')
    expect(validationSpy.fieldValue).toEqual(password)
  })

  test('Should show email error if Validation fails', async () => {
    const validationError = faker.random.words()
    makeSut({ validationError })

    const emailInput = screen.getByRole('textbox', { name: /email/i })

    const fakerEmail = faker.internet.email()
    await user.click(emailInput)
    await user.keyboard(fakerEmail)

    const passwordStatus = screen.getByRole('status', {
      name: /status-email/i
    })
    expect(passwordStatus).toHaveClass('error')
    expect(passwordStatus.title).toBe(validationError)
  })

  test('Should show password error if Validation fails', async () => {
    const validationError = faker.random.words()
    makeSut({ validationError })

    const passwordInput = screen.getByRole('password', { name: /password/i })

    await user.click(passwordInput)
    await user.keyboard(faker.internet.password())

    const passwordStatus = screen.getByRole('status', {
      name: /status-password/i
    })
    expect(passwordStatus).toHaveClass('error')
    expect(passwordStatus.title).toBe(validationError)
  })

  test('Should show valid password state  if Validation succeeds', async () => {
    makeSut()

    const passwordInput = screen.getByRole('password', { name: /password/i })

    await user.click(passwordInput)
    await user.keyboard(faker.internet.password())

    const passwordStatus = screen.getByRole('status', {
      name: /status-password/i
    })
    expect(passwordStatus).toHaveClass('sucess')
    expect(passwordStatus.title).toBe('Tudo certo!')
  })

  test('Should show valid email state  if Validation succeeds', async () => {
    makeSut()

    const emailInput = screen.getByRole('textbox', { name: /email/i })

    await user.click(emailInput)
    await user.keyboard(faker.internet.email())

    const emailStatus = screen.getByRole('status', {
      name: /status-email/i
    })
    expect(emailStatus).toHaveClass('sucess')
    expect(emailStatus.title).toBe('Tudo certo!')
  })

  test('Should enable submit button if form is valid', async () => {
    makeSut()
    const submitButton = screen.getByRole('button')

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    await user.click(emailInput)
    await user.keyboard(faker.internet.email())

    const passwordInput = screen.getByRole('password', { name: /password/i })
    await user.click(passwordInput)
    await user.keyboard(faker.internet.password())

    expect(submitButton).toBeEnabled()
  })

  test('Should show spinner on submit', async () => {
    makeSut()
    const submitButton = screen.getByRole('button')

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    await user.click(emailInput)
    await user.keyboard(faker.internet.email())

    const passwordInput = screen.getByRole('password', { name: /password/i })
    await user.click(passwordInput)
    await user.keyboard(faker.internet.password())

    await user.click(submitButton)

    const formStatus = screen.getByRole('status', { name: /request-feedback/i })
    const spinner = within(formStatus).queryByLabelText('spinner')

    expect(spinner).toBeInTheDocument()
  })

  test('Should call Authentication with correct values', async () => {
    const { authenticationSpy } = makeSut()
    const submitButton = screen.getByRole('button')

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    const email = faker.internet.email()
    await user.click(emailInput)
    await user.keyboard(email)

    const passwordInput = screen.getByRole('password', { name: /password/i })
    const password = faker.internet.password()
    await user.click(passwordInput)
    await user.keyboard(password)

    await user.click(submitButton)

    expect(authenticationSpy.params).toEqual({ email, password })
  })
})
