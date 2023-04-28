import React from 'react'

import {
  cleanup,
  render,
  screen,
  within,
  type RenderResult
} from '@testing-library/react'

import { SignUp } from '@/presentation/pages'

type SutTypes = {
  sut: RenderResult
}

const makeSut = (): SutTypes => {
  const sut = render(<SignUp />)
  return { sut }
}

const testStatusForField = (field: string, validationError?: string): void => {
  const status = screen.getByRole('status', {
    name: new RegExp(`status-${field}$`)
  })
  expect(status).toHaveClass(validationError ? 'error' : 'success')
  expect(status.title).toBe(validationError || 'Tudo certo!')
}

describe('Login Component', () => {
  afterEach(cleanup)

  test('Should start with initial state', () => {
    const validationError = 'Campo obrigatório'
    makeSut()

    const formStatus = screen.getByRole('status', { name: /request-feedback/i })
    const spinner = within(formStatus).queryByLabelText('spinner')
    const errorMessage = within(formStatus).queryByLabelText('error-message')
    expect(spinner).not.toBeInTheDocument()
    expect(errorMessage).not.toBeInTheDocument()

    const submitButton = screen.getByRole('button')
    expect(submitButton).toBeDisabled()

    testStatusForField('name', validationError)
    testStatusForField('email', validationError)
    testStatusForField('password', validationError)
    testStatusForField('passwordConfirmation', validationError)
  })
})
