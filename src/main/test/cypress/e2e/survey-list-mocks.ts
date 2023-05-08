import * as Http from '../utils/http-mocks'

export const mockUnexpectedError = (): void => {
  Http.mockServerError(/surveys/i, 'GET')
}

export const mockAccessDeniedError = (): void => {
  Http.mockUnauthorizedError(/surveys/i, 'GET')
}
