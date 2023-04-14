/// <reference types="cypress" />

const { fakeMenu } = require("../../helpers/fake-menu");
const { fakeDips } = require("../../helpers/fake-dips");
const { fakeDip } = require("../../helpers/fake-dip-details");
const { fakeNews } = require("../../helpers/fake-news");
const { fakeVars } = require("../../helpers/fake-vars");

describe("Details View", () => {
  before(() => {
    fakeVars();
    fakeNews();
    fakeDips();
    fakeDip();
    fakeMenu();
    cy.viewport(1536, 600);
    cy.visit(
      "/dips/md-viewer?mdUrl=https:%2F%2Fraw.githubusercontent.com%2Fmakerdao%2Fdips%2Fmaster%2FDIP1%2FDIP1c4-Subproposal-Template.md"
    );
    cy.get(".maker-loading-shade").should("not.exist");
  });

  it("Entire View", () => {
    Cypress.$("app-button-top").remove();
    cy.testScreenshot(null, "md-viewer/entire-view");
  });

  it("Content Table", () => {
    cy.testScreenshot(".content", "md-viewer/content-table");
  });

  it("Main content", () => {
    cy.get("app-detail-content")
      .first()
      .then(($el) => {
        cy.testScreenshot($el, "md-viewer/main-content");
      });
  });
});
