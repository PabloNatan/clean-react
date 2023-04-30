Cypress.Commands.add('getByRole', (role) => cy.get(`[role=${role}]`))
Cypress.Commands.add('getByLabel', (label) => cy.get(`[aria-label=${label}]`))
