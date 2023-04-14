/// <reference types="cypress" />

Given("The user opens Details view for DIP1", () => {
  cy.visit("/dips/details/DIP1");
  cy.wait(700);
});
