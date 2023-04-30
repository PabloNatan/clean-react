import { faker } from '@faker-js/faker'

const baseUrl: string = Cypress.config().baseUrl

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

  it('Should present valid state if form is valid', () => {
    cy.getByRoleAndLabel('email').type(faker.internet.email())
    cy.getByLabel('status-email')
      .should('have.attr', 'title', 'Tudo certo!')
      .should('have.class', 'success')

    cy.getByRoleAndLabel('password', 'password').type(
      faker.random.alphaNumeric(6)
    )
    cy.getByLabel('status-password')
      .should('have.attr', 'title', 'Tudo certo!')
      .should('have.class', 'success')

    cy.get('button[type=submit]').should('not.have.attr', 'disabled')
    cy.getByLabel('request-feedback').should('not.have.descendants')
  })

  it('Should present error if invalid credentials are provided', () => {
    cy.getByRoleAndLabel('email').focus().type(faker.internet.email())
    cy.getByRoleAndLabel('password', 'password')
      .focus()
      .type(faker.random.alphaNumeric(6))

    cy.get('button[type=submit]').click()
    cy.getByLabel('request-feedback')
      .getByLabel('spinner')
      .should('exist')
      .getByLabel('error-message')
      .should('not.exist')
      .getByLabel('spinner')
      .should('not.exist')
      .getByLabel('error-message')
      .should('exist')
      .getByLabel('error-message')
      .should('contain.text', 'Credenciais inválidas')

    cy.url().should('eq', `${baseUrl}/login`)
  })
})
