import { faker } from '@faker-js/faker'
import * as Helper from '../utils/http-mocks'

export const mockInvalidCredentialsError = (): void => {
  Helper.mockInvalidCredentialsError(/signup/i)
}

export const mockEmailInUseError = (): void => {
  Helper.mockEmailInUseError(/signup/i)
}

export const mockUnexpectedError = (): void => {
  Helper.mockUnexpectedError(/signup/i, 'POST')
}

export const mockCreated = (): void => {
  Helper.mockCreated(/signup/i, 'POST', { accessToken: faker.datatype.uuid() })
}

export const mockInvalidData = (): void => {
  Helper.mockOk(/signup/i, 'POST', null)
}
