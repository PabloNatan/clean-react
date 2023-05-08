type RoleMatcher = 'textbox' | 'password'
declare namespace Cypress {
  export interface Chainable {
    getByTestId: (elementId: string) => Chainable<Element>
    getByRole: (role: string) => Chainable<Element>
    getByLabel: (role: string) => Chainable<Element>
    getByRoleAndLabel: (label: string, role?: RoleMatcher) => Chainable<Element>
    typeByLabel: (label: string, text?: string) => Chainable<Element>
  }
}
