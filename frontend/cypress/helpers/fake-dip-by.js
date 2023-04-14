export function fakeDipBy() {
  cy.intercept('GET', '**/mips/findone-by*', { fixture: 'mip9-by.json' }).as('DIP-by');
}
