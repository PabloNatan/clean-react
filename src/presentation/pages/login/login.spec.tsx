import React from 'react'
import { render, screen, within } from '@testing-library/react'
import { Login } from './login'

describe('Login Component', () => {
  test('Should not render spinner and error on start', () => {
    render(<Login />)
    const formStatus = screen.getByRole('status')
    const spinner = within(formStatus).queryByLabelText('spinner')
    const errorMessage = within(formStatus).queryByLabelText('error-message')
    expect(spinner).not.toBeInTheDocument()
    expect(errorMessage).not.toBeInTheDocument()
  })
})
