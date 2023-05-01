import * as FormHelper from '../utils/form-helper'

describe('SignUp', () => {
  beforeEach(() => {
    cy.visit('signup')
  })

  it('Should load with correct initial state', () => {
    FormHelper.testInputStatus('name', 'Campo obrigatório')
    FormHelper.testInputStatus('email', 'Campo obrigatório')
    FormHelper.testInputStatus('password', 'Campo obrigatório')
    FormHelper.testInputStatus('passowrdConfirmation', 'Campo obrigatório')
    cy.get('button[type=submit]').should('have.attr', 'disabled')
    cy.getByLabel('request-feedback').should('not.have.descendants')
  })
})
