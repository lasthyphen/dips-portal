/// <reference types="Cypress" />

Then(
  "DIP description component matches snapshot with image {string}",
  (imageName) => {
    cy.get("[data-cy=table-list-dips] tbody tr")
      .first()
      .then(($tr) => {
        cy.wrap($tr).find("td.mat-column-summary button").click();
        cy.testScreenshot($tr, imageName);
        cy.wrap($tr).find("td.mat-column-summary button").click();
      });
  }
);

Then("DIP component matches snapshot with image {string}", (imageName) => {
  cy.get("[data-cy=table-list-dips] tbody tr")
    .eq(4)
    .then(($tr) => {
      cy.wrap($tr).find("td:first-child button").click();
      cy.testScreenshot($tr.next(), imageName);
    });
});

Then(
  "DIP description component matches snapshot with image {string} in mobile mode",
  (imageName) => {
    cy.get(".mobile-container")
      .eq(3)
      .then(($tr) => {
        cy.wrap($tr).find(".mat-button-wrapper").eq(0).click({ force: true });
        cy.testScreenshot($tr, imageName);
      });
  }
);

Then(
  "DIP component matches snapshot with image {string} in mobile mode",
  (imageName) => {
    cy.get(".mobile-container")
      .eq(3)
      .then(($tr) => {
        cy.wrap($tr).find(".mat-button-wrapper").eq(1).click({ force: true });
        cy.testScreenshot($tr.next(), imageName);
      });
  }
);
