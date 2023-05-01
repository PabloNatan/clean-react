import { faker } from '@faker-js/faker'
import * as FormHelper from '../utils/form-helper'
import * as Http from './login-mocks'

const simulateValidSubmit = (): void => {
  cy.typeByLabel('email', faker.internet.email())
  cy.typeByLabel('password', faker.random.alphaNumeric(5))
  cy.get('button[type=submit]').click()
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
    cy.get('button[type=submit]').should('not.have.attr', 'disabled')
    cy.getByLabel('request-feedback').should('not.have.descendants')
  })

  it('Should present InvalidCredentialsError on 401', () => {
    Http.mockInvalidCredentialsError()
    simulateValidSubmit()
    cy.getByLabel('spinner').should('exist')
    cy.getByLabel('request-feedback').should('not.have.descendants')
    FormHelper.testMainError('Credenciais inválidas')
    FormHelper.testUrl('/login')
  })

  it('Should present Unexpected Error on 400', () => {
    Http.mockUnexpectedError()
    simulateValidSubmit()
    cy.getByLabel('spinner').should('exist')
    cy.getByLabel('request-feedback').should('not.have.descendants')
    FormHelper.testMainError(
      'Algo de errado aconteceu. Tente novamente em breve'
    )
    FormHelper.testUrl('/login')
  })

  it('Should present UnexpectedError if invalid data is return', () => {
    Http.mockInvalidData()
    simulateValidSubmit()
    cy.getByLabel('spinner').should('exist')
    cy.getByLabel('request-feedback').should('not.have.descendants')
    FormHelper.testMainError(
      'Algo de errado aconteceu. Tente novamente em breve'
    )
    FormHelper.testUrl('/login')
  })

  it('Should present save accessToken if valid credentials are provided', () => {
    Http.mockOk()
    simulateValidSubmit()
    cy.getByLabel('spinner').should('exist')
    cy.getByLabel('request-feedback').should('not.have.descendants')
    FormHelper.testUrl('/')
    FormHelper.testLocalStorageITem('accessToken')
  })

  it('Should present multiple submits', () => {
    Http.mockOk()
    cy.typeByLabel('email', faker.internet.email())
    cy.typeByLabel('password', faker.random.alphaNumeric(5))
    cy.get('button[type=submit]').dblclick()
    FormHelper.testHttpCallsCount(1)
  })

  it('Should not call submit if form is invalid', () => {
    Http.mockOk()
    cy.typeByLabel('email', faker.internet.email()).type('{enter}')
    FormHelper.testHttpCallsCount(0)
  })
})
