import { faker } from '@faker-js/faker'
import * as Http from '../utils/http-mocks'

export const mockInvalidCredentialsError = (): void => {
  Http.mockUnauthorizedError(/login/i)
}

export const mockUnexpectedError = (): void => {
  Http.mockServerError(/login/i, 'POST')
}

export const mockOk = (): void => {
  Http.mockOk(/login/i, 'POST', { accessToken: faker.datatype.uuid() })
}

export const mockInvalidData = (): void => {
  Http.mockOk(/login/i, 'POST', null)
}
