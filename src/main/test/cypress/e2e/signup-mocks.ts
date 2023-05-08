import { faker } from '@faker-js/faker'
import * as Http from '../utils/http-mocks'

export const mockInvalidCredentialsError = (): void => {
  Http.mockUnauthorizedError(/signup/i)
}

export const mockEmailInUseError = (): void => {
  Http.mockForbiddenError(/signup/i)
}

export const mockUnexpectedError = (): void => {
  Http.mockServerError(/signup/i, 'POST')
}

export const mockCreated = (): void => {
  Http.mockCreated(/signup/i, 'POST', { accessToken: faker.datatype.uuid() })
}
