import * as Helper from '../utils/helpers'
import * as Http from '../utils/http-mocks'

const path = /surveys/i
const mockUnexpectedError = (): void => {
  Http.mockServerError(path, 'GET')
}
const mockAccessDeniedError = (): void => {
  Http.mockUnauthorizedError(path, 'GET')
}

describe('SurveyList', () => {
  beforeEach(() => {
    cy.fixture('account').then((account) => {
      Helper.setLocalStorageItem('account', account)
    })
    cy.visit('')
  })

  it('Should present error on UnexpectedError', () => {
    mockUnexpectedError()
    cy.findByTestId('error-wrap').should(
      'contain.text',
      'Algo de errado aconteceu. Tente novamente em breve'
    )
  })

  it('Should present error on UnexpectedError', () => {
    mockAccessDeniedError()
    Helper.testUrl('/login')
  })

  it('Should present correct username', () => {
    mockUnexpectedError()
    const { name } = Helper.getLocalStorageItem('account')
    cy.getByLabel('username').should('contain.text', name)
  })

  it('Should logout on logout link click', () => {
    mockUnexpectedError()
    cy.findByRole('link', { name: /sair/i }).click()
    Helper.testUrl('/login')
  })
})
