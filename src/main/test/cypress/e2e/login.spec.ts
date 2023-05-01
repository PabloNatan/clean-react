import { faker } from '@faker-js/faker'

const baseUrl: string = Cypress.config().baseUrl
const requestDelay = 100

describe('Login', () => {
  beforeEach(() => {
    cy.visit('login')
  })

  it('Should load with correct initial state', () => {
    cy.getByLabel('email')
      .should('have.attr', 'title', 'Campo obrigatório')
      .siblings('label')
      .should('have.attr', 'title', 'Campo obrigatório')
      .parent()
      .should('have.attr', 'data-status', 'invalid')
    cy.getByLabel('password')
      .should('have.attr', 'title', 'Campo obrigatório')
      .siblings('label')
      .should('have.attr', 'title', 'Campo obrigatório')
      .parent()
      .should('have.attr', 'data-status', 'invalid')
    cy.get('button[type=submit]').should('have.attr', 'disabled')
    cy.getByLabel('request-feedback').should('not.have.descendants')
  })

  it('Should present error state if form is invalid', () => {
    cy.typeByLabel('email', faker.random.words())
      .should('have.attr', 'title', 'Campo inválido')
      .siblings('label')
      .should('have.attr', 'title', 'Campo inválido')
      .parent()
      .should('have.attr', 'data-status', 'invalid')
    cy.typeByLabel('password', faker.random.alphaNumeric(3))
      .should('have.attr', 'title', 'Campo inválido')
      .siblings('label')
      .should('have.attr', 'title', 'Campo inválido')
      .parent()
      .should('have.attr', 'data-status', 'invalid')
  })

  it('Should present valid state if form is valid', () => {
    cy.typeByLabel('email', faker.internet.email()).should(
      'not.have.attr',
      'title'
    )
    cy.getByLabel('email-label').should('not.have.attr', 'title')
    cy.getByLabel('email').parent().should('have.attr', 'data-status', 'valid')
    cy.typeByLabel('password', faker.random.alphaNumeric(5)).should(
      'not.have.attr',
      'title'
    )
    cy.getByLabel('password-label').should('not.have.attr', 'title')
    cy.getByLabel('password')
      .parent()
      .should('have.attr', 'data-status', 'valid')
    cy.get('button[type=submit]').should('not.have.attr', 'disabled')
    cy.getByLabel('request-feedback').should('not.have.descendants')
  })

  it('Should present InvalidCredentialsError on 401', () => {
    cy.intercept('POST', /login/i, {
      statusCode: 401,
      delay: requestDelay
    })
    cy.typeByLabel('email', faker.internet.email())
    cy.typeByLabel('password', faker.random.alphaNumeric(5))
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
    cy.intercept('POST', /login/i, {
      statusCode: 400,
      delay: requestDelay
    })
    cy.typeByLabel('email', faker.internet.email())
    cy.typeByLabel('password', faker.random.alphaNumeric(5))
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
    cy.intercept('POST', /login/i, {
      statusCode: 200,
      delay: requestDelay,
      body: {}
    })
    cy.typeByLabel('email', faker.internet.email())
    cy.typeByLabel('password', faker.random.alphaNumeric(5))
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
    cy.intercept('POST', /login/i, {
      statusCode: 200,
      delay: requestDelay,
      body: {
        accessToken: faker.datatype.uuid()
      }
    })
    cy.typeByLabel('email', faker.internet.email())
    cy.typeByLabel('password', faker.random.alphaNumeric(5)).type('{enter}')
    cy.getByLabel('spinner').should('exist')
    cy.getByLabel('error-message').should('not.exist')
    cy.getByLabel('spinner').should('not.exist')
    cy.url().should('eq', `${baseUrl}/`)
    cy.window().then((window) =>
      assert.isOk(window.localStorage.getItem('accessToken'))
    )
  })

  it('Should present multiple submits', () => {
    cy.intercept('POST', /login/i, {
      statusCode: 200,
      delay: requestDelay,
      body: {
        accessToken: faker.datatype.uuid()
      }
    }).as('request')
    cy.typeByLabel('email', faker.internet.email())
    cy.typeByLabel('password', faker.random.alphaNumeric(5))
    cy.get('button[type=submit]').dblclick()
    cy.get('@request.all').should('have.length', 1)
  })

  it('Should not call submit if form is invalid', () => {
    cy.intercept('POST', /login/i, {
      statusCode: 200,
      delay: requestDelay,
      body: {
        accessToken: faker.datatype.uuid()
      }
    }).as('request')
    cy.typeByLabel('email', faker.internet.email()).type('{enter}')
    cy.get('@request.all').should('have.length', 0)
  })
})
