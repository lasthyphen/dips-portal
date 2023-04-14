/// <reference types="cypress" />

const dipsets = [
  "collateral-onboarding-dipset",
  "core-governance-dipset",
  "core-unit-framework-dipset",
];

Given("The user opens DIP Sets view", () => {
  cy.visit("/dips/list?dipsetMode=true");
  cy.get(".maker-loading-shade").should("not.exist");
  cy.wait(1000);
});

And("DIP Set number {string} is open", (dipNumber) => {
  cy.wait(10000); // todo find an alternative for the long wait
  cy.get(`[data-cy=dipset-row-${dipsets[+dipNumber - 1]}]`).click();
});

And("DIP Set number {string} is open in mobile mode", (dipNumber) => {
  cy.wait(10000); // todo find an alternative for the long wait
  cy.get("div.mobile > button")
    .eq(+dipNumber - 1)
    .click();
});

Then(
  "DIP Set number {string} should match snapshot with image suffix {string}",
  (dipNumber, imageSuffix) => {
    cy.get("tr.maker-detail-dipset-row")
      .eq(+dipNumber - 1)
      .then(($el) => {
        cy.testScreenshot(
          $el,
          `dip-sets/${dipsets[+dipNumber - 1]}-${imageSuffix}`
        );
      });
  }
);

Then(
  "DIP Set number {string} should match snapshot with image suffix {string} in mobile mode",
  (dipNumber, imageSuffix) => {
    cy.get("div.ng-trigger-dipsetExpand")
      .eq(+dipNumber - 1)
      .then(($el) => {
        cy.testScreenshot(
          $el,
          `dip-sets/${dipsets[+dipNumber - 1]}-${imageSuffix}`
        );
      });
  }
);
