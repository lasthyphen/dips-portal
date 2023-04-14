/// <reference types="cypress" />

const { fakeMenu } = require("../../helpers/fake-menu");
const { fakeDips } = require("../../helpers/fake-dips");
const { fakeNews } = require("../../helpers/fake-news");
const { fakeVars } = require("../../helpers/fake-vars");

const dipsets = [
  "collateral-onboarding-dipset",
  "core-governance-dipset",
  "core-unit-framework-dipset",
];

describe("Dip Sets View", () => {
  before(() => {
    fakeVars();
    fakeNews();
    fakeDips();
    fakeMenu();
    cy.viewport(1536, 600);
    cy.visit("/dips/list?dipsetMode=true");
    cy.get(".maker-loading-shade").should("not.exist");
  });

  it("Entire View", () => {
    Cypress.$("app-button-top").remove();
    cy.testScreenshot(null, "dip-sets/entire-view");
  });

  it(`Dip sets`, () => {
    dipsets.forEach((dipset, idx) => {
      fakeDips();
      cy.wait(700);
      cy.get(`[data-cy=dipset-row-${dipset}]`).click();
      cy.wait("@DIPs");
      cy.wait(700);
      cy.get("tr.maker-detail-dipset-row")
        .eq(idx)
        .then(($el) => {
          cy.testScreenshot($el, `dip-sets/${dipset}-content`);
        });
      // so it includes the dropdown menu status
      cy.testScreenshot(null, `dip-sets/${dipset}-entire-view`);
      cy.wait(700);
      cy.get(`[data-cy=dipset-row-${dipset}]`).click();
      cy.wait(700);
    });
  });
});
