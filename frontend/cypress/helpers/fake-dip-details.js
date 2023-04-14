export function fakeDip() {
  cy.intercept('GET', '**/mips/findone*', { fixture: 'mip.json' }).as('DIP');
}
