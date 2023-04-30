import '@testing-library/cypress/add-commands'
Cypress.Commands.add('getByRole', (role) => cy.get(`[role=${role}]`))
Cypress.Commands.add('getByLabel', (label) => cy.get(`[aria-label=${label}]`))
Cypress.Commands.add('getByRoleAndLabel', (label, role = 'textbox') =>
  cy.findByRole(role, { name: new RegExp(label, 'i') })
)
