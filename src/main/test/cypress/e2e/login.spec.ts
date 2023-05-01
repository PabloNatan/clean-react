import { faker } from '@faker-js/faker'

const baseUrl: string = Cypress.config().baseUrl
const requestDelay = 100

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

  it('Should present InvalidCredentialsError on 401', () => {
    cy.getByRoleAndLabel('email').focus().type(faker.internet.email())
    cy.getByRoleAndLabel('password', 'password')
      .focus()
      .type(faker.random.alphaNumeric(6))

    cy.intercept('POST', /login/i, {
      statusCode: 401,
      delay: requestDelay
    })

    cy.get('button[type=submit]').click()

    cy.getByLabel('spinner').should('exist')
    cy.getByLabel('error-message').should('not.exist')
    cy.getByLabel('spinner').should('not.exist')
    cy.getByLabel('error-message').should('exist')
    cy.getByLabel('error-message').should(
      'contain.text',
      'Credenciais inválidas'
    )
    cy.url().should('eq', `${baseUrl}/login`)
  })

  it('Should present Unexpected Error on 400', () => {
    cy.getByRoleAndLabel('email').focus().type(faker.internet.email())
    cy.getByRoleAndLabel('password', 'password')
      .focus()
      .type(faker.random.alphaNumeric(6))

    cy.intercept('POST', /login/i, {
      statusCode: 400,
      delay: requestDelay
    })

    cy.get('button[type=submit]').click()

    cy.getByLabel('spinner').should('exist')
    cy.getByLabel('error-message').should('not.exist')
    cy.getByLabel('spinner').should('not.exist')
    cy.getByLabel('error-message').should('exist')
    cy.getByLabel('error-message').should(
      'contain.text',
      'Algo de errado aconteceu. Tente novamente em breve'
    )
    cy.url().should('eq', `${baseUrl}/login`)
  })

  it('Should present UnexpectedError if invalid data is return', () => {
    cy.getByRoleAndLabel('email').focus().type('pablo@email.com')
    cy.getByRoleAndLabel('password', 'password').focus().type('123456')

    cy.intercept('POST', /login/i, {
      statusCode: 200,
      delay: requestDelay,
      body: {}
    })

    cy.get('button[type=submit]').click()

    cy.getByLabel('spinner').should('exist')
    cy.getByLabel('error-message').should('not.exist')
    cy.getByLabel('spinner').should('not.exist')
    cy.getByLabel('error-message').should('exist')
    cy.getByLabel('error-message').should(
      'contain.text',
      'Algo de errado aconteceu. Tente novamente em breve'
    )
    cy.url().should('eq', `${baseUrl}/login`)
  })

  it('Should present save accessToken if valid credentials are provided', () => {
    cy.getByRoleAndLabel('email').focus().type(faker.internet.email())
    cy.getByRoleAndLabel('password', 'password')
      .focus()
      .type(faker.random.alphaNumeric(6))

    cy.intercept('POST', /login/i, {
      statusCode: 200,
      delay: requestDelay,
      body: {
        accessToken: faker.datatype.uuid()
      }
    })

    cy.get('button[type=submit]').click()
    cy.getByLabel('spinner').should('exist')
    cy.getByLabel('error-message').should('not.exist')
    cy.getByLabel('spinner').should('not.exist')
    cy.url().should('eq', `${baseUrl}/`)
    cy.window().then((window) =>
      assert.isOk(window.localStorage.getItem('accessToken'))
    )
  })
})
