import { faker } from '@faker-js/faker'
import { type ByRoleMatcher, screen, within } from '@testing-library/react'
import user from '@testing-library/user-event'

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

export const testButtonIsDisabled = (): void => {
  const button = screen.getByRole('button')
  expect(button).toBeDisabled()
}

export const getFormStatusComponents = (): {
  spinner: HTMLElement
  errorMessage: HTMLElement
} => {
  const formStatus = screen.getByRole('status', { name: /request-feedback/i })
  const spinner = within(formStatus).queryByLabelText('spinner')
  const errorMessage = within(formStatus).queryByLabelText('error-message')
  return { spinner, errorMessage }
}

export const populateFieldAsync = async (
  label: string,
  role: ByRoleMatcher = 'textbox',
  value = faker.random.word()
): Promise<void> => {
  const input = screen.getByRole(role, {
    name: new RegExp(`${label}$`, 'i')
  })
  await user.clear(input)
  await user.click(input)
  await user.keyboard(value)
}

export const validateFieldSucceds = async (
  sut: () => void,
  fieldName: string,
  role: ByRoleMatcher = 'textbox'
): Promise<void> => {
  sut()
  await populateFieldAsync(fieldName, role)
  testStatusForField(fieldName)
}
