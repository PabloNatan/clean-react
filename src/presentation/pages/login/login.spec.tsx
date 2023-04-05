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

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  validationSpy.errorMessage = faker.random.words()
  const sut = render(<Login validation={validationSpy} />)
  return { sut, validationSpy }
}

describe('Login Component', () => {
  test('Should start with initial state', () => {
    const { validationSpy } = makeSut()
    const formStatus = screen.getByRole('status', { name: /request-feedback/i })
    const spinner = within(formStatus).queryByLabelText('spinner')
    const errorMessage = within(formStatus).queryByLabelText('error-message')
    expect(spinner).not.toBeInTheDocument()
    expect(errorMessage).not.toBeInTheDocument()

    const submitButton = screen.getByRole('button')
    expect(submitButton).toBeDisabled()

    const emailStatus = screen.getByRole('status', { name: /status-email/i })
    expect(emailStatus).toHaveClass('error')
    expect(emailStatus.title).toBe(validationSpy.errorMessage)

    const passwordStatus = screen.getByRole('status', {
      name: /status-password/i
    })
    expect(passwordStatus).toHaveClass('error')
    expect(passwordStatus.title).toBe(validationSpy.errorMessage)
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
    const { validationSpy } = makeSut()
    const emailInput = screen.getByRole('textbox', { name: /email/i })

    const fakerEmail = faker.internet.email()
    await user.click(emailInput)
    await user.keyboard(fakerEmail)

    const passwordStatus = screen.getByRole('status', {
      name: /status-email/i
    })
    expect(passwordStatus).toHaveClass('error')
    expect(passwordStatus.title).toBe(validationSpy.errorMessage)
  })

  test('Should show password error if Validation fails', async () => {
    const { validationSpy } = makeSut()
    const passwordInput = screen.getByRole('password', { name: /password/i })

    await user.click(passwordInput)
    await user.keyboard(faker.internet.password())

    const passwordStatus = screen.getByRole('status', {
      name: /status-password/i
    })
    expect(passwordStatus).toHaveClass('error')
    expect(passwordStatus.title).toBe(validationSpy.errorMessage)
  })

  test('Should show valid password state  if Validation succeeds', async () => {
    const { validationSpy } = makeSut()
    validationSpy.errorMessage = null
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
    const { validationSpy } = makeSut()
    validationSpy.errorMessage = null
    const emailInput = screen.getByRole('textbox', { name: /email/i })

    await user.click(emailInput)
    await user.keyboard(faker.internet.password())

    const passwordStatus = screen.getByRole('status', {
      name: /status-email/i
    })
    expect(passwordStatus).toHaveClass('sucess')
    expect(passwordStatus.title).toBe('Tudo certo!')
  })
})
