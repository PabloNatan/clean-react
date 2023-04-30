declare namespace Cypress {
  export interface Chainable {
    getByRole: (role: string) => Chainable<Element>
    getByLabel: (role: string) => Chainable<Element>
  }
}
