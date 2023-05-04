import { faker } from '@faker-js/faker'
import { type ByRoleMatcher, screen, within } from '@testing-library/react'
import user from '@testing-library/user-event'

export const testStatusForField = (
  field: string,
  validationError = ''
): void => {
  const inputWrap = screen.getByLabelText(new RegExp(`${field}-wrap$`))
  const input = screen.getByLabelText(new RegExp(`${field}$`))
  const inputLabel = screen.getByLabelText(new RegExp(`${field}-label$`))
  expect(inputWrap).toHaveAttribute(
    'data-status',
    validationError ? 'invalid' : 'valid'
  )
  expect(input).toHaveProperty('title', validationError)
  expect(inputLabel).toHaveProperty('title', validationError)
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
