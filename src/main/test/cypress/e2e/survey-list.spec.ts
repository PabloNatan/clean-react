import { faker } from '@faker-js/faker'
import * as Helper from '../utils/helpers'
import * as Http from './survey-list-mocks'

describe('SurveyList', () => {
  beforeEach(() => {
    Helper.setLocalStorageItem('account', {
      accessToken: faker.datatype.uuid(),
      name: faker.name.fullName()
    })
    cy.visit('')
  })

  it('Should present error on UnexpectedError', () => {
    Http.mockUnexpectedError()
    cy.findByTestId('error-wrap').should(
      'contain.text',
      'Algo de errado aconteceu. Tente novamente em breve'
    )
  })

  it('Should present error on UnexpectedError', () => {
    Http.mockAccessDeniedError()
    Helper.testUrl('/login')
  })

  it('Should present correct username', () => {
    Http.mockUnexpectedError()
    const { name } = Helper.getLocalStorageItem('account')
    cy.getByLabel('username').should('contain.text', name)
  })

  it('Should logout on logout link click', () => {
    Http.mockUnexpectedError()
    cy.findByRole('link', { name: /sair/i }).click()
    Helper.testUrl('/login')
  })
})
