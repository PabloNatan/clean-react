import { faker } from '@faker-js/faker'
import * as FormHelper from '../utils/form-helper'
import * as Http from './signup-mocks'

const simulateValidSubmit = (): void => {
  cy.typeByLabel('name', faker.name.fullName())
  cy.typeByLabel('email', faker.internet.email())
  const password = faker.internet.password()
  cy.typeByLabel('password', password)
  cy.typeByLabel('passwordConfirmation', password)
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
    Http.mockEmailInUseError()
    simulateValidSubmit()
    FormHelper.testMainError('Este e-mail já está em uso')
    FormHelper.testUrl('/signup')
  })

  it('Should present Unexpected Error on 400', () => {
    Http.mockUnexpectedError()
    simulateValidSubmit()
    FormHelper.testMainError(
      'Algo de errado aconteceu. Tente novamente em breve'
    )
    FormHelper.testUrl('/signup')
  })

  it('Should present UnexpectedError if invalid data is return', () => {
    Http.mockInvalidData()
    simulateValidSubmit()
    FormHelper.testMainError(
      'Algo de errado aconteceu. Tente novamente em breve'
    )
    FormHelper.testUrl('/signup')
  })

  it('Should save accessToken if valid credentials are provided', () => {
    Http.mockCreated()
    simulateValidSubmit()
    FormHelper.testUrl('/')
    FormHelper.testLocalStorageITem('accessToken')
  })
})
