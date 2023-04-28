import { screen } from '@testing-library/react'

export const testStatusForField = (
  field: string,
  validationError?: string
): void => {
  const status = screen.getByRole('status', {
    name: new RegExp(`status-${field}$`)
  })
  expect(status).toHaveClass(validationError ? 'error' : 'success')
  expect(status.title).toBe(validationError || 'Tudo certo!')
}
