import { faker } from '@faker-js/faker'
import { type Method } from 'cypress/types/net-stubbing'

const delay = 50

export const mockInvalidCredentialsError = (url: RegExp): void => {
  cy.intercept('POST', url, {
    statusCode: 401,
    delay,
    body: {
      error: faker.random.words()
    }
  }).as('request')
}

export const mockEmailInUseError = (url: RegExp): void => {
  cy.intercept('POST', url, {
    statusCode: 403,
    delay,
    body: {
      error: faker.random.words()
    }
  }).as('request')
}

export const mockUnexpectedError = (url: RegExp, method: Method): void => {
  cy.intercept(method, url, {
    statusCode: faker.helpers.arrayElement([400, 404, 500]),
    delay,
    body: {
      error: faker.random.words()
    }
  }).as('request')
}

export const mockOk = (url: RegExp, method: Method, body: object): void => {
  cy.intercept(method, url, {
    statusCode: 200,
    delay,
    body
  }).as('request')
}
