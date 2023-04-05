import React from 'react'
import {
  type RenderResult,
  render,
  screen,
  within
} from '@testing-library/react'
import user from '@testing-library/user-event'
import { Login } from './login'
import { type Validation } from '@/presentation/protocols/validation'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
}

class ValidationSpy implements Validation {
  errorMessage: string
  fieldName: string
  fieldValue: string

  validate(fieldName: string, fieldValue: string): string {
    this.fieldName = fieldName
    this.fieldValue = fieldValue
    return this.errorMessage
  }
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const sut = render(<Login validation={validationSpy} />)
  return { sut, validationSpy }
}

describe('Login Component', () => {
  test('Should start with initial state', () => {
    makeSut()
    const formStatus = screen.getByRole('status', { name: /request-feedback/i })
    const spinner = within(formStatus).queryByLabelText('spinner')
    const errorMessage = within(formStatus).queryByLabelText('error-message')
    expect(spinner).not.toBeInTheDocument()
    expect(errorMessage).not.toBeInTheDocument()

    const submitButton = screen.getByRole('button')
    expect(submitButton).toBeDisabled()

    const emailStatus = screen.getByRole('status', { name: /status-email/i })
    expect(emailStatus).toHaveClass('error')
    expect(emailStatus.title).toBe('Campo obrigatório')

    const passwordStatus = screen.getByRole('status', {
      name: /status-password/i
    })
    expect(passwordStatus).toHaveClass('error')
    expect(passwordStatus.title).toBe('Campo obrigatório')
  })

  test('Should call Validation with correct email', async () => {
    const { validationSpy } = makeSut()
    const emailInput = screen.getByRole('textbox', { name: /email/i })
    await user.click(emailInput)
    await user.keyboard('any_email')
    expect(validationSpy.fieldName).toEqual('email')
    expect(validationSpy.fieldValue).toEqual('any_email')
  })
  test('Should call Validation with correct password', async () => {
    const { validationSpy } = makeSut()
    const passwordInput = screen.getByRole('password', { name: /password/i })
    await user.click(passwordInput)
    await user.keyboard('any_password')
    expect(validationSpy.fieldName).toEqual('password')
    expect(validationSpy.fieldValue).toEqual('any_password')
  })
})
