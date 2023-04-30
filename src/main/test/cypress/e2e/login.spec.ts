import { faker } from '@faker-js/faker'

describe('Login', () => {
  beforeEach(() => {
    cy.visit('login')
  })
  it('Should load with correct initial state', () => {
    cy.getByLabel('status-email')
      .should('have.attr', 'title', 'Campo obrigatório')
      .should('have.class', 'error')

    cy.getByLabel('status-password')
      .should('have.attr', 'title', 'Campo obrigatório')
      .should('have.class', 'error')

    cy.get('button[type=submit]').should('have.attr', 'disabled')

    cy.getByLabel('request-feedback').should('not.have.descendants')
  })

  it('Should present error state if form is invalid', () => {
    cy.getByRoleAndLabel('email').type(faker.random.word())
    cy.getByLabel('status-email')
      .should('have.attr', 'title', 'Campo inválido')
      .should('have.class', 'error')

    cy.getByRoleAndLabel('password', 'password').type(
      faker.random.alphaNumeric(3)
    )
    cy.getByLabel('status-password')
      .should('have.attr', 'title', 'Campo inválido')
      .should('have.class', 'error')
  })
})
