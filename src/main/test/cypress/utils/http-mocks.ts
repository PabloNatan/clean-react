import { faker } from '@faker-js/faker'
import { type Method } from 'cypress/types/net-stubbing'

const delay = 300

export const mockUnauthorizedError = (
  url: RegExp,
  method: Method = 'POST'
): void => {
  cy.intercept(method, url, {
    statusCode: 401,
    delay,
    body: {
      error: faker.random.words()
    }
  }).as('request')
}

export const mockForbiddenError = (url: RegExp): void => {
  cy.intercept('POST', url, {
    statusCode: 403,
    delay,
    body: {
      error: faker.random.words()
    }
  }).as('request')
}

export const mockServerError = (url: RegExp, method: Method): void => {
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

export const mockCreated = (
  url: RegExp,
  method: Method,
  body: object
): void => {
  cy.intercept(method, url, {
    statusCode: 201,
    delay,
    body
  }).as('request')
}
