import React from 'react'
import { render, screen, within } from '@testing-library/react'
import { Login } from './login'

describe('Login Component', () => {
  test('Should start with initial state', () => {
    render(<Login />)
    const formStatus = screen.getByRole('status', { name: /request-feedback/i })
    const spinner = within(formStatus).queryByLabelText('spinner')
    const errorMessage = within(formStatus).queryByLabelText('error-message')

    expect(spinner).not.toBeInTheDocument()
    expect(errorMessage).not.toBeInTheDocument()

    const submitButton = screen.getByRole('button')
    expect(submitButton).toBeDisabled()

    const emailStatus = screen.getByRole('status', { name: /status-email/i })
    const passwordStatus = screen.getByRole('status', {
      name: /status-password/i
    })
    expect(emailStatus).toHaveClass('error')
    expect(emailStatus.title).toBe('Campo obrigatório')
    expect(passwordStatus).toHaveClass('error')
    expect(passwordStatus.title).toBe('Campo obrigatório')
  })
})
