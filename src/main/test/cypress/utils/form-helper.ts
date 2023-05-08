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
  cy.getByLabel('spinner').should('not.exist')
}
