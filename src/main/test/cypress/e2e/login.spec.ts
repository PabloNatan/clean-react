import { faker } from '@faker-js/faker'
import * as FormHelper from '../utils/form-helper'
import * as Helper from '../utils/helpers'
import * as Http from '../utils/http-mocks'

const path = /login/i
const mockInvalidCredentialsError = (): void => {
  Http.mockUnauthorizedError(path)
}
const mockUnexpectedError = (): void => {
  Http.mockServerError(path, 'POST')
}
const mockSuccess = (): void => {
  Http.mockOk(/api\/surveys/, 'GET', 'survey-list')
  Http.mockOk(path, 'POST', 'account', 'loginRequest')
}

const populateFields = (): void => {
  cy.typeByLabel('email', faker.internet.email())
  cy.typeByLabel('password', faker.random.alphaNumeric(5))
}

const simulateValidSubmit = (): void => {
  populateFields()
  cy.get('button[type=submit]').click()
  cy.getByLabel('spinner').should('exist')
}

describe('Login', () => {
  beforeEach(() => {
    cy.visit('login')
  })

  it('Should load with correct initial state', () => {
    FormHelper.testInputStatus('email', 'Campo obrigatório')
    FormHelper.testInputStatus('password', 'Campo obrigatório')
    cy.get('button[type=submit]').should('have.attr', 'disabled')
    cy.getByLabel('request-feedback').should('not.have.descendants')
  })

  it('Should present error state if form is invalid', () => {
    cy.typeByLabel('email', faker.random.words())
    FormHelper.testInputStatus('email', 'Campo inválido')
    cy.typeByLabel('password', faker.random.alphaNumeric(3))
    FormHelper.testInputStatus('password', 'Campo inválido')
  })

  it('Should present valid state if form is valid', () => {
    cy.typeByLabel('email', faker.internet.email())
    FormHelper.testInputStatus('email')
    cy.typeByLabel('password', faker.random.alphaNumeric(5))
    FormHelper.testInputStatus('password')
    cy.findByRole('button').should('not.have.attr', 'disabled')
    cy.getByLabel('request-feedback').should('not.have.descendants')
  })

  it('Should present InvalidCredentialsError on 401', () => {
    mockInvalidCredentialsError()
    simulateValidSubmit()
    FormHelper.testMainError('Credenciais inválidas')
    Helper.testUrl('/login')
  })

  it('Should present Unexpected Error on 400', () => {
    mockUnexpectedError()
    simulateValidSubmit()
    FormHelper.testMainError(
      'Algo de errado aconteceu. Tente novamente em breve'
    )
    Helper.testUrl('/login')
  })

  it('Should present save account if valid credentials are provided', () => {
    mockSuccess()
    simulateValidSubmit()
    Helper.testUrl('/')
    Helper.testLocalStorageItem('account')
  })

  it('Should prevent multiple submits', () => {
    mockSuccess()
    populateFields()
    // cy.getByTestId('submit').dblclick()
    cy.getByTestId('submit').click()
    cy.wait('@loginRequest')
    cy.get('@loginRequest.all').should('have.length', 1)
  })

  it('Should not call submit if form is invalid', () => {
    mockSuccess()
    cy.typeByLabel('email', faker.internet.email()).type('{enter}')
    Helper.testHttpCallsCount(0)
  })
})
