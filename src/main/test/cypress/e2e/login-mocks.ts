import { faker } from '@faker-js/faker'
import * as Helper from '../utils/http-mocks'

export const mockInvalidCredentialsError = (): void => {
  Helper.mockInvalidCredentialsError(/login/i)
}

export const mockUnexpectedError = (): void => {
  Helper.mockUnexpectedError(/login/i, 'POST')
}

export const mockOk = (): void => {
  Helper.mockOk(/login/i, 'POST', { accessToken: faker.datatype.uuid() })
}

export const mockInvalidData = (): void => {
  Helper.mockOk(/login/i, 'POST', null)
}
