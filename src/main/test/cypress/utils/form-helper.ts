const baseUrl: string = Cypress.config().baseUrl

export const testInputStatus = (field: string, error?: string): void => {
  cy.getByLabel(field)
    .parent()
    .should('have.attr', 'data-status', error ? 'invalid' : 'valid')
  const attr = `${error ? '' : 'not.'}have.attr`
  cy.getByLabel(field).should(attr, 'title', error)
  cy.getByLabel(`${field}-label`).should(attr, 'title', error)
}

export const testMainError = (error: string): void => {
  cy.getByLabel('error-message').should('exist')
  cy.getByLabel('error-message').should('contain.text', error)
}

export const testHttpCallsCount = (count: number): void => {
  cy.get('@request.all').should('have.length', count)
}

export const testUrl = (path: string): void => {
  cy.url().should('eq', `${baseUrl}${path}`)
}

export const testLocalStorageITem = (key: string): void => {
  cy.window().then((window) => assert.isOk(window.localStorage.getItem(key)))
}
