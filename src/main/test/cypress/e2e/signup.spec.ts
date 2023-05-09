import { faker } from '@faker-js/faker'
import * as FormHelper from '../utils/form-helper'
import * as Helper from '../utils/helpers'
import * as Http from '../utils/http-mocks'

const account = require('../fixtures/account.json')

const path = /signup/i
const mockEmailInUseError = (): void => {
  Http.mockForbiddenError(path)
}
const mockUnexpectedError = (): void => {
  Http.mockServerError(path, 'POST')
}
const mockCreated = (): void => {
  Http.mockCreated(path, 'POST', account)
}

const populateFields = (): void => {
  cy.typeByLabel('name', faker.name.fullName())
  cy.typeByLabel('email', faker.internet.email())
  const password = faker.internet.password()
  cy.typeByLabel('password', password)
  cy.typeByLabel('passwordConfirmation', password)
}

const simulateValidSubmit = (): void => {
  populateFields()
  cy.get('button[type=submit]').click()
  cy.getByLabel('spinner').should('exist')
  cy.getByLabel('request-feedback').should('not.have.descendants')
}

describe('SignUp', () => {
  beforeEach(() => {
    cy.visit('signup')
  })

  it('Should load with correct initial state', () => {
    FormHelper.testInputStatus('name', 'Campo obrigatório')
    FormHelper.testInputStatus('email', 'Campo obrigatório')
    FormHelper.testInputStatus('password', 'Campo obrigatório')
    FormHelper.testInputStatus('passwordConfirmation', 'Campo obrigatório')
    cy.get('button[type=submit]').should('have.attr', 'disabled')
    cy.getByLabel('request-feedback').should('not.have.descendants')
  })

  it('Should present error state if form is invalid', () => {
    cy.typeByLabel('name', faker.random.alpha(3))
    FormHelper.testInputStatus('name', 'Campo inválido')
    cy.typeByLabel('email', faker.random.words())
    FormHelper.testInputStatus('email', 'Campo inválido')
    cy.typeByLabel('password', faker.random.alphaNumeric(3))
    FormHelper.testInputStatus('password', 'Campo inválido')
    cy.typeByLabel('passwordConfirmation', faker.random.alphaNumeric(4))
    FormHelper.testInputStatus('passwordConfirmation', 'Campo inválido')
  })

  it('Should present valid state if form is valid', () => {
    cy.typeByLabel('name', faker.name.fullName())
    FormHelper.testInputStatus('name')
    cy.typeByLabel('email', faker.internet.email())
    FormHelper.testInputStatus('email')
    const password = faker.internet.password()
    cy.typeByLabel('password', password)
    FormHelper.testInputStatus('password')
    cy.typeByLabel('passwordConfirmation', password)
    FormHelper.testInputStatus('password')
    cy.get('button[type=submit]').should('not.have.attr', 'disabled')
    cy.getByLabel('request-feedback').should('not.have.descendants')
  })

  it('Should present InvalidCredentialsError on 403', () => {
    mockEmailInUseError()
    simulateValidSubmit()
    FormHelper.testMainError('Este e-mail já está em uso')
    Helper.testUrl('/signup')
  })

  it('Should present Unexpected Error on 400', () => {
    mockUnexpectedError()
    simulateValidSubmit()
    FormHelper.testMainError(
      'Algo de errado aconteceu. Tente novamente em breve'
    )
    Helper.testUrl('/signup')
  })

  it('Should save account if valid credentials are provided', () => {
    mockCreated()
    simulateValidSubmit()
    Helper.testUrl('/')
    Helper.testLocalStorageItem('account')
  })

  it('Should prevent multiple submits', () => {
    mockCreated()
    populateFields()
    cy.get('button[type=submit]').dblclick()
    Helper.testHttpCallsCount(1)
  })

  it('Should not call submit if form is invalid', () => {
    mockCreated()
    cy.typeByLabel('email', faker.internet.email()).type('{enter}')
    Helper.testHttpCallsCount(0)
  })
})
